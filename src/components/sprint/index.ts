import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';
import { IWord } from '../../types/words';

export default class Sprint extends Page {
  private params: { page: string; group: string };
  constructor(
    wordsList: IWord[],
    comebackHash: string,
    parentNode: HTMLElement | null,
    params: { page: string; group: string }
  ) {
    super(
      'main',
      ['main', 'fullscreen', 'sprint-page'],
      parentNode,
      Template,
      {}
    );
    this.params = params;
  }
}
