import H1 from './components/h1';
import Level from './components/level';
import LevelsWrapper from './components/levelsWrapper';
import Main from './components/main';
import WordsbookWrapper from './components/wordsbookWrapper';
import { IWord } from '../../../types/words';
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

const levels = [
  {
    level: 0,
    label: 'A1',
    labelName: 'Elementary',
    text: 'Easy',
    start: 1,
    end: 600,
    needsAuth: false,
  },
  {
    level: 1,
    label: 'A2',
    text: 'Easy',
    start: 601,
    end: 1200,
    needsAuth: false,
  },
  {
    level: 2,
    label: 'B1',
    text: 'Medium',
    start: 1201,
    end: 1800,
    needsAuth: false,
  },
  {
    level: 3,
    label: 'B2',
    text: 'Medium',
    start: 1801,
    end: 2400,
    needsAuth: false,
  },
  {
    level: 4,
    label: 'C1',
    text: 'Hard',
    start: 2401,
    end: 3000,
    needsAuth: false,
  },
  {
    level: 5,
    label: 'C2',
    text: 'Hard',
    start: 3001,
    end: 3600,
    needsAuth: false,
  },
  {
    level: 6,
    label: '',
    text: 'Custom',
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

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;
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
    });
  }

  updateWords(words: IWord[], handler: (word: IWord) => void) {
    this.words = [];
    this.wordsWrapper.node.innerHTML = '';
    words.forEach((word, idx) => {
      const isChecked = idx === 0;
      this.words.push(
        new Word(this.wordsWrapper.node, word, isChecked, handler)
      );
    });
    this.updateWord(words[0]);
  }

  updateWord(word: IWord) {
    this.wordsbookDescriptionWrapper.node.innerHTML = '';
    this.word = new WordsbookDescription(
      this.wordsbookDescriptionWrapper.node,
      word
    );
  }

  updatePaginator(
    currentPage: number,
    handler: (page: number) => void,
    words: IWord[],
    params: { group: string; page: string }
  ) {
    this.paginationUl.node.innerHTML = '';
    this.paginationItems = [];
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
