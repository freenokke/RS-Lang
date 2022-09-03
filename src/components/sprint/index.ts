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
  private params: { group: string; page: string };
  private audioRight: HTMLAudioElement;
  private audioWrong: HTMLAudioElement;
  private gameButtons: NodeListOf<HTMLButtonElement>;
  private gameGeneratedWord: IWord;
  private gameGeneratedTranslate: IWord;
  private gameLongestSeries: IWord[];
  private starsCheckbox: NodeListOf<HTMLInputElement>;
  private gameBonus: HTMLElement;
  private sprintPointsCount: HTMLElement;

  constructor(
    gottenWords: IWord[],
    comebackHash: string,
    parentNode: HTMLElement | null,
    params: { group: string; page: string }
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
    this.params = params;
    this.knownWords = [];
    this.unknownWords = [];
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

    // this.renderProgress(words.length);
    this.initGame(gottenWords);
    // this.initEventsListeners();
    this.startCountDown();
  }

  private async initGame(gottenWords: IWord[]): Promise<void> {
    this.initialArrayOfWords = gottenWords;
    this.wordsForGame = shuffleSprint(this.initialArrayOfWords);
    this.generateStep();
  }

  // private async additionalWordsToGame() {
  //   this.wordsForGame = [...this.API.getWords(group, words)]; // подтянуть новые слова, когда закончились старые
  // }

  // eslint-disable-next-line class-methods-use-this
  private generateStep() {
    this.generateWordAndWordTranslate();
    this.checkWordAndWordTranslate();
    this.checkWordByKeyboard();
  }

  private generateWordAndWordTranslate() {
    if (
      this.knownWords.includes(this.gameGeneratedWord) ||
      this.unknownWords.includes(this.gameGeneratedWord)
    ) {
      this.filterGeneratedArray();
    }
    // if (this.wordsForGame.length === 1) {
    //   this.additionalWordsToGame();
    // }
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
          this.doIfRight();
          setTimeout(() => el.blur(), 100);
        } else {
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
    document.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowRight') {
        this.rightButton.click();
        this.rightButton.focus();
        setTimeout(() => this.rightButton.blur(), 300);
      } else if (e.code === 'ArrowLeft') {
        this.wrongButton.click();
        this.wrongButton.focus();
        setTimeout(() => this.wrongButton.blur(), 300);
      }
    });
    // добавить управление через клавиатуру
  }

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
    this.gameLongestSeries.push(this.gameGeneratedWord); // запишем слово в самую длинную серию
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
    this.unknownWords.push(this.gameGeneratedWord);
    this.generateWordAndWordTranslate();
    this.starsCheckbox.forEach((el) => el.removeAttribute('checked'));
    this.gameBonus.textContent = `+20`;
    // при ошибке комбо = 20
  }

  // пока число слов в массиве больше 1, повторяем шаги выше
  // запустить шаг и сделать запрос на страницу предществующую this.params.page
  // this.API.getWords(group, words);
  // добавить их в массив this.wordsforgame
  //
  // когда заканчивается время создаем инстанс страницы Result

  // private addButtonsListeners(buttons: HTMLElement[], guessWord: IWord) {
  // 	buttons.forEach((item) => {
  // 		item.addEventListener('click', () => {
  // 			this.wordsForGame = this.wordsForGame.filter(
  // 				(word) => word.id !== guessWord.id
  // 			);
  // 			// this.updateProgress(item, guessWord);
  // 			this.answersButtonsArea.innerHTML = '';
  // 			if (this.wordsForGame.length > 5) {
  // 				this.generateStep();
  // 			} else {
  //        делаем запрос на страницу предществующую this.params.page
  // 				this.node.remove();
  // 				this.result = new Results(
  // 					document.body,
  // 					this.knownWords,
  // 					this.unknownWords,
  // 					score,
  // 					this.parameters,
  // 					Pages.sprint
  // 				);
  // 			}
  // 		});
  // 	});
  // }

  private startCountDown() {
    this.countdownNumberEl = this.node.querySelector('.countdown-number');
    let countdown = 60;
    this.countdownNumberEl.textContent = `${countdown}`;
    setInterval(() => {
      // eslint-disable-next-line no-plusplus
      countdown = --countdown <= 0 ? 60 : countdown;
      console.log(countdown);
      this.countdownNumberEl.textContent = `${countdown}`;
      if (countdown === 1) {
        this.node.remove();
        this.result = new Results(
          document.body,
          this.knownWords,
          this.unknownWords,
          +this.sprintPointsCount.textContent,
          this.parameters,
          Pages.sprint
        );
      }
    }, 1000);
  }
}
