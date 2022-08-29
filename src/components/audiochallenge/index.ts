// import Pages from '../../enum/routing';
import Pages from '../../enum/routing';
import { IWord } from '../../types/words';
import Page from '../helpers/page';
import Api from '../services/api';
import Template from './index.html';
import './style.scss';
import { Domain } from '../../enum/endpoints';
import Results from '../results';
// import Results from '../results';

function shuffle<T>(array: T[]): T[] {
  array.sort(() => Math.random() - 0.5);
  return array;
}

export default class Audiochallenge extends Page {
  private API: Api;
  private result: Results;
  private wordsForGame: IWord[];
  private answersButtonsArea: HTMLElement;
  private playButton: HTMLElement;
  private initialArrayOfWords: IWord[];
  private progressChecboxes: NodeListOf<HTMLInputElement>;
  private knownWords: IWord[];
  private unknownWords: IWord[];

  constructor(
    gottenWords: IWord[],
    comebackHash: string,
    parentNode: HTMLElement | null
  ) {
    super(
      'main',
      ['main', 'fullscreen', 'audiochallenge-page'],
      parentNode,
      Template,
      {}
    );
    window.location.hash = Pages.audiochallenge;
    this.API = Api.getInstance();
    this.answersButtonsArea = this.node.querySelector(
      '.game__buttons_audiochallenge'
    );
    this.playButton = this.node.querySelector('.game__play-button');
    this.progressChecboxes = this.node.querySelectorAll('.combo__checkbox');
    this.knownWords = [];
    this.unknownWords = [];

    this.initGame(gottenWords);
    this.initEventsListeners();
  }

  private async initGame(gottenWords: IWord[]): Promise<void> {
    this.initialArrayOfWords = gottenWords;
    this.wordsForGame = shuffle(this.initialArrayOfWords);
    this.generateStep();
  }

  private initEventsListeners(): void {
    window.addEventListener(
      'popstate',
      () => {
        this.node.remove();
        window.history.go(-1);
      },
      { once: true }
    );
  }

  private generateStep() {
    const guessWord = this.wordsForGame[
      Math.floor(Math.random() * this.wordsForGame.length)
    ];
    const answerVariants = this.initialArrayOfWords.filter(
      (item) => item.id !== guessWord.id
    );
    const answerVariantsCount = 4;
    const guessWordBtn = this.createGuessWordBtn(guessWord);
    const variantsBtn = this.createVariantBtns(
      answerVariants,
      answerVariantsCount
    );
    const buttonsArray = shuffle([guessWordBtn, ...variantsBtn]);

    this.addButtonsListeners(buttonsArray, guessWord);
    this.answersButtonsArea.append(...buttonsArray);

    const audio = new Audio();
    audio.src = `${Domain.BASE}/${guessWord.audio}`;
    audio.play();
    this.playButton.onclick = () => {
      audio.play();
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private createGuessWordBtn(word: IWord): HTMLElement {
    const btn = document.createElement('button');
    btn.setAttribute('data-guess', 'true');
    btn.classList.add('btn', 'btn_audiochallenge');
    btn.textContent = word.wordTranslate;
    return btn;
  }

  // eslint-disable-next-line class-methods-use-this
  private createVariantBtns(variants: IWord[], count: number): HTMLElement[] {
    const copy = [...variants];
    const array = [];
    for (let i = 0; i < count; i += 1) {
      const randomWord = shuffle(copy).pop();
      const btn = document.createElement('button');
      btn.setAttribute('data-guess', 'false');
      btn.classList.add('btn', 'btn_audiochallenge');
      btn.textContent = randomWord.wordTranslate;
      array.push(btn);
    }
    return array;
  }

  private addButtonsListeners(buttons: HTMLElement[], guessWord: IWord) {
    buttons.forEach((item) => {
      item.addEventListener('click', () => {
        this.wordsForGame = this.wordsForGame.filter(
          (word) => word.id !== guessWord.id
        );
        this.updateProgress(item);
        this.answersButtonsArea.innerHTML = '';
        if (this.wordsForGame.length !== 0) {
          this.generateStep();
        } else {
          this.node.remove();
          this.result = new Results(
            document.body,
            this.knownWords,
            this.unknownWords,
            0,
            Pages.audiochallenge
          );
        }
      });
    });
  }

  private updateProgress(item: HTMLElement) {
    const notCheckedCheckboxes = Array.from(this.progressChecboxes).filter(
      (checkbox) => !checkbox.checked
    );
    const lastUnchecked = notCheckedCheckboxes[0];
    lastUnchecked.checked = true;
    const icon = lastUnchecked.nextElementSibling as HTMLElement;
    if (item.dataset.guess === 'true') {
      icon.style.color = '#FFBD12';
      this.knownWords.push(
        this.initialArrayOfWords.find(
          (value) => value.wordTranslate === item.textContent
        )
      );
    } else {
      icon.style.color = '#F95A2C';
      this.unknownWords.push(
        this.initialArrayOfWords.find(
          (value) => value.wordTranslate === item.textContent
        )
      );
    }
    console.log(this.knownWords, this.unknownWords);
  }
}
