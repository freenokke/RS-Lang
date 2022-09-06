/* eslint-disable no-underscore-dangle */
import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';
import { IWord, IWordWithDifficulty } from '../../types/words';
import ResultRow from './components/resultRow';
import Pages from '../../enum/routing';
import Audiochallenge from '../audiochallenge';
import Api from '../services/api';
import {
  ILocalStorageUserData,
  IUserStatistic,
  IUserWords,
} from '../../types/users';
import Sprint from '../sprint';

export default class Results extends Page {
  private knownWords: IWordWithDifficulty[] & IWord[];

  private unknownWords: IWordWithDifficulty[] & IWord[];

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

  private newWords: number;

  private learnedWords: number;

  private longestSeries: number;

  private toGamesButton: HTMLElement;

  constructor(
    parentNode: HTMLElement,
    knownWords: IWordWithDifficulty[] & IWord[],
    unknownWords: IWordWithDifficulty[] & IWord[],
    score: number,
    longestSeries: number,
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
    this.longestSeries = longestSeries;
    this.newWords = 0;
    this.learnedWords = 0;

    if (localStorage.getItem('userData') !== null) {
      this.updateUserWords(JSON.parse(localStorage.getItem('userData')));
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
    this.toGamesButton = this.node.querySelector('#resultsToGames');
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
    this.toGamesButtonListener();
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

  private async updateUserWords(userData: ILocalStorageUserData) {
    const isTokenActive = await this.API.checkUserTokens(
      userData.userId,
      userData.userRefreshToken
    );
    const game = this.gameHash === Pages.sprint ? 'sprint' : 'audiochallenge';
    if (isTokenActive) {
      await this.processKnownWords(userData, game);
      await this.processUnknownWords(userData, game);
      this.processGeneralStatistic(userData, game);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private async processKnownWords(
    userData: ILocalStorageUserData,
    game: string
  ) {
    // eslint-disable-next-line no-restricted-syntax
    for (const word of this.knownWords) {
      // eslint-disable-next-line no-await-in-loop
      await (async () => {
        try {
          const wordStat = await this.getWord(userData, word);
          const changes = this.determineKnownWordsChanges(wordStat, game);
          this.updateWord(userData, word, changes);
        } catch (error) {
          this.createWord(userData, word, game, true);
          this.newWords += 1;
        }
      })();
    }
  }

  private async processUnknownWords(
    userData: ILocalStorageUserData,
    game: string
  ) {
    // eslint-disable-next-line no-restricted-syntax
    for (const word of this.unknownWords) {
      // eslint-disable-next-line no-await-in-loop
      await (async () => {
        try {
          const wordStat = await this.getWord(userData, word);
          const changes = this.determineUnknownWordsChanges(wordStat, game);
          this.updateWord(userData, word, changes);
        } catch (error) {
          this.createWord(userData, word, game, false);
          this.newWords += 1;
        }
      })();
    }
  }

  private async getWord(
    userData: ILocalStorageUserData,
    word: IWordWithDifficulty & IWord
  ) {
    const res = await this.API.getUserWordById(
      userData.userId,
      word._id ? word._id : word.id,
      userData.userToken
    );
    return res;
  }

  // eslint-disable-next-line class-methods-use-this
  private determineKnownWordsChanges(
    wordStat: IUserWords,
    game: string
  ): IUserWords {
    const { guessedInARow, audio, sprint, attempts } = wordStat.optional;
    const sprintObj = {
      guessed: sprint.guessed,
      unguessed: sprint.unguessed,
    };
    const audioObj = {
      guessed: audio.guessed,
      unguessed: audio.unguessed,
    };
    if (game === 'sprint') {
      sprintObj.guessed += 1;
    } else {
      audioObj.guessed += 1;
    }
    const increaseRow = guessedInARow + 1;
    const increaseAttempts = attempts + 1;
    let state = wordStat.difficulty;
    if (state === 'hard' && increaseRow >= 5) {
      state = 'learned';
      this.learnedWords += 1;
    } else if (state === 'studying' && increaseRow >= 3) {
      state = 'learned';
      this.learnedWords += 1;
    }
    return {
      difficulty: state,
      optional: {
        guessedInARow: increaseRow,
        sprint: sprintObj,
        audio: audioObj,
        attempts: increaseAttempts,
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private determineUnknownWordsChanges(
    wordStat: IUserWords,
    game: string
  ): IUserWords {
    const { audio, sprint, attempts } = wordStat.optional;
    const sprintObj = {
      guessed: sprint.guessed,
      unguessed: sprint.unguessed,
    };
    const audioObj = {
      guessed: audio.guessed,
      unguessed: audio.unguessed,
    };
    if (game === 'sprint') {
      sprintObj.unguessed += 1;
    } else {
      audioObj.unguessed += 1;
    }
    const increaseAttempts = attempts + 1;
    let state = wordStat.difficulty;
    if (state === 'learned') {
      state = 'studying';
    }
    return {
      difficulty: state,
      optional: {
        guessedInARow: 0,
        sprint: sprintObj,
        audio: audioObj,
        attempts: increaseAttempts,
      },
    };
  }

  private async updateWord(
    userData: ILocalStorageUserData,
    word: IWordWithDifficulty & IWord,
    changes: IUserWords
  ) {
    this.API.updateUserWord(
      userData.userId,
      word._id ? word._id : word.id,
      changes,
      userData.userToken
    );
  }

  private createWord(
    userData: ILocalStorageUserData,
    word: IWordWithDifficulty & IWord,
    game: string,
    isGuessed: boolean
  ) {
    const template = this.generateWordStatTemplate();
    if (game === 'sprint') {
      if (isGuessed) {
        template.optional.sprint.guessed = 1;
        template.optional.guessedInARow = 1;
      } else {
        template.optional.sprint.unguessed = 1;
      }
    }
    if (game === 'audiochallenge') {
      if (isGuessed) {
        template.optional.audio.guessed = 1;
        template.optional.guessedInARow = 1;
      } else {
        template.optional.audio.unguessed = 1;
      }
    }

    this.API.createUserWords(
      userData.userId,
      word._id ? word._id : word.id,
      template,
      userData.userToken
    );
  }

  // eslint-disable-next-line class-methods-use-this
  private generateWordStatTemplate() {
    return {
      difficulty: 'studying',
      optional: {
        guessedInARow: 0,
        sprint: {
          guessed: 0,
          unguessed: 0,
        },
        audio: {
          guessed: 0,
          unguessed: 0,
        },
        attempts: 1,
      },
    };
  }

  // eslint-disable-next-line max-lines-per-function
  private async processGeneralStatistic(
    userData: ILocalStorageUserData,
    game: string
  ) {
    const res = await this.API.getUserStatistic(
      userData.userId,
      userData.userToken
    );
    if (game === 'audiochallenge') {
      res.optional.gameStat.audio.learnedWords += this.learnedWords;
      res.optional.gameStat.audio.correctAnswers += this.knownWords.length;
      res.optional.gameStat.audio.wrongAswers += this.unknownWords.length;
      res.optional.gameStat.audio.newWords += this.newWords;
      if (res.optional.gameStat.audio.longestSeries < this.longestSeries) {
        res.optional.gameStat.audio.longestSeries = this.longestSeries;
      }
    }
    if (game === 'sprint') {
      res.optional.gameStat.sprint.learnedWords += this.learnedWords;
      res.optional.gameStat.sprint.correctAnswers += this.knownWords.length;
      res.optional.gameStat.sprint.wrongAswers += this.unknownWords.length;
      res.optional.gameStat.sprint.newWords += this.newWords;
      if (res.optional.gameStat.sprint.longestSeries < this.longestSeries) {
        res.optional.gameStat.sprint.longestSeries = this.longestSeries;
      }
    }
    const stat: IUserStatistic = {
      learnedWords: res.learnedWords,
      optional: res.optional,
    };
    this.API.updateUserStatistic(userData.userId, stat, userData.userToken);
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

  private toGamesButtonListener() {
    this.toGamesButton.onclick = () => {
      this.node.remove();
      window.location.hash = Pages.games;
      if (document.fullscreen) {
        document.exitFullscreen();
      }
    };
  }
}
