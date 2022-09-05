import Page from '../../../../helpers/page';

export default class LevelsWrapper extends Page {
  constructor(parentNode: HTMLElement) {
    super('div', ['wordsbook-levels'], parentNode, '', {});
  }
}
