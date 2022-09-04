import { IWord } from '../../../../../types/words';
import Page from '../../../../helpers/page';
import Template from './index.html';

export default class Word extends Page {
  private isChecked;

  private input: HTMLElement;

  private word: IWord;

  private handler;

  constructor(
    parentNode: HTMLElement,
    word: IWord,
    isChecked: boolean,
    handler: (word: IWord) => void
  ) {
    super('label', ['wordsbook-words__label'], parentNode, Template, {
      word: word.word,
      translation: word.wordTranslate,
    });
    this.word = word;
    this.isChecked = isChecked;
    this.handler = handler;
    this.init();
    this.initEventListeners();
  }

  init() {
    this.input = this.node.querySelector('.wordsbook-words__radiobutton');
    if (this.isChecked) this.input.setAttribute('checked', 'checked');
  }

  initEventListeners() {
    this.node.addEventListener('click', () => {
      this.handler(this.word);
    });
  }
}
