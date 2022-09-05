import Pages from '../../enum/routing';
import { IWord } from '../../types/words';
import Page from '../helpers/page';
import Api from '../services/api';
import Template from './index.html';
import './style.scss';
// import { Domain } from '../../enum/endpoints';
import Results from '../results';

function shuffleSprint<T>(array: T[]): T[] {
  array.sort(() => Math.random() - 0.5);
  return array;
}

export default class Sprint extends Page {
  private API: Api;
  private result: Results;
  private wordsForGame: IWord[];
  private initialArrayOfWords: IWord[];
  private knownWords: IWord[];
  private unknownWords: IWord[];
  private countdownNumberEl: HTMLElement;
  private gameWord: HTMLElement;
  private gameWordTranslate: HTMLElement;
  private rightButton: HTMLButtonElement;
  private wrongButton: HTMLButtonElement;
  private gameWordCheck: HTMLElement;
  private params: { group: string; page: string };
  private audioRight: HTMLAudioElement;
  private audioWrong: HTMLAudioElement;
  private gameButtons: NodeListOf<HTMLButtonElement>;
  private gameGeneratedWord: IWord;
  private gameGeneratedTranslate: IWord;
  private gameSeries: IWord[];
  private gameLongestSeries: IWord[];
  private starsCheckbox: NodeListOf<HTMLInputElement>;
  private gameBonus: HTMLElement;
  private sprintPointsCount: HTMLElement;
  private timerID: NodeJS.Timer;
  private currentPage: string;
  private fullScreenBtn: HTMLElement;
  private closeGameBtn: HTMLElement;
  private comeBackHash: string;

  constructor(
    gottenWords: IWord[],
    comebackHash: string,
    parentNode: HTMLElement | null,
    params: { group: string; page: string }
  ) {
    super('main', ['main', 'fullscreen', 'sprint-page'], parentNode, Template, {
      comebackHash,
    });
    window.location.hash = Pages.sprint;
    this.API = Api.getInstance();
    this.params = params;
    this.comeBackHash = comebackHash;
    this.knownWords = [];
    this.unknownWords = [];
    this.gameSeries = [];
    this.gameLongestSeries = [];
    this.gameButtons = this.node.querySelectorAll('.btn');
    this.rightButton = this.node.querySelector('.true');
    this.wrongButton = this.node.querySelector('.false');
    this.gameWordCheck = this.node.querySelector('.game__word-check');
    this.gameWord = this.node.querySelector('.game__word');
    this.gameWordTranslate = this.node.querySelector('.game__word-translate');
    this.audioRight = new Audio(`../../assets/sound/select-click.mp3`);
    this.audioWrong = new Audio(`../../assets/sound/error-click.mp3`);
    this.starsCheckbox = this.node.querySelectorAll('.combo__checkbox');
    this.gameBonus = this.node.querySelector('.game__bonus');
    this.sprintPointsCount = this.node.querySelector('.sprint-points__count');
    this.currentPage = params.page;
    this.initGame(gottenWords);
    this.startCountDown();
    this.initEventListeners();
    this.fullScreenBtn = this.node.querySelector('.fullscreen__icon');
    this.initFullScreenListener();
    this.closeGameBtn = this.node.querySelector('.close-game');
    this.initCloseBtnListener();
  }

  private async initGame(gottenWords: IWord[]): Promise<void> {
    this.initialArrayOfWords = gottenWords;
    this.wordsForGame = shuffleSprint(this.initialArrayOfWords);
    this.generateStep();
  }

