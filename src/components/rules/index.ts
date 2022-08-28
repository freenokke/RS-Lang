import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';

export default class Rules extends Page {
  constructor(
    parentNode: HTMLElement,
    gameName: string,
    rules: string,
    gameHash: string
  ) {
    super('main', ['main', 'rules-page'], parentNode, Template, {
      rules,
      gameName,
      hash: gameHash,
    });
  }
}
