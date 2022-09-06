import Page from '../../../../helpers/page';

export default class WordsbookWrapper extends Page {
  constructor(parentNode: HTMLElement) {
    super('div', ['wordsbook'], parentNode, '', {});
  }
}
