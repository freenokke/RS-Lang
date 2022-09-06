import Page from '../../../../helpers/page';

export default class WordsWrapper extends Page {
  constructor(parentNode: HTMLElement) {
    super('div', ['wordsbook-words'], parentNode, '', {});
  }
}
