/* eslint-disable no-underscore-dangle */
/* eslint-disable max-lines-per-function */
import H1 from './components/h1';
import Level from './components/level';
import LevelsWrapper from './components/levelsWrapper';
import Main from './components/main';
import WordsbookWrapper from './components/wordsbookWrapper';
import { IWord, IWordWithDifficulty } from '../../../types/words';
import WordsWrapper from './components/wordsWrapper';
import Word from './components/word';
import WordsbookWordsWrapper from './components/wordsbookWordsWrapper';
import WordsbookDescriptionWrapper from './components/wordsbookDescriptionWrapper';
import WordsbookDescription from './components/wordsbookDescription';
import PaginationWrapper from './components/paginationWrapper';
import PaginationUl from './components/paginationUl';
import PaginationLi from './components/paginationLi';
import getPaginator from '../helpers/paginator';
import GamesWrapper from './components/gamesWrapper';
import H2 from './components/h2';
import CheetahImg from '../img/cheetah-no-bg.png';
import HeadphonesImg from '../img/headphones-no-bg.png';
import GameButton from './components/gameButton';
import GameButtonsWrapper from './components/gameButtonsWrapper';
import DescriptionButton from './components/descriptionButton';
import Api from '../../services/api';

const levels = [
  {
    level: 0,
    label: 'A1',
    labelName: 'Beginner',
    text: 'Beginner',
    start: 1,
    end: 600,
    needsAuth: false,
  },
  {
    level: 1,
    label: 'A2',
    text: 'Elementary',
    start: 601,
    end: 1200,
    needsAuth: false,
  },
  {
    level: 2,
    label: 'B1',
    text: 'Pre-Intermediate',
    start: 1201,
    end: 1800,
    needsAuth: false,
  },
  {
    level: 3,
    label: 'B2',
    text: 'Intermediate',
    start: 1801,
    end: 2400,
    needsAuth: false,
  },
  {
    level: 4,
    label: 'C1',
    text: 'Advanced',
    start: 2401,
    end: 3000,
    needsAuth: false,
  },
  {
    level: 5,
    label: 'C2',
    text: 'Proficient',
    start: 3001,
    end: 3600,
    needsAuth: false,
  },
  {
    level: 6,
    label: '',
    text: 'Сложные слова',
    start: 1,
    end: 3600,
    needsAuth: true,
  },
];

export default class View {
  private levelsWrapper: LevelsWrapper;

  private levels: Level[];

  private main: Main;

  private parentNode: HTMLElement;

  private wordsbookWrapper: WordsbookWrapper;

  private node: HTMLElement;

  private h1: H1;

  private wordsWrapper: WordsWrapper;

  private wordsbookWordsWrapper: WordsWrapper;

  private words: Word[] = [];

  private word: WordsbookDescription;

  private wordsbookDescriptionWrapper: WordsbookDescriptionWrapper;

  private paginationWrapper: PaginationWrapper;

  private paginationUl: PaginationUl;

  private paginationItems: PaginationLi[];

  private gamesWrapper: GamesWrapper;

  private h2: H2;

  private gameButtons: GameButton[] = [];

  private gameButtonsWrapper: GameButtonsWrapper;

  private descriptionButtons: DescriptionButton[] = [];

