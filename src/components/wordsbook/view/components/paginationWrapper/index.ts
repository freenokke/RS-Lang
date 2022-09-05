import Page from '../../../../helpers/page';

export default class PaginationWrapper extends Page {
  constructor(parentNode: HTMLElement) {
    super('nav', ['pagination'], parentNode, '', {});
  }
}
