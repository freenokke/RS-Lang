import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';
import { IWord } from '../../types/words';

export default class Sprint extends Page {
  static wrongButton: HTMLElement;
  static rightButton: HTMLElement;
  static countdownNumberEl: HTMLElement;

  constructor(
    wordsList: IWord[],
    comebackHash: string,
    parentNode: HTMLElement | null
  ) {
    super(
      'main',
      ['main', 'fullscreen', 'sprint-page'],
      parentNode,
      Template,
      {}
    );
  }

  static sprintListener() {
    this.wrongButton = document.querySelector('.false');
    this.wrongButton.addEventListener('click', () => console.log('Wrong'));
    this.rightButton = document.querySelector('.true');
    this.rightButton.addEventListener('click', () => console.log('Right'));
  }

  static startCountDown() {
    this.countdownNumberEl = document.getElementById('countdown-number');
    let countdown = 60;
    this.countdownNumberEl.textContent = `${countdown}`;
    setInterval(() => {
      /* eslint-disable-next-line no-plusplus */
      countdown = --countdown <= 0 ? 60 : countdown;
      this.countdownNumberEl.textContent = `${countdown}`;
    }, 1000);
  }
}
