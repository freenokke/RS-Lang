import Page from '../helpers/page';
import LibraryIcon from './img/library.png';
import CancelIcon from './img/cancel.svg';
import GraphIcon from './img/graph.png';
import DoneIcon from './img/done.svg';
import PeopleIcon from './img/people_hi.svg';
import Template from './index.html';
import './style.scss';
import Pages from '../../enum/routing';

const model = {
  libraryIcon: LibraryIcon,
  cancelIcon: CancelIcon,
  graphIcon: GraphIcon,
  doneIcon: DoneIcon,
  peopleIcon: PeopleIcon,
};

export default class Main extends Page {
  private registerButton;

  constructor(parentNode: HTMLElement | null) {
    super('main', ['main', 'main-page'], parentNode, Template, model);
    this.registerButton = this.node.querySelector('.registration__button');
    this.initEventListeners();
  }

  private initEventListeners() {
    this.registerButton.addEventListener('click', () => {
      window.location.hash = Pages.registration;
    });
  }
}