  private async additionalWordsToGame() {
    const prevPage = +this.currentPage - 1;
    this.currentPage = prevPage.toString();
    if (prevPage >= 0) {
      const words = await this.API.getWords(
        this.params.group,
        prevPage.toString()
      );
      this.wordsForGame = this.wordsForGame.concat(words);
    } else {
      clearInterval(this.timerID);
      this.node.remove();
      this.result = new Results(
        document.body,
        this.knownWords,
        this.unknownWords,
        +this.sprintPointsCount.textContent,
        this.gameLongestSeries.length,
        this.params,
        Pages.sprint
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private generateStep() {
    this.generateWordAndWordTranslate();
    this.checkWordAndWordTranslate();
    this.checkWordByKeyboard();
  }

  private async generateWordAndWordTranslate() {
    if (
      this.knownWords.includes(this.gameGeneratedWord) ||
      this.unknownWords.includes(this.gameGeneratedWord)
    ) {
      this.filterGeneratedArray();
    }
    if (this.wordsForGame.length === 0) {
      console.log('сработал');
      await this.additionalWordsToGame();
    }
    this.gameGeneratedWord = this.wordsForGame[
      Math.floor(Math.random() * this.wordsForGame.length)
    ]; // определим слово для угадывания
    this.gameGeneratedTranslate = Math.round(Math.random())
      ? this.gameGeneratedWord
      : this.wordsForGame[Math.floor(Math.random() * this.wordsForGame.length)];
    this.gameWord.textContent = this.gameGeneratedWord.word; // записать слово и перевод в соответствущие поля HTML
    this.gameWordTranslate.textContent = this.gameGeneratedTranslate.wordTranslate;
  }

  private checkWordAndWordTranslate() {
    this.gameButtons.forEach((el) =>
      el.addEventListener('click', () => {
        if (
          (this.gameGeneratedWord.wordTranslate ===
            this.gameGeneratedTranslate.wordTranslate &&
            el.classList.contains('true')) ||
          (this.gameGeneratedWord.wordTranslate !==
            this.gameGeneratedTranslate.wordTranslate &&
            el.classList.contains('false'))
        ) {
          setTimeout(() => el.focus(), 100);
          this.doIfRight();
          setTimeout(() => el.blur(), 100);
        } else {
          setTimeout(() => el.focus(), 100);
          this.doIfWrong();
          setTimeout(() => el.blur(), 100);
        }
      })
    );
    // описать реакцию программы на правильный или неправильный выбор
    // в зависимости от того правильно отгадано или нет, вывести иконку и записать
    // это слово в опредленный массив knownwords или unknownwords
  }

  private checkWordByKeyboard() {
    document.addEventListener('keydown', this.buttonHandler);
    // добавить управление через клавиатуру
  }

  private buttonHandler = (e: KeyboardEvent) => {
    if (e.code === 'ArrowRight') {
      this.rightButton.click();
      this.rightButton.focus();
      setTimeout(() => this.rightButton.blur(), 300);
    } else if (e.code === 'ArrowLeft') {
      this.wrongButton.click();
      this.wrongButton.focus();
      setTimeout(() => this.wrongButton.blur(), 300);
    }
  };

  private filterGeneratedArray() {
    this.wordsForGame = this.wordsForGame.filter(
      (guessWord) => guessWord.id !== this.gameGeneratedWord.id
    ); // убрать это слово из общего массива
  }

  private doIfRight() {
    this.gameWordCheck.classList.remove('game__word-check--wrong');
    this.gameWordCheck.classList.add('game__word-check--right');
    this.audioRight.play();
    setTimeout(
      () => this.gameWordCheck.classList.remove('game__word-check--right'),
      100
    );
    this.knownWords.push(this.gameGeneratedWord);
    this.gameSeries.push(this.gameGeneratedWord);
    this.generateWordAndWordTranslate();
    // eslint-disable-next-line no-unreachable-loop
    for (let i = 0; i < this.starsCheckbox.length; i += 1) {
      if (!this.starsCheckbox[i].hasAttribute('checked')) {
        this.starsCheckbox[i].setAttribute('checked', 'checked');
        break;
      }
    }
    if (
      Array.from(this.starsCheckbox).every((el) => el.hasAttribute('checked'))
    ) {
      this.gameBonus.textContent = `+40`;
    } else {
      this.gameBonus.textContent = `+20`;
    }
    this.sprintPointsCount.textContent = (
      +this.sprintPointsCount.textContent + +this.gameBonus.textContent
    ).toString();
    // обновить комбо и текущий результат
    // если 3 подряд ПРАВИЛЬНЫХ ответа комбо увеличивается на 20, и продолжает таковым быть до следующего кобма и так далее
  }

  private doIfWrong() {
    this.gameWordCheck.classList.remove('game__word-check--right');
    this.gameWordCheck.classList.add('game__word-check--wrong');
    this.audioWrong.play();
    setTimeout(
      () => this.gameWordCheck.classList.remove('game__word-check--wrong'),
      100
    );
    if (this.gameSeries.length > this.gameLongestSeries.length) {
      this.gameLongestSeries = [...this.gameSeries];
    }
    this.gameSeries = [];
    // console.log(this.gameLongestSeries.length); // запишем слово в самую длинную серию
    this.unknownWords.push(this.gameGeneratedWord);
    this.generateWordAndWordTranslate();
    this.starsCheckbox.forEach((el) => el.removeAttribute('checked'));
    this.gameBonus.textContent = `+20`;
    // при ошибке комбо = 20
  }

  private startCountDown() {
    this.countdownNumberEl = this.node.querySelector('.countdown-number');
    let countdown = 60;
    this.countdownNumberEl.textContent = `${countdown}`;
    this.timerID = setInterval(() => {
      // eslint-disable-next-line no-plusplus
      countdown = --countdown < 0 ? 60 : countdown;
      this.countdownNumberEl.textContent = `${countdown}`;
      if (countdown === 0) {
        this.node.remove();
        document.removeEventListener('keydown', this.buttonHandler);
        this.result = new Results(
          document.body,
          this.knownWords,
          this.unknownWords,
          +this.sprintPointsCount.textContent,
          this.gameLongestSeries.length,
          this.params,
          Pages.sprint
        );
        clearInterval(this.timerID);
      }
    }, 1000);
  }

  private initEventListeners() {
    window.addEventListener(
      'hashchange',
      () => {
        clearInterval(this.timerID);
        document.removeEventListener('keydown', this.buttonHandler);
      },
      {
        once: true,
      }
    );
  }

  private initFullScreenListener() {
    this.checkFullscreen();
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

  private checkFullscreen() {
    if (document.fullscreen) {
      (this.fullScreenBtn.firstElementChild as HTMLElement).hidden = true;
      (this.fullScreenBtn.lastElementChild as HTMLElement).hidden = false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private initCloseBtnListener() {
    this.closeGameBtn.onclick = () => {
      if (document.fullscreen) {
        document.exitFullscreen();
      }
      // document.removeEventListener('keyup', this.keyboardHandle);
      window.location.hash = this.comeBackHash;
    };
  }
}
