import Pages from '../../enum/routing';
import { ILocalStorageUserData } from '../../types/users';
import { IWord } from '../../types/words';
import Audiochallenge from '../audiochallenge';
import Page from '../helpers/page';
import Api from '../services/api';
import Sprint from '../sprint';
import Template from './index.html';
import './style.scss';

export default class Rules extends Page {
  private closeBtn: HTMLElement;
  private startBtn: HTMLElement;
  private closeArea: HTMLElement;
  private wordsForGame: IWord[];
  private gameName;
  private rules: HTMLElement;
  private comebackHash: string;
  private api: Api;
  private params: { group: string; page: string };

  constructor(
    parentNode: HTMLElement,
    gameName: string,
    levelName: string,
    wordsForGame: IWord[],
    gameHash: string,
    comebackHash: string,
    params: { group: string; page: string }
  ) {
    super('main', ['main', 'rules-page'], parentNode, Template, {
      gameName,
      hash: gameHash,
      comebackHash,
    });
    this.api = Api.getInstance();
    this.params = params;
    this.node.id = 'current-page';
    if (gameName === 'Audiochallenge') {
      window.location.hash = Pages.audiochallenge;
    } else {
      window.location.hash = Pages.sprint;
    }

    this.gameName = gameName;
    this.comebackHash = comebackHash;
    this.wordsForGame = wordsForGame;
    this.determineElements();
    this.renderRulesText(gameName, levelName);
    this.initEventListeners();

    if (localStorage.getItem('userData') === null) {
      this.showNotification();
    } else {
      this.checkTokenExpiraton(JSON.parse(localStorage.getItem('userData')));
    }
  }

  private async checkTokenExpiraton(userData: ILocalStorageUserData) {
    const res = await this.api.checkUserTokens(
      userData.userId,
      userData.userRefreshToken
    );
    if (!res) {
      this.showWarning();
    }
  }

  private showWarning() {
    const warningHTML = `
    <div class="warning">
      <div class="warning__icon">
        <i class="fa-sharp fa-solid fa-circle-exclamation fa-lg"></i>
      </div>
      <div class="warning__text">
        <p>Время сессии закончилось, результаты игры не будут сохранены в статистику.</p>
        <p>Для возобновления сессии, <a href="#/auth">авторизуйтесь</a></p>
      </div>
    </div>
    `;
    this.node.insertAdjacentHTML('afterbegin', warningHTML);
    const warning = this.node.querySelector('.warning');
    warning.classList.add('warning_active');
  }

  private showNotification() {
    const notificationHTML = `
    <div class="notification">
      <div class="notification__icon">
        <i class="fa-solid fa-bell fa-lg"></i>
      </div>
      <div class="warning__text">
        <p>Вы не авторизованы</p>
        <p>Напоминаем, что для авторизованных пользователей доступна статистика и прогресс изучения слов</p>
      </div>
    </div>
    `;
    this.node.insertAdjacentHTML('afterbegin', notificationHTML);
    const notification = this.node.querySelector('.notification');
    setTimeout(() => {
      notification.classList.add('notification_active');
      setTimeout(() => {
        notification.classList.remove('notification_active');
      }, 5000);
    }, 1500);
  }

  private renderRulesText(gameName: string, levelName: string): void {
    let rules: string;
    if (gameName === 'Sprint') {
      rules = `Выберите соответсвует ли перевод предложенному слову. Выбранный уровень сложности ${levelName}.`;
    } else {
      rules = `
      Выберите соответсвует ли перевод предложенному слову.</br>
      Выбранный уровень сложности: <b>${levelName}</b>.</br>
      Управление осуществляется мышью или клавиатурой.</br></br>
      Выбор ответа осуществляется <b>клавишами 1-5</b></br>
      <b>Пробел</b> повторно воспроизводит аудио.</br>
      <b>Enter</b> соответсвует кнопке "Не знаю".`;
    }
    this.rules.innerHTML = rules;
  }

  private initEventListeners(): void {
    this.closeBtn.onclick = () => {
      this.node.remove();
    };

    this.closeArea.onclick = () => {
      this.node.remove();
    };

    this.startBtn.onclick = (e) => {
      e.preventDefault();
      this.node.remove();
      let game: Audiochallenge | Sprint;
      if (this.gameName === 'Sprint') {
        game = new Sprint(
          this.wordsForGame,
          this.comebackHash,
          document.body,
          this.params
        );
      } else {
        game = new Audiochallenge(
          this.wordsForGame,
          this.comebackHash,
          document.body,
          this.params
        );
      }
      game.node.id = 'current-page';
    };
  }

  private determineElements(): void {
    this.rules = this.node.querySelector('.audio-challenge-rules__text');
    this.closeBtn = this.node.querySelector('.audio-challenge-rules__close');
    this.startBtn = this.node.querySelector('.wave-btn');
    this.closeArea = this.node.querySelector('.audio-challenge-rules__area');
  }
}
