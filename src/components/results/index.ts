import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';
import { IWord } from '../../types/words';
import ResultRow from './components/resultRow';
import Pages from '../../enum/routing';
import Audiochallenge from '../audiochallenge';
import Api from '../services/api';
import { ILocalStorageUserData, IUserWords } from '../../types/users';
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

  private async updateUserWords(userData: ILocalStorageUserData) {
    const isTokenActive = await this.API.checkUserTokens(
      userData.userId,
      userData.userRefreshToken
    );
    const game = this.gameHash === Pages.sprint ? 'sprint' : 'audiochallenge';
    if (isTokenActive) {
      this.processKnownWords(userData, game);
      this.processUnknownWords(userData, game);
      // this.processGeneralStatistic(userData);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private async processKnownWords(
    userData: ILocalStorageUserData,
    game: string
  ) {
    this.knownWords.forEach((word) => {
      (async () => {
        try {
          const wordStat = await this.getWord(userData, word);
          const changes = this.determineKnownWordsChanges(wordStat, game);
          this.updateWord(userData, word, changes);
        } catch (error) {
          this.createWord(userData, word, game, true);
        }
      })();
    });
  }

  private async processUnknownWords(
    userData: ILocalStorageUserData,
    game: string
  ) {
    this.unknownWords.forEach((word) => {
      (async () => {
        try {
          const wordStat = await this.getWord(userData, word);
          const changes = this.determineUnknownWordsChanges(wordStat, game);
          this.updateWord(userData, word, changes);
        } catch (error) {
          this.createWord(userData, word, game, false);
        }
      })();
    });
  }

  private async getWord(userData: ILocalStorageUserData, word: IWord) {
    const res = await this.API.getUserWordById(
      userData.userId,
      word.id,
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
    } else if (state === 'studying' && increaseRow >= 3) {
      state = 'learned';
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
      state = 'stydying';
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
    word: IWord,
    changes: IUserWords
  ) {
    this.API.updateUserWord(
      userData.userId,
      word.id,
      changes,
      userData.userToken
    );
  }

  private createWord(
    userData: ILocalStorageUserData,
    word: IWord,
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
      word.id,
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
  // private async processGeneralStatistic(userData: ILocalStorageUserData) {
  //   const totalWordsCount = this.knownWords.length + this.unknownWords.length;
  //   const game = this.gameHash === Pages.sprint ? 'sprint' : 'audiochallenge';

  //   const res = await this.API.getUserStatistic(userData.userId, userData.userToken)
  //   const { wordStat, gameStat } = res.optional;
  //   const learnedWords = res.learnedWords;
  //   const req = this.API.updateUserStatistic(
  //     userData.userId,
  //     {
  //       learnedWords: learnedWords + totalWordsCount,
  //       optional: {
  //         wordStat:
  //       },
  //     },
  //     userData.userToken
  //   );
  // }

  // eslint-disable-next-line max-lines-per-function
  // private process(userData: ILocalStorageUserData) {
  //   const activeGame =
  //     this.gameHash === Pages.sprint ? 'sprint' : 'audiochallenge';
  //   const notActiveGame =
  //     this.gameHash !== Pages.sprint ? 'sprint' : 'audiochallenge';
  //   // eslint-disable-next-line max-lines-per-function
  //   this.knownWords.forEach((word) => {
  //     (async () => {
  //       try {
  //         const res = await this.API.getUserWordById(
  //           userData.userId,
  //           word.id,
  //           userData.userToken
  //         );
  //         const { guessedInARow, audio, sprint, attempts } = res.optional;
  //         let guessed: number;
  //         let unguessed: number;
  //         if (game === 'sprint') {
  //           guessed = audio;
  //           unguessed = sprint.unguessed;
  //         } else {
  //           guessed = audio;
  //           unguessed = audio.unguessed;
  //         }
  //         const increaseRow = +guessedInARow + 1;
  //         const increaseAttempts = attempts + 1;
  //         const increaseGuessed = guessed + 1;
  //         let state = res.difficulty;
  //         if (state === 'hard' && increaseRow >= 5) {
  //           state = 'learned';
  //         } else if (state === 'studying' && increaseRow >= 3) {
  //           state = 'learned';
  //         }
  //         this.API.updateUserWord(
  //           userData.userId,
  //           word.id,
  //           {
  //             difficulty: state,
  //             optional: {
  //               guessedInARow: increaseRow,
  //               audio,
  //               sprint: {
  //                 guessed: increaseGuessed,
  //                 unguessed,
  //               },
  //               attempts: increaseAttempts,
  //             },
  //           },
  //           userData.userToken
  //         );
  //       } catch (error) {
  //         this.API.createUserWords(
  //           userData.userId,
  //           word.id,
  //           {
  //             difficulty: 'studying',
  //             optional: {
  //               guessedInARow: 1,
  //               [notActiveGame]: {
  //                 guessed: 0,
  //                 unguessed: 0,
  //               },
  //               [activeGame]: {
  //                 guessed: 1,
  //                 unguessed: 0,
  //               },
  //               attempts: 1,
  //             },
  //           },
  //           userData.userToken
  //         );
  //       }
  //     })();
  //   });
  // }

  // // eslint-disable-next-line max-lines-per-function
  // private processKnownWordsAudiochallenge(userData: ILocalStorageUserData) {
  //   // eslint-disable-next-line max-lines-per-function
  //   this.knownWords.forEach((word) => {
  //     (async () => {
  //       try {
  //         const res = await this.API.getUserWordById(
  //           userData.userId,
  //           word.id,
  //           userData.userToken
  //         );
  //         const { guessedInARow, audio, sprint, attempts } = res.optional;
  //         const { guessed, unguessed } = audio;
  //         const increaseRow = +guessedInARow + 1;
  //         const increaseAttempts = attempts + 1;
  //         const increaseGuessed = guessed + 1;
  //         let state = res.difficulty;
  //         if (state === 'hard' && increaseRow >= 5) {
  //           state = 'learned';
  //         } else if (state === 'studying' && increaseRow >= 3) {
  //           state = 'learned';
  //         }
  //         this.API.updateUserWord(
  //           userData.userId,
  //           word.id,
  //           {
  //             difficulty: state,
  //             optional: {
  //               guessedInARow: increaseRow,
  //               sprint,
  //               audio: {
  //                 guessed: increaseGuessed,
  //                 unguessed,
  //               },
  //               attempts: increaseAttempts,
  //             },
  //           },
  //           userData.userToken
  //         );
  //       } catch (error) {
  //         this.API.createUserWords(
  //           userData.userId,
  //           word.id,
  //           {
  //             difficulty: 'studying',
  //             optional: {
  //               guessedInARow: 1,
  //               audio: {
  //                 guessed: 1,
  //                 unguessed: 0,
  //               },
  //               sprint: {
  //                 guessed: 0,
  //                 unguessed: 0,
  //               },
  //               attempts: 1,
  //             },
  //           },
  //           userData.userToken
  //         );
  //       }
  //     })();
  //   });
  // }

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
