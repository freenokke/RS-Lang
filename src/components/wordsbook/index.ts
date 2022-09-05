import Page from '../helpers/page';
// import MapIcon from './img/01_0008.jpg';
// import FromWBtoAudiochallengeGame from './img/headphones-no-bg.png';
// import FromWBtoSprintGame from './img/cheetah-no-bg.png';
// import Template from './index.html';
import './style.scss';
import Api from '../services/api';
import View from './view';
import Model from './model';
import { IWord } from '../../types/words';

// const model = {
//   mapIcon: MapIcon,
//   fromWBtoAudiochallengeGame: FromWBtoAudiochallengeGame,
//   fromWBtoSprintGame: FromWBtoSprintGame,
// };

export default class Wordsbook extends Page {
  private api: Api;

  private view;

  private mod;

  private level;

  private page;

  private isUserAuthenticated: boolean;

  constructor(parentNode: HTMLElement, level = 0, page = 0) {
    super('main', ['main', 'wordsbook-page'], parentNode, '', {});
    this.view = new View(this.node);
    this.mod = new Model(
      this.handleLevelUpdate,
      this.handleWordUpdate,
      this.handlePageUpdate,
      this.handleWordsUpdate
    );
    this.level = level;
    this.page = page;
    this.init();
  }

  init() {
    this.view.initLevels(this.handleLevelUpdate);
    // this.isUserAuthenticated = localStorage.getItem('')
    this.view.updatePaginator(
      this.page + 1,
      this.handlePaginatorUpdate,
      this.mod.words,
      {
        group: this.mod.currentLevel.toString(),
        page: this.mod.currentPage.toString(),
      }
    );
  }

  private handleLevelUpdate = (level: number) => {
    this.mod.updateLevel(level);
  };

  private handleWordsUpdate = (words: IWord[]) => {
    this.view.updateWords(words, this.handleWordUpdate);
    this.mod.updateWord(words[0]);
  };

  private handleWordUpdate = (word: IWord) => {
    this.view.updateWord(word);
  };

  private handlePageUpdate = (page: number) => {
    this.view.updatePaginator(
      page,
      this.handlePaginatorUpdate,
      this.mod.words,
      {
        group: this.mod.currentLevel.toString(),
        page: this.mod.currentPage.toString(),
      }
    );
  };

  private handlePaginatorUpdate = (page: number) => {
    this.mod.updatePage(page);
    this.view.updatePaginator(page, this.handlePageUpdate, this.mod.words, {
      group: this.mod.currentLevel.toString(),
      page: this.mod.currentPage.toString(),
    });
  };
}
