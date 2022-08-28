import Page from '../../../helpers/page';
import Template from './index.html';
import './style.scss';

export default class ResultRow extends Page {
  private audioSrc: string;
  private playButton: HTMLElement;

  constructor(
    parentNode: HTMLElement,
    word: string,
    translation: string,
    audioSrc: string
  ) {
    super('div', ['results-row'], parentNode, Template, { word, translation });
    this.audioSrc = audioSrc;
    this.init();
    this.addEventListeners();
  }

  private init() {
    this.playButton = this.node.querySelector('.results-row__button');
  }

  private addEventListeners() {
    this.playButton.addEventListener('click', () => {
      const audio = new Audio();
      audio.src = this.audioSrc;
      audio.play();
    });
  }
}
