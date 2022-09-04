import Page from '../../../../helpers/page';

export default class H1 extends Page {
  constructor(parentNode: HTMLElement) {
    super('h1', ['wordsbook__h1'], parentNode, '', {});
    this.node.textContent = 'Учебник';
  }
}
