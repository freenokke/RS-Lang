import Page from '../helpers/page';
import DictionaryIcon from './img/dictionary-no-bg.png';
import SprintIcon from './img/cheetah-no-bg.png';
import AudioChallengeIcon from './img/headphones-no-bg.png';
import Template from './index.html';
import './style.scss';

const model = {
  dictionaryIcon: DictionaryIcon,
  sprintIcon: SprintIcon,
  audioChallengeIcon: AudioChallengeIcon,
};

export default class Stats extends Page {
  constructor(parentNode: HTMLElement | null) {
    super('main', ['main'], parentNode, Template, model);
  }
}
