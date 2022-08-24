import BaseComponent from '../helpers/baseComponent';

export default class Header extends BaseComponent {
  constructor(parentNode: HTMLElement | null) {
    super('header', [], parentNode, 'header', {});
  }
}
