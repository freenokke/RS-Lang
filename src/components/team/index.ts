import Page from '../helpers/page';
import './style.scss';
import Template from './index.html';
import MaximPhoto from './assets/maksim_photo_multi.webp';
import GithubIcon from './assets/github_icon.svg';
import ArtemPhoto from './assets/artem_photo_multi.webp';
import JanPhoto from './assets/jan_photo_multi.webp';

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
