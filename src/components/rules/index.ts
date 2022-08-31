import Pages from '../../enum/routing';
import { IWord } from '../../types/words';
import Audiochallenge from '../audiochallenge';
import Page from '../helpers/page';
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

  constructor(
    parentNode: HTMLElement,
    gameName: string,
    levelName: string,
    wordsForGame: IWord[],
    gameHash: string,
    comebackHash: string
  ) {
    super('main', ['main', 'rules-page'], parentNode, Template, {
      gameName,
      hash: gameHash,
      comebackHash,
    });
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
      Клавиши 1-5 соответствуют порядковому номеру ответа с лева на право.</br>
      Пробел повторно воспроизводит аудио.</br>
      Enter соответсвует кнопке "Не знаю".`;
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
        game = new Sprint(this.wordsForGame, this.comebackHash, document.body);
      } else {
        game = new Audiochallenge(
          this.wordsForGame,
          this.comebackHash,
          document.body
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
