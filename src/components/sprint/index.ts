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
  private gameButtons: NodeListOf<Element>;

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

    this.gameButtons = this.node.querySelectorAll('.btn');
    this.rightButton = this.node.querySelector('.true');
    this.wrongButton = this.node.querySelector('.false');
    this.gameWordCheck = this.node.querySelector('.game__word-check');
    this.gameWord = this.node.querySelector('.game__word');
    this.gameWordTranslate = this.node.querySelector('.game__word-translate');
    this.audioRight = new Audio(`../../assets/sound/select-click.mp3`);
    this.audioWrong = new Audio(`../../assets/sound/error-click.mp3`);

    // this.determineElements();
    // this.renderProgress(words.length);
    this.initGame(gottenWords);
    // this.initEventsListeners();
    this.startCountDown();
    // this.addIconToGame();
  }

  private async initGame(gottenWords: IWord[]): Promise<void> {
    this.initialArrayOfWords = gottenWords;
    this.wordsForGame = shuffleSprint(this.initialArrayOfWords);
    this.generateStep();
  }

  // eslint-disable-next-line class-methods-use-this
  private generateStep() {
    const word = this.wordsForGame[
      Math.floor(Math.random() * this.wordsForGame.length)
    ]; // определим слово для угадывания
    const wordRandomTranslate: IWord = Math.round(Math.random())
      ? word
      : this.wordsForGame[Math.floor(Math.random() * this.wordsForGame.length)]; // определяем перевод формата 50/50 - или исходный или случайный
    this.gameWord.textContent = word.word; // записать слово и перевод в соответствущие поля HTML
    this.gameWordTranslate.textContent = wordRandomTranslate.wordTranslate;
    this.gameButtons.forEach((el) =>
      el.addEventListener('click', () => {
        if (
          (word.wordTranslate === wordRandomTranslate.wordTranslate &&
            el.classList.contains('true')) ||
          (word.wordTranslate !== wordRandomTranslate.wordTranslate &&
            el.classList.contains('false'))
        ) {
          this.gameWordCheck.classList.remove('game__word-check--wrong');
          this.gameWordCheck.classList.add('game__word-check--right');
          this.audioRight.play();
          setTimeout(
            () =>
              this.gameWordCheck.classList.remove('game__word-check--right'),
            500
          );
        } else {
          this.gameWordCheck.classList.remove('game__word-check--right');
          this.gameWordCheck.classList.add('game__word-check--wrong');
          this.audioWrong.play();
          setTimeout(
            () =>
              this.gameWordCheck.classList.remove('game__word-check--wrong'),
            500
          );
        }
      })
    ); // описать реакцию программы на правильный или неправильный выбор
  }

  // this.wordsForGame = this.wordsForGame.filter(
  //   (guessWord) => guessWord.id !== word.id
  // ); // убрать это слово из общего массива
  // в зависимости от того правильно отгадано или нет, вывести иконку и записать
  // это слово в опредленный массив knownwords или unknownwords
  //
  // обновить комбо и текущий результат
  // если 3 подряд ПРАВИЛЬНЫХ ответа комбо увеличивается на 20, и продолжает таковым быть до следующего кобма и так далее
  // при ошибке комбо = 20
  //
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

  // private addIconToGame() {
  //   const audioRight = new Audio(`../../assets/sound/select-click.mp3`);
  //   const audioWrong = new Audio(`../../assets/sound/error-click.mp3`);
  //   this.rightButton.addEventListener('click', () => {
  //     this.gameWordCheck.classList.remove('game__word-check--wrong');
  //     this.gameWordCheck.classList.add('game__word-check--right');
  //     audioRight.play();
  //     setTimeout(
  //       () => this.gameWordCheck.classList.remove('game__word-check--right'),
  //       500
  //     );
  //   });
  //   this.wrongButton.addEventListener('click', () => {
  //     this.gameWordCheck.classList.remove('game__word-check--right');
  //     this.gameWordCheck.classList.add('game__word-check--wrong');
  //     audioWrong.play();
  //     setTimeout(
  //       () => this.gameWordCheck.classList.remove('game__word-check--wrong'),
  //       500
  //     );
  //   });
  // }
}
