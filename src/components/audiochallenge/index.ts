import Pages from '../../enum/routing';
import { IWord } from '../../types/words';
import Page from '../helpers/page';
import Api from '../services/api';
import Template from './index.html';
import './style.scss';
import { Domain } from '../../enum/endpoints';
import Results from '../results';

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
  private progressBlock: HTMLElement;
  private parameters: { group: number; page: number };
  private fullScreenBtn: HTMLElement;
  private audio: HTMLAudioElement;
  private guessWord: IWord;
  private doNotKnowBtn: HTMLElement;

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
      { comebackHash }
    );
    window.location.hash = Pages.audiochallenge;
    this.API = Api.getInstance();
    this.parameters = {
      group: gottenWords[0].group,
      page: gottenWords[0].page,
    };
    this.knownWords = [];
    this.unknownWords = [];

    const words =
      gottenWords.length > 20 ? gottenWords.splice(0, 20) : gottenWords;

    this.determineElements();
    this.renderProgress(words.length);
    this.initGame(words);
    this.initEventsListeners();
  }

  private async initGame(gottenWords: IWord[]): Promise<void> {
    this.initialArrayOfWords = gottenWords;
    this.wordsForGame = shuffle(this.initialArrayOfWords);
    this.generateStep();
  }

  private generateStep() {
    this.guessWord = this.wordsForGame[
      Math.floor(Math.random() * this.wordsForGame.length)
    ];
    const answerVariants = this.initialArrayOfWords.filter(
      (item) => item.id !== this.guessWord.id
    );
    const answerVariantsCount = 4;
    const guessWordBtn = this.createGuessWordBtn();
    const variantsBtn = this.createVariantBtns(
      answerVariants,
      answerVariantsCount
    );
    const buttonsArray = shuffle([guessWordBtn, ...variantsBtn]);

    this.addButtonsListeners(buttonsArray);
    this.answersButtonsArea.append(...buttonsArray);

    this.audio = new Audio();
    this.audio.src = `${Domain.BASE}/${this.guessWord.audio}`;
    this.audio.play();
    this.playButton.onclick = () => {
      this.audio.play();
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private createGuessWordBtn(): HTMLElement {
    const btn = document.createElement('button');
    btn.setAttribute('data-guess', 'true');
    btn.classList.add('btn', 'btn_audiochallenge');
    btn.textContent = this.guessWord.wordTranslate;
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

  private addButtonsListeners(buttons: HTMLElement[]) {
    buttons.forEach((item) => {
      item.addEventListener('click', () => {
        this.defineRightOrNot(item);
      });
    });
  }

  private defineRightOrNot(item: HTMLElement) {
    this.wordsForGame = this.wordsForGame.filter(
      (word) => word.id !== this.guessWord.id
    );
    this.updateProgress(item, this.guessWord);
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
        this.parameters,
        Pages.audiochallenge
      );
      document.removeEventListener('keyup', this.keyboardHandle);
    }
  }

  private updateProgress(item: HTMLElement, word: IWord) {
    const notCheckedCheckboxes = Array.from(this.progressChecboxes).filter(
      (checkbox) => !checkbox.checked
    );
    const lastUnchecked = notCheckedCheckboxes[0];
    lastUnchecked.checked = true;
    const icon = lastUnchecked.nextElementSibling as HTMLElement;
    if (item.dataset.guess === 'true') {
      icon.style.color = '#FFBD12';
      this.knownWords.push(word);
    } else {
      icon.style.color = '#F95A2C';
      this.unknownWords.push(word);
    }
  }

  private renderProgress(count: number) {
    const elementHTML = `
    <div class="combo__item">
      <input type="checkbox" class="combo__checkbox">
      <i class="fa-solid fa-star fa"></i>
    </div>`;
    for (let index = 0; index < count; index += 1) {
      this.progressBlock.insertAdjacentHTML('afterbegin', elementHTML);
    }
    this.progressChecboxes = this.node.querySelectorAll('.combo__checkbox');
  }

  private determineElements() {
    this.answersButtonsArea = this.node.querySelector(
      '.game__buttons_audiochallenge'
    );
    this.playButton = this.node.querySelector('.game__play-button');
    this.progressBlock = this.node.querySelector('.game__combo');
    this.fullScreenBtn = this.node.querySelector('.fullscreen__icon');
    this.doNotKnowBtn = this.node.querySelector('.btn_donotknow');
  }

  private initEventsListeners(): void {
    this.initFullScreenListener();
    this.initKeyboardListeners();
    this.doNotKnowBtn.onclick = () => {
      this.defineRightOrNot(this.doNotKnowBtn);
    };
    // window.addEventListener(
    //   'popstate',
    //   () => {
    //     this.node.remove();
    //     window.history.go(-1);
    //   },
    //   { once: true }
    // );
  }

  private initFullScreenListener() {
    this.fullScreenBtn.addEventListener('click', () => {
      if (document.fullscreen) {
        document.exitFullscreen();
        (this.fullScreenBtn.firstElementChild as HTMLElement).hidden = false;
        (this.fullScreenBtn.lastElementChild as HTMLElement).hidden = true;
      } else {
        document.body.requestFullscreen();
        (this.fullScreenBtn.firstElementChild as HTMLElement).hidden = true;
        (this.fullScreenBtn.lastElementChild as HTMLElement).hidden = false;
      }
    });
  }

  private initKeyboardListeners() {
    document.addEventListener('keyup', this.keyboardHandle);
  }

  private keyboardHandle = (e: KeyboardEvent) => {
    if (e.code === 'Digit1') {
      const element = this.answersButtonsArea.children[0] as HTMLElement;
      if (element) {
        this.keyboardStep(element);
      }
    }
    if (e.code === 'Digit2') {
      const element = this.answersButtonsArea.children[1] as HTMLElement;
      if (element) {
        this.keyboardStep(element);
      }
    }
    if (e.code === 'Digit3') {
      const element = this.answersButtonsArea.children[2] as HTMLElement;
      if (element) {
        this.keyboardStep(element);
      }
    }
    if (e.code === 'Digit4') {
      const element = this.answersButtonsArea.children[3] as HTMLElement;
      if (element) {
        this.keyboardStep(element);
      }
    }
    if (e.code === 'Digit5') {
      const element = this.answersButtonsArea.children[4] as HTMLElement;
      if (element) {
        this.keyboardStep(element);
      }
    }
    if (e.code === 'Space') {
      this.audio.play();
    }
    if (e.code === 'Enter') {
      this.keyboardStep(this.doNotKnowBtn);
    }
  };

  private keyboardStep(element: HTMLElement) {
    const btn = element;
    btn.classList.add('push');
    btn.onanimationend = () => {
      btn.classList.remove('push');
      this.defineRightOrNot(element);
    };
  }
}
