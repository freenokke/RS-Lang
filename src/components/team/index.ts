import Page from '../helpers/page';
import './style.scss';
import Template from './index.html';
import MaximPhoto from './assets/MaksimPicture.jpg';
import GithubIcon from './assets/github_icon.svg';
import ArtemPhoto from './assets/ArtemPicture.jpg';
import JanPhoto from './assets/JanPicture.jpg';

const model = {
  maximPhoto: MaximPhoto,
  githubIcon: GithubIcon,
  artemPhoto: ArtemPhoto,
  janPhoto: JanPhoto,
};

export default class Team extends Page {
  constructor(parentNode: HTMLElement | null) {
    super('main', ['main', 'team-page'], parentNode, Template, model);
  }
}
