/* eslint-disable no-underscore-dangle */
import Pages from '../../../../../enum/routing';
import { IWord, IWordWithDifficulty } from '../../../../../types/words';
import Page from '../../../../helpers/page';
import Rules from '../../../../rules';
import Api from '../../../../services/api';
import Template from './index.html';

export default class GameButton extends Page {
  private gottenWords: IWordWithDifficulty[];

  private params: { group: string; page: string };
  private audiochallengeBtn: HTMLElement;
  private sprintBtn: HTMLElement;
  private rules: Rules;
  private name: string;
  private API: Api;

  constructor(
    parentNode: HTMLElement,
    name: string,
    image: string,
    words: IWordWithDifficulty[] & IWord[],
    params: { group: string; page: string }
  ) {
    super('div', ['wordsbook-games__game'], parentNode, Template, {
      name,
      image,
    });
    this.API = Api.getInstance();
    this.name = name;
    this.params = params;
    this.gottenWords = words;
    this.initListeners();
  }

  private async initListeners() {
    this.node.onclick = () => {
      this.node.remove();
      if (this.name === 'Спринт') {
        this.rules = new Rules(
          document.body,
          'Sprint',
          this.determineLevelName(),
          this.gottenWords,
          Pages.audiochallenge,
          Pages.wordsbook,
          this.params
        );
      } else {
        this.rules = new Rules(
          document.body,
          'Audiochallenge',
          this.determineLevelName(),
          this.gottenWords,
          Pages.audiochallenge,
          Pages.wordsbook,
          this.params
        );
      }
    };
  }

  // eslint-disable-next-line consistent-return
  private determineLevelName() {
    switch (this.params.group) {
      case '0':
        return 'A1 Beginner';
      case '1':
        return 'A2 Elementary';
      case '2':
        return 'B1 Pre-Intermediate';
      case '3':
        return 'B2 Intermediate';
      case '4':
        return 'C1 Advanced';
      case '5':
        return 'C2 Proficient';
      default:
        break;
    }
  }
}
