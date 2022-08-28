import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';
import { IWord } from '../../types/words';

export default class Sprint extends Page {
  constructor(
    wordsList: IWord[],
    comebackHash: string,
    parentNode: HTMLElement | null
  ) {
    super(
      'main',
      ['main', 'fullscreen', 'sprint-page'],
      parentNode,
      Template,
      {}
    );
  }
}
