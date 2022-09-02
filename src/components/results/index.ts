import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';
import { IWord } from '../../types/words';
import ResultRow from './components/resultRow';
import Pages from '../../enum/routing';
import Audiochallenge from '../audiochallenge';
import Api from '../services/api';
import { ILocalStorageUserData } from '../../types/users';
import Sprint from '../sprint';

export default class Results extends Page {
  private knownWords: IWord[];

  private unknownWords: IWord[];

  private playOnceMoreButton: HTMLButtonElement;

  private toWordsbookButton: HTMLButtonElement;

  private resultsContainer: HTMLElement;

  private gameHash: string;

  private wordsRows: ResultRow[];

  private scoreField: HTMLElement;

  private params: { page: string; group: string };

  private API: Api;

  private playWithOthersWords: HTMLElement;

  private fullScreenBtn: HTMLElement;

  constructor(
    parentNode: HTMLElement,
    knownWords: IWord[],
    unknownWords: IWord[],
    score: number,
    params: { page: string; group: string },
    gameHash: string
  ) {
    super('main', ['fullscreen', 'results-page'], parentNode, Template, {
      score: score.toString(),
    });
    this.API = Api.getInstance();
    this.node.id = 'current-page';
    this.knownWords = knownWords;
    this.unknownWords = unknownWords;
    this.gameHash = gameHash;
    this.params = params;

    if (localStorage.getItem('userData') !== null) {
      this.updateUserStatistic(JSON.parse(localStorage.getItem('userData')));
    }

    this.determineElements();
    this.init(gameHash);
    this.addEventListeners();
    this.renderResults();
  }

  private init(game: string) {
    if (game === Pages.audiochallenge) {
      this.scoreField.hidden = true;
    }
    this.wordsRows = [];
  }

  private determineElements() {
    this.scoreField = this.node.querySelector('.results-points');
    this.playOnceMoreButton = this.node.querySelector(
      '#resultsPlayOnceMoreButton'
    );
    this.toWordsbookButton = this.node.querySelector('#resultsToWordsbook');
    this.resultsContainer = this.node.querySelector('.results-container');
    this.playWithOthersWords = this.node.querySelector(
      '#resultsPlayWithOthersWords'
    );
    this.fullScreenBtn = this.node.querySelector('.fullscreen__icon');
  }

  addEventListeners() {
    this.playOnceMoreButton.addEventListener('click', () => {
      this.node.remove();
      if (this.gameHash === Pages.audiochallenge) {
        const game = new Audiochallenge(
          [...this.knownWords, ...this.unknownWords],
          Pages.games,
          document.body,
          this.params
        );
        game.node.id = 'current-page';
      } else {
        const game = new Sprint(
          [...this.knownWords, ...this.unknownWords],
          Pages.games,
          document.body,
          this.params
        );
        game.node.id = 'current-page';
      }
    });
    this.toWordsbookButton.addEventListener('click', () => {
      const { group } = this.params;
      const { page } = this.params;
      window.console.log(group, page);
      this.node.remove();
      window.location.hash = Pages.wordsbook;
      if (document.fullscreen) {
        document.exitFullscreen();
      }
    });
    this.initFullScreenListener();
    this.playWithOthersWordsListeners();
  }

  private playWithOthersWordsListeners() {
    this.playWithOthersWords.addEventListener('click', async () => {
      this.node.remove();
      const words = await this.loadWordsByChosenGroup(
        this.params.group.toString()
      );
      const { page, group } = words[0];
      if (this.gameHash === Pages.audiochallenge) {
        const game = new Audiochallenge(words, Pages.games, document.body, {
          group: group.toString(),
          page: page.toString(),
        });
        game.node.id = 'current-page';
      } else {
        const game = new Sprint(words, Pages.games, document.body, {
          group: group.toString(),
          page: page.toString(),
        });
        game.node.id = 'current-page';
      }
    });
  }

