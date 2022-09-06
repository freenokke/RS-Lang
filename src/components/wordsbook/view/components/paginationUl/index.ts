import Page from '../../../../helpers/page';

export default class PaginationUl extends Page {
  constructor(parentNode: HTMLElement) {
    super('ul', ['pagination__ul'], parentNode, '', {});
  }
}
