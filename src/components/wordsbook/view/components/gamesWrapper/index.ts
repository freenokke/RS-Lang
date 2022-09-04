import Page from '../../../../helpers/page';

export default class GamesWrapper extends Page {
  constructor(parentNode: HTMLElement) {
    super('div', ['wordsbook-games'], parentNode, '', {});
  }
}