  private initFullScreenListener() {
    if (document.fullscreen) {
      (this.fullScreenBtn.firstElementChild as HTMLElement).hidden = true;
      (this.fullScreenBtn.lastElementChild as HTMLElement).hidden = false;
    }
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

  private renderResults() {
    if (this.knownWords.length > 0) {
      const h2 = Results.createH2(`Знаю: ${this.knownWords.length}`);
      this.resultsContainer.append(h2);
      this.renderWords(this.knownWords, this.resultsContainer);
    }
    if (this.unknownWords.length > 0) {
      const h2 = Results.createH2(`Не знаю: ${this.unknownWords.length}`);
      this.resultsContainer.append(h2);
      this.renderWords(this.unknownWords, this.resultsContainer);
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

  private async updateUserStatistic(userData: ILocalStorageUserData) {
    const isTokenActive = await this.API.checkUserTokens(
      userData.userId,
      userData.userRefreshToken
    );
    if (isTokenActive) {
      this.processKnownWords(userData);
      this.processUnknownWords(userData);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private processKnownWords(userData: ILocalStorageUserData) {
    // eslint-disable-next-line max-lines-per-function
    this.knownWords.forEach((word) => {
      (async () => {
        try {
          const res = await this.API.getUserWordById(
            userData.userId,
            word.id,
            userData.userToken
          );
          const { guessedInARow, guessed, unguessed, attempts } = res.optional;
          const increaseRow = (+guessedInARow + 1).toString();
          const increaseAttempts = (+attempts + 1).toString();
          const increaseGuessed = (+guessed + 1).toString();
          let state = res.difficulty;
          if (state === 'hard' && increaseRow >= '5') {
            state = 'learned';
          } else if (state === 'studying' && increaseRow >= '3') {
            state = 'learned';
          }
          this.API.updateUserWord(
            userData.userId,
            word.id,
            {
              difficulty: state,
              optional: {
                guessedInARow: increaseRow,
                guessed: increaseGuessed,
                unguessed,
                attempts: increaseAttempts,
              },
            },
            userData.userToken
          );
        } catch (error) {
          this.API.createUserWords(
            userData.userId,
            word.id,
            {
              difficulty: 'studying',
              optional: {
                guessedInARow: '1',
                guessed: '1',
                unguessed: '0',
                attempts: '1',
              },
            },
            userData.userToken
          );
        }
      })();
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private processUnknownWords(userData: ILocalStorageUserData) {
    // eslint-disable-next-line max-lines-per-function
    this.unknownWords.forEach((word) => {
      (async () => {
        try {
          const res = await this.API.getUserWordById(
            userData.userId,
            word.id,
            userData.userToken
          );
          const { guessed, unguessed, attempts } = res.optional;
          const increaseAttempts = (+attempts + 1).toString();
          const increaseUnguessed = (+unguessed + 1).toString();
          let state = res.difficulty;
          if (state === 'learned') {
            state = 'stydying';
          }
          this.API.updateUserWord(
            userData.userId,
            word.id,
            {
              difficulty: state,
              optional: {
                guessedInARow: '0',
                guessed,
                unguessed: increaseUnguessed,
                attempts: increaseAttempts,
              },
            },
            userData.userToken
          );
        } catch (error) {
          this.API.createUserWords(
            userData.userId,
            word.id,
            {
              difficulty: 'studying',
              optional: {
                guessedInARow: '0',
                guessed: '0',
                unguessed: '1',
                attempts: '1',
              },
            },
            userData.userToken
          );
        }
      })();
    });
  }

  private async loadWordsByChosenGroup(level: string): Promise<IWord[]> {
    const arrayOfpages = Array(30)
      .fill('')
      .map((item, index) => index);
    const randomPage =
      arrayOfpages[Math.floor(Math.random() * arrayOfpages.length)];
    const words = this.API.getWords(level, randomPage.toString());
    return words;
  }
}
