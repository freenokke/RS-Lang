import Page from '../../../../helpers/page';

export default class WordsbookDescriptionWrapper extends Page {
  constructor(parentNode: HTMLElement) {
    super('div', ['wordsbook-description'], parentNode, '', {});
  }
}
