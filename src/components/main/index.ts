import Page from '../helpers/page';

export default class Main extends Page {
  constructor(hash: string, parentNode: HTMLElement | null) {
    super('div', [], parentNode, 'main page', {});
  }
}
