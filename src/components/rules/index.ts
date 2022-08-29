import Pages from '../../enum/routing';
import { IWord } from '../../types/words';
import Audiochallenge from '../audiochallenge';
import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';

export default class Rules extends Page {
  private closeBtn: HTMLElement;
  private startBtn: HTMLElement;
  private closeArea: HTMLElement;
  private wordsForGame: Promise<IWord[]>;

  constructor(
    parentNode: HTMLElement,
    gameName: string,
    rules: string,
    wordsForGame: Promise<IWord[]>,
    gameHash: string,
    comebackHash: string
  ) {
    super('main', ['main', 'rules-page'], parentNode, Template, {
      rules,
      gameName,
      hash: gameHash,
      comebackHash,
    });
    window.location.hash = Pages.rules;
    this.wordsForGame = wordsForGame;
    this.closeBtn = this.node.querySelector('.audio-challenge-rules__close');
    this.startBtn = this.node.querySelector('.wave-btn');
    this.closeArea = this.node.querySelector('.audio-challenge-rules__area');
    this.initEventListeners();
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
      const game = new Audiochallenge(
        this.wordsForGame,
        Pages.games,
        document.body
      );
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
