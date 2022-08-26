import Pages from '../../enum/routing';
import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';

class Auth extends Page {
  constructor(parentNode: HTMLElement | null) {
    super('div', ['auth-block'], parentNode, Template, {
      comeBackHash: Pages.main,
    });
  }
}

export default Auth;
