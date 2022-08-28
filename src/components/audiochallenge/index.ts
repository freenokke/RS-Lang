import { IWord } from '../../types/words';
import Page from '../helpers/page';
import Template from './index.html';
import './style.scss';

export default class Audiochallenge extends Page {
  constructor(
    wordsList: IWord[],
    comebackHash: string,
    parentNode: HTMLElement | null
  ) {
    super(
      'main',
      ['main', 'fullscreen', 'audiochallenge-page'],
      parentNode,
      Template,
      {}
    );
  }
}
