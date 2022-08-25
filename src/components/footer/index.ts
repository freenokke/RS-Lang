import BaseComponent from '../helpers/baseComponent';
import RsSchoolLogo from './img/rsschool_logo.svg';
import gitHubLogo from './img/github.svg';
import Template from './index.html';
import './style.scss';

const model = {
  rslogo: RsSchoolLogo,
  githublogo: gitHubLogo,
};

class Footer extends BaseComponent {
  constructor(parentNode: HTMLElement | null) {
    super('footer', [], parentNode, Template, model);
  }
}

export default Footer;
