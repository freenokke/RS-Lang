import Pages from '../../enum/routing';
import { IWord } from '../../types/words';
import Page from '../helpers/page';
import Api from '../services/api';
import Template from './index.html';
import './style.scss';
import { Domain } from '../../enum/endpoints';
import Results from '../results';

function shuffleSprint<T>(array: T[]): T[] {
  array.sort(() => Math.random() - 0.5);
  return array;
}

export default class Sprint extends Page {
  private API: Api;
  private result: Results;
  private wordsForGame: IWord[];
  private answersButtonsArea: HTMLElement;
  private playButton: HTMLElement;
  private initialArrayOfWords: IWord[];
  private progressCheckboxes: NodeListOf<HTMLInputElement>;
  private knownWords: IWord[];
  private unknownWords: IWord[];
  private progressBlock: HTMLElement;
  private parameters: { group: number; page: number };
  private countdownNumberEl: HTMLElement;
  private gameWord: HTMLElement;
  private gameWordTranslate: HTMLElement;
  private rightButton: HTMLButtonElement;
  private wrongButton: HTMLButtonElement;
  private gameWordCheck: HTMLElement;

  constructor(
    gottenWords: IWord[],
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
    window.location.hash = Pages.sprint;
    this.API = Api.getInstance();
    this.parameters = {
      group: gottenWords[0].group,
      page: gottenWords[0].page,
    };
    this.knownWords = [];
    this.unknownWords = [];

    // const words =
    //   gottenWords.length > 20 ? gottenWords.splice(0, 20) : gottenWords;
    const words = gottenWords;
    words.length = 2;

    this.rightButton = this.node.querySelector('.true');
    this.wrongButton = this.node.querySelector('.false');
    this.gameWordCheck = this.node.querySelector('.game__word-check');

    // this.determineElements();
    // this.renderProgress(words.length);
    this.initGame(words);
    // this.initEventsListeners();
    this.startCountDown();
    this.addClickToGame();
    this.addIconToGame();
  }

  private async initGame(gottenWords: IWord[]): Promise<void> {
    this.initialArrayOfWords = gottenWords;
    this.wordsForGame = shuffleSprint(this.initialArrayOfWords);
    this.generateStep();
  }

  private generateStep() {
    const guessWord = this.wordsForGame[
      Math.floor(Math.random() * this.wordsForGame.length)
    ];
    const answerVariants = this.initialArrayOfWords.filter(
      (item) => item.id !== guessWord.id
    );
    const answerVariantsCount = 1;
    const guessWordBtn = this.createGuessWordBtn(guessWord);
    const variantsBtn = this.createVariantBtns(
      answerVariants,
      answerVariantsCount
    );
    const buttonsArray = shuffleSprint([guessWordBtn, ...variantsBtn]);

    // this.addButtonsListeners(buttonsArray, guessWord);
    this.answersButtonsArea.append(...buttonsArray);

    // const audio = new Audio();
    // audio.src = `${Domain.BASE}/${guessWord.audio}`;
    // audio.play();
    // this.playButton.onclick = () => {
    // 	audio.play();
    // };
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
      const randomWord = shuffleSprint(copy).pop();
      const btn = document.createElement('button');
      btn.setAttribute('data-guess', 'false');
      btn.classList.add('btn', 'btn_audiochallenge');
      btn.textContent = randomWord.wordTranslate;
      array.push(btn);
    }
    return array;
  }

  // private addButtonsListeners(buttons: HTMLElement[], guessWord: IWord) {
  // 	buttons.forEach((item) => {
  // 		item.addEventListener('click', () => {
  // 			this.wordsForGame = this.wordsForGame.filter(
  // 				(word) => word.id !== guessWord.id
  // 			);
  // 			// this.updateProgress(item, guessWord);
  // 			this.answersButtonsArea.innerHTML = '';
  // 			if (this.wordsForGame.length !== 0) {
  // 				this.generateStep();
  // 			} else {
  // 				this.node.remove();
  // 				this.result = new Results(
  // 					document.body,
  // 					this.knownWords,
  // 					this.unknownWords,
  // 					0,
  // 					this.parameters,
  // 					Pages.sprint
  // 				);
  // 			}
  // 		});
  // 	});
  // }

  // private updateProgress(item: HTMLElement, word: IWord) {
  // 	const notCheckedCheckboxes = Array.from(this.progressCheckboxes).filter(
  // 		(checkbox) => !checkbox.checked
  // 	);
  // 	const lastUnchecked = notCheckedCheckboxes[0];
  // 	lastUnchecked.checked = true;
  // 	const icon = lastUnchecked.nextElementSibling as HTMLElement;
  // 	if (item.dataset.guess === 'true') {
  // 		icon.style.color = '#FFBD12';
  // 		this.knownWords.push(word);
  // 	} else {
  // 		icon.style.color = '#F95A2C';
  // 		this.unknownWords.push(word);
  // 	}
  // }

  // private renderProgress(count: number) {
  // 	const elementHTML = `
  //   <div class="combo__item">
  //     <input type="checkbox" class="combo__checkbox">
  //     <i class="fa-solid fa-star fa"></i>
  //   </div>`;
  // 	for (let index = 0; index < count; index += 1) {
  // 		this.progressBlock.insertAdjacentHTML('afterbegin', elementHTML);
  // 	}
  // 	this.progressCheckboxes = this.node.querySelectorAll('.combo__checkbox');
  // }

  // private initEventsListeners(): void {
  //   // window.addEventListener(
  //   //   'popstate',
  //   //   () => {
  //   //     this.node.remove();
  //   //     window.history.go(-1);
  //   //   },
  //   //   { once: true }
  //   // );
  // }

  // private determineElements() {
  // 	this.answersButtonsArea = this.node.querySelector(
  // 		'.game__buttons_audiochallenge'
  // 	);
  // 	this.playButton = this.node.querySelector('.game__play-button');
  // 	this.progressBlock = this.node.querySelector('.game__combo');
  // }

  private startCountDown() {
    this.countdownNumberEl = this.node.querySelector('.countdown-number');
    let countdown = 60;
    this.countdownNumberEl.textContent = `${countdown}`;
    setInterval(() => {
      /* eslint-disable-next-line no-plusplus */
      countdown = --countdown <= 0 ? 60 : countdown;
      this.countdownNumberEl.textContent = `${countdown}`;
    }, 1000);
  }

  private fillLayoutWithGuessWords(word: IWord) {
    this.gameWord = this.node.querySelector('.game__word');
    this.gameWord.textContent = `${word}`;
    this.gameWordTranslate = this.node.querySelector('.game__word-translate');
    this.gameWord.textContent = word.wordTranslate;
  }

  private addClickToGame() {
    const audio = new Audio();
    audio.src = `${Pages.sprint}/sound/select-click.mp3`;
    this.rightButton.onclick = () => {
      audio.play();
    };
    this.wrongButton.onclick = () => {
      audio.play();
    };
  }

  private addIconToGame() {
    this.rightButton.onclick = () => {
      this.gameWordCheck.classList.remove('game__word-check--wrong');
      this.gameWordCheck.classList.add('game__word-check--right');
      setTimeout(
        () => this.gameWordCheck.classList.remove('game__word-check--right'),
        1000
      );
    };
    this.wrongButton.onclick = () => {
      this.gameWordCheck.classList.remove('game__word-check--right');
      this.gameWordCheck.classList.add('game__word-check--wrong');
      setTimeout(
        () => this.gameWordCheck.classList.remove('game__word-check--wrong'),
        1000
      );
    };
  }
}
