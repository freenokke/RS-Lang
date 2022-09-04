import Page from '../../../../helpers/page';
import Template from './index.html';

export default class GameButton extends Page {
  constructor(parentNode: HTMLElement, name: string, image: string) {
    super('div', ['wordsbook-games__game'], parentNode, Template, {
      name,
      image,
    });
  }
}