  private api: Api;

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;
    this.api = Api.getInstance();
    this.init();
  }

  private init() {
    this.wordsbookWrapper = new WordsbookWrapper(this.parentNode);
    this.h1 = new H1(this.wordsbookWrapper.node);
    this.levelsWrapper = new LevelsWrapper(this.wordsbookWrapper.node);
    this.wordsbookWordsWrapper = new WordsbookWordsWrapper(
      this.wordsbookWrapper.node
    );
    this.wordsWrapper = new WordsWrapper(this.wordsbookWordsWrapper.node);
    this.wordsbookDescriptionWrapper = new WordsbookDescriptionWrapper(
      this.wordsbookWordsWrapper.node
    );
    this.paginationWrapper = new PaginationWrapper(this.wordsbookWrapper.node);
    this.paginationUl = new PaginationUl(this.paginationWrapper.node);
    this.gamesWrapper = new GamesWrapper(this.wordsbookWrapper.node);
    this.h2 = new H2(this.gamesWrapper.node);
    this.gameButtonsWrapper = new GameButtonsWrapper(this.gamesWrapper.node);
  }

  static get isUserAuthenticated() {
    return Boolean(localStorage.getItem('userData'));
  }

  static get userData() {
    return JSON.parse(localStorage.getItem('userData'));
  }

  updateGameButtons(words: IWord[], params: { group: string; page: string }) {
    this.gameButtonsWrapper.node.innerHTML = '';
    this.gameButtons.length = 0;
    [
      { name: 'Спринт', image: CheetahImg },
      { name: 'Аудиовызов', image: HeadphonesImg },
    ].forEach((game) => {
      this.gameButtons.push(
        new GameButton(
          this.gameButtonsWrapper.node,
          game.name,
          game.image,
          words,
          params
        )
      );
    });
  }

  initLevels(handler: (level: number) => void) {
    this.levels = [];
    levels.forEach((level) => {
      const isChecked = level.level === 0;
      if (localStorage.getItem('userData') || !level.needsAuth) {
        this.levels.push(
          new Level(
            this.levelsWrapper.node,
            level.level,
            level.label,
            level.text,
            level.start,
            level.end,
            isChecked,
            handler
          )
        );
      }
    });
  }

  // eslint-disable-next-line max-lines-per-function
  updateWords(words: IWordWithDifficulty[], handler: (word: IWord) => void) {
    this.words = [];
    this.wordsWrapper.node.innerHTML = '';
    // eslint-disable-next-line max-lines-per-function
    words.forEach((word, idx) => {
      const isChecked = idx === 0;
      if (word.userWord?.difficulty) {
        if (word.userWord?.difficulty === 'hard') {
          this.words.push(
            new Word(
              this.wordsWrapper.node,
              word,
              isChecked,
              handler,
              true,
              false
            )
          );
        } else if (word.userWord?.difficulty === 'learned') {
          this.words.push(
            new Word(
              this.wordsWrapper.node,
              word,
              isChecked,
              handler,
              false,
              true
            )
          );
        } else if (word.userWord?.difficulty === 'studying') {
          this.words.push(
            new Word(
              this.wordsWrapper.node,
              word,
              isChecked,
              handler,
              false,
              false
            )
          );
        }
      } else {
        this.words.push(
          new Word(
            this.wordsWrapper.node,
            word,
            isChecked,
            handler,
            false,
            false
          )
        );
      }
    });
    this.updateWord(words[0]);
  }

  updateWord(word: IWordWithDifficulty) {
    this.wordsbookDescriptionWrapper.node.innerHTML = '';
    const isHard = word.userWord?.difficulty === 'hard';
    const isLearned = word.userWord?.difficulty === 'learned';
    this.word = new WordsbookDescription(
      this.wordsbookDescriptionWrapper.node,
      word
    );
    if (View.isUserAuthenticated) {
      [
        {
          text: isHard ? 'Удалить из сложных' : 'В сложные',
          handler: isHard
            ? this.hardWordDeleteHandler(word)
            : this.hardWordAddHandler(word),
        },
        {
          text: isLearned ? 'Удалить из изученных' : 'В изученные',
          handler: isLearned
            ? this.learnedWordDeleteHandler(word)
            : this.learnedWordAddHandler(word),
        },
      ].forEach((button) => {
        this.descriptionButtons.push(
          new DescriptionButton(
            this.word.buttonsContainer,
            button.text,
            button.handler
          )
        );
      });
    }
  }

  private hardWordAddHandler(word: IWordWithDifficulty) {
    return async () => {
      try {
        const wordStat = await this.api.getUserWordById(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          View.userData.userToken
        );
        wordStat.difficulty = 'hard';
        await this.api.updateUserWord(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          {
            difficulty: wordStat.difficulty,
            optional: wordStat.optional,
          },
          View.userData.userToken
        );
      } catch {
        await this.api.createUserWords(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          View.createUserWordTemplate('hard'),
          View.userData.userToken
        );
      }
      const wordCard = this.wordsWrapper.node.querySelector(
        // eslint-disable-next-line no-underscore-dangle
        `[data-id="${word._id}"]`
      );
      wordCard.classList.add('wordsbook-words__word-wrapper_difficult');
      const wordCopy = word;
      wordCopy.userWord.difficulty = 'hard';
      this.updateWord(word);
    };
  }

  private hardWordDeleteHandler(word: IWordWithDifficulty) {
    return async () => {
      try {
        const wordStat = await this.api.getUserWordById(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          View.userData.userToken
        );
        wordStat.difficulty = 'studying';
        await this.api.updateUserWord(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          {
            difficulty: wordStat.difficulty,
            optional: wordStat.optional,
          },
          View.userData.userToken
        );
      } catch {
        await this.api.createUserWords(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          View.createUserWordTemplate('studying'),
          View.userData.userToken
        );
      }
      const wordCard = this.wordsWrapper.node.querySelector(
        // eslint-disable-next-line no-underscore-dangle
        `[data-id="${word._id}"]`
      );
      wordCard.classList.remove('wordsbook-words__word-wrapper_difficult');
      const wordCopy = word;
      wordCopy.userWord.difficulty = 'studying';
      this.updateWord(wordCopy);
    };
  }

  private learnedWordAddHandler(word: IWordWithDifficulty) {
    return async () => {
      try {
        const wordStat = await this.api.getUserWordById(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          View.userData.userToken
        );
        wordStat.difficulty = 'learned';
        await this.api.updateUserWord(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          {
            difficulty: wordStat.difficulty,
            optional: wordStat.optional,
          },
          View.userData.userToken
        );
      } catch {
        await this.api.createUserWords(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          View.createUserWordTemplate('learned'),
          View.userData.userToken
        );
      }
      const wordCard = this.wordsWrapper.node.querySelector(
        // eslint-disable-next-line no-underscore-dangle
        `[data-id="${word._id}"]`
      );
      wordCard.classList.add('wordsbook-words__word-wrapper_learned');
      const wordCopy = word;
      wordCopy.userWord.difficulty = 'learned';
      this.updateWord(wordCopy);
    };
  }

  private learnedWordDeleteHandler(word: IWordWithDifficulty) {
    return async () => {
      try {
        const wordStat = await this.api.getUserWordById(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          View.userData.userToken
        );
        wordStat.difficulty = 'studying';
        await this.api.updateUserWord(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          {
            difficulty: wordStat.difficulty,
            optional: wordStat.optional,
          },
          View.userData.userToken
        );
      } catch {
        await this.api.createUserWords(
          View.userData.userId,
          // eslint-disable-next-line no-underscore-dangle
          word._id,
          View.createUserWordTemplate('studying'),
          View.userData.userToken
        );
      }
      const wordCard = this.wordsWrapper.node.querySelector(
        // eslint-disable-next-line no-underscore-dangle
        `[data-id="${word._id}"]`
      );
      wordCard.classList.remove('wordsbook-words__word-wrapper_learned');
      const wordCopy = word;
      wordCopy.userWord.difficulty = 'studying';
      this.updateWord(wordCopy);
    };
  }

  private static createUserWordTemplate(difficulty: string) {
    return {
      difficulty,
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
        attempts: 0,
      },
    };
  }

  updatePaginator(
    currentPage: number,
    handler: (page: number) => void,
    words: IWordWithDifficulty[],
    params: {
      group: string;
      page: string;
    }
  ) {
    this.paginationUl.node.innerHTML = '';
    this.paginationItems = [];
    if (params.group !== '6') {
      const pagination = getPaginator(currentPage);
      pagination.forEach((item) => {
        let isActive = false;
        if (currentPage === Number(item)) isActive = true;
        this.paginationItems.push(
          new PaginationLi(this.paginationUl.node, item, isActive, handler)
        );
      });
      this.updateGameButtons(words, params);
    }
  }
}
