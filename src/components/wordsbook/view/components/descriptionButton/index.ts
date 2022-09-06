import Page from '../../../../helpers/page';

export default class DescriptionButton extends Page {
  private handler;

  constructor(parentNode: HTMLElement, text: string, handler: () => void) {
    super('button', ['wordsbook-description__button'], parentNode, '', {});
    this.handler = handler;
    this.node.textContent = text;
    this.initEventListeners();
  }

  initEventListeners() {
    this.node.addEventListener('click', () => {
      this.handler();
    });
  }
}
