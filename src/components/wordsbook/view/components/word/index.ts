import { IWord, IWordWithDifficulty } from '../../../../../types/words';
import Page from '../../../../helpers/page';
import Template from './index.html';

export default class Word extends Page {
  private isChecked;

  private input: HTMLElement;

  private word: IWordWithDifficulty;

  private handler;

  private wordWrapper: HTMLDivElement;

  private isDifficult: boolean = false;

  private isLearned: boolean = false;

  constructor(
    parentNode: HTMLElement,
    word: IWordWithDifficulty,
    isChecked: boolean,
    handler: (word: IWord) => void,
    isDifficult: boolean,
    isLearned: boolean
  ) {
    super('label', ['wordsbook-words__label'], parentNode, Template, {
      word: word.word,
      translation: word.wordTranslate,
    });
    this.word = word;
    this.isChecked = isChecked;
    this.isDifficult = isDifficult;
    this.isLearned = isLearned;
    this.handler = handler;
    this.init();
    this.initEventListeners();
  }

  init() {
    this.input = this.node.querySelector('.wordsbook-words__radiobutton');
    if (this.isChecked) this.input.setAttribute('checked', 'checked');
    this.wordWrapper = this.node.querySelector(
      '.wordsbook-words__word-wrapper'
    );
    // eslint-disable-next-line no-underscore-dangle
    this.wordWrapper.setAttribute('data-id', this.word._id);
    if (this.isDifficult)
      this.wordWrapper.classList.add('wordsbook-words__word-wrapper_difficult');
    if (this.isLearned)
      this.wordWrapper.classList.add('wordsbook-words__word-wrapper_learned');
  }

  initEventListeners() {
    this.node.addEventListener('click', () => {
      this.handler(this.word);
    });
  }
}
