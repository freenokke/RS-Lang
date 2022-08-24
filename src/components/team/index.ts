import Page from '../helpers/page';

export default class Team extends Page {
  constructor(parentNode: HTMLElement | null) {
    super('div', [], parentNode, 'About team', {});
  }
}
