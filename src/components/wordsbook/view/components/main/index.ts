import Page from '../../../../helpers/page';

export default class Main extends Page {
  constructor(parentNode: HTMLElement) {
    super('main', ['main', 'wordsbook-page'], parentNode, '', {});
  }
}
