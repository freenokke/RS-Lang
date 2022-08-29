import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';
import { IWord } from '../../types/words';

export default class Sprint extends Page {
  static wrongButton: HTMLElement;
  static rightButton: HTMLElement;
  static countdownNumberEl: HTMLElement;
  // static comboCheckbox: NodeListOf<HTMLElement>;
  static comboCheckboxArray: Array<HTMLElement>;

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
    this.comboCheckboxArray = Array.from(
      document.querySelectorAll('.combo__checkbox')
    );
    this.wrongButton = document.querySelector('.false');
    this.wrongButton.addEventListener('click', () => {
      for (let i = 0; i < this.comboCheckboxArray.length; i += 1) {
        if (i === this.comboCheckboxArray.length - 1) {
          this.comboCheckboxArray.forEach((el) =>
            el.removeAttribute('checked')
          );
          i = 0;
        } else {
          this.comboCheckboxArray[i].setAttribute('checked', 'checked');
          break;
        }
      }
    });
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

  // static checkboxChange() {
  //   this.comboCheckboxArray = Array.from(
  //     document.querySelectorAll('.combo__checkbox')
  //   );
  //   for (let i = 0; i < this.comboCheckboxArray.length; i += 1) {
  //     if (i === this.comboCheckboxArray.length - 1) {
  //       this.comboCheckboxArray.forEach((el) => el.removeAttribute('checked'));
  //       i = 0;
  //     } else {
  //       this.comboCheckboxArray[i].setAttribute('checked', 'checked');
  //       break;
  //     }
  //   }
  // }
}
