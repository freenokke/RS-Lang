import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';
import { IWord } from '../../types/words';
import ResultRow from './components/resultRow';
import Pages from '../../enum/routing';

export default class Results extends Page {
  private knownWords: IWord[];

  private unknownWords: IWord[];

  private playOnceMoreButton: HTMLButtonElement;

  private toWordsbookButton: HTMLButtonElement;

  private resultsContainer: HTMLElement;

  private gameHash: string;

  private wordsRows: ResultRow[];

  constructor(
    parentNode: HTMLElement,
    knownWords: IWord[],
    unknownWords: IWord[],
    score: number,
    gameHash: string
  ) {
    super('main', ['fullscreen', 'results-page'], parentNode, Template, {
      score: score.toString(),
    });
    this.knownWords = knownWords;
    this.unknownWords = unknownWords;
    this.gameHash = gameHash;
    this.init();
    this.addEventListeners();
    this.renderResults();
  }

  private init() {
    this.playOnceMoreButton = this.node.querySelector(
      '#resultsPlayOnceMoreButton'
    );
    this.toWordsbookButton = this.node.querySelector('#resultsToWordsbook');
    this.resultsContainer = this.node.querySelector('.results-container');
    this.wordsRows = [];
  }

  addEventListeners() {
    this.playOnceMoreButton.addEventListener('click', () => {
      window.location.hash = this.gameHash;
    });
    this.toWordsbookButton.addEventListener('click', () => {
      window.location.hash = Pages.wordsbook;
    });
    window.addEventListener(
      'popstate',
      () => {
        this.node.remove();
      },
      { once: true }
    );
  }

  private renderResults() {
    if (this.knownWords.length > 0) {
      const h2 = Results.createH2(`Знаю: ${this.knownWords.length}`);
      this.resultsContainer.append(h2);
      this.renderWords(this.knownWords, this.resultsContainer);
    }
    if (this.unknownWords.length > 0) {
      const h2 = Results.createH2(`Не знаю: ${this.unknownWords.length}`);
      this.resultsContainer.append(h2);
      this.renderWords(this.knownWords, this.resultsContainer);
    }
  }

  private renderWords(words: IWord[], container: HTMLElement) {
    const w = words.map(
      (x) => new ResultRow(container, x.word, x.wordTranslate, x.audio)
    );
    this.wordsRows = [...this.wordsRows, ...w];
  }

  private static createH2(text: string) {
    const h2 = document.createElement('h2');
    h2.classList.add('results-container__h2');
    h2.textContent = text;
    return h2;
  }
}
