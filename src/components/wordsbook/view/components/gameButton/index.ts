import Pages from '../../../../../enum/routing';
import { IWord } from '../../../../../types/words';
import Page from '../../../../helpers/page';
import Rules from '../../../../rules';
import Template from './index.html';

export default class GameButton extends Page {
  private gottenWords: IWord[];

  private params: { group: string; page: string };
  private audiochallengeBtn: HTMLElement;
  private sprintBtn: HTMLElement;
  private rules: Rules;
  private name: string;

  constructor(
    parentNode: HTMLElement,
    name: string,
    image: string,
    words: IWord[],
    params: { group: string; page: string }
  ) {
    super('div', ['wordsbook-games__game'], parentNode, Template, {
      name,
      image,
    });
    this.name = name;

    this.gottenWords = words;
    this.params = params;
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
        return 'B1 Intermediate';
      case '3':
        return 'B2 Pre-Intermediate';
      case '4':
        return 'C1 Advanced';
      case '5':
        return 'C2 Proficient';
      default:
        break;
    }
  }
}
