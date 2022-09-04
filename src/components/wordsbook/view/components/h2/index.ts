import Page from '../../../../helpers/page';

export default class H2 extends Page {
  constructor(parentNode: HTMLElement) {
    super('h2', ['wordsbook__h1'], parentNode, '', {});
    this.node.textContent = 'Игры';
  }
}
