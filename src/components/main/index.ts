import Page from '../helpers/page';
import LibraryIcon from './img/library.png';
import CancelIcon from './img/cancel.svg';
import GraphIcon from './img/graph.png';
import DoneIcon from './img/done.svg';
import PeopleIcon from './img/people_hi.svg';
import Template from './index.html';
import './style.scss';

const model = {
  libraryIcon: LibraryIcon,
  cancelIcon: CancelIcon,
  graphIcon: GraphIcon,
  doneIcon: DoneIcon,
  peopleIcon: PeopleIcon,
};

export default class Main extends Page {
  constructor(hash: string, parentNode: HTMLElement | null) {
    super('div', [], parentNode, Template, model);
  }
}
