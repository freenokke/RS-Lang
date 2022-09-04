import Page from '../../../../helpers/page';
import Template from './index.html';
import './style.scss';

export default class Level extends Page {
  private level: number;

  private onLevelChanged: (level: number) => void;

  private input: HTMLElement;

  private isChecked: boolean;

  constructor(
    parentNode: HTMLElement,
    level: number,
    label: string,
    text: string,
    start: number,
    end: number,
    isChecked: boolean,
    onLevelChanged: (level: number) => void
  ) {
    super('label', ['wordsbook-levels__label'], parentNode, Template, {
      label,
      text,
      start: start.toString(),
      end: end.toString(),
    });
    this.onLevelChanged = onLevelChanged;
    this.level = level;
    this.isChecked = isChecked;
    this.init();
    this.initEventListeners();
  }

  init() {
    this.input = this.node.querySelector('.wordsbook-levels__input');
    if (this.isChecked) {
      this.input.setAttribute('checked', 'true');
    }
  }

  initEventListeners() {
    this.node.addEventListener('click', () => {
      this.onLevelChanged(this.level);
    });
  }
}
