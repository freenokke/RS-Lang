import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';

export default class Sprint extends Page {
  constructor(parentNode: HTMLElement | null) {
    super('div', [], parentNode, Template, {});
  }
}
