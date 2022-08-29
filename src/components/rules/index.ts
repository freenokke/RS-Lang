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
  private rules;

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
    window.location.hash = Pages.rules;

    this.gameName = gameName;
    this.wordsForGame = wordsForGame;

    this.rules = this.node.querySelector('.audio-challenge-rules__text');
    this.closeBtn = this.node.querySelector('.audio-challenge-rules__close');
    this.startBtn = this.node.querySelector('.wave-btn');
    this.closeArea = this.node.querySelector('.audio-challenge-rules__area');
    this.renderRulesText(gameName, levelName);
    this.initEventListeners();
  }

  private renderRulesText(gameName: string, levelName: string) {
    let rules: string;
    if (gameName === 'Sprint') {
      rules = `Выберите соответсвует ли перевод предложенному слову. Выбранный уровень сложности ${levelName}`;
    } else {
      rules = `Вам нужно угадать слова, которые вы услышите. Выбранный уровень сложности ${levelName}`;
    }
    this.rules.textContent = rules;
  }

  private initEventListeners() {
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
        game = new Sprint(this.wordsForGame, Pages.games, document.body);
      } else {
        game = new Audiochallenge(
          this.wordsForGame,
          Pages.games,
          document.body
        );
      }
      game.node.id = 'game';
    };

    window.addEventListener(
      'popstate',
      () => {
        this.node.remove();
      },
      { once: true }
    );
  }
}
