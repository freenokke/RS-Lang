import Page from '../helpers/page';
import MapIcon from './img/01_0008.jpg';
import FromWBtoAudiochallengeGame from './img/headphones-no-bg.png';
import FromWBtoSprintGame from './img/cheetah-no-bg.png';
import Template from './index.html';
import './style.scss';

const model = {
  mapIcon: MapIcon,
  fromWBtoAudiochallengeGame: FromWBtoAudiochallengeGame,
  fromWBtoSprintGame: FromWBtoSprintGame,
};

export default class Wordsbook extends Page {
  constructor(parentNode: HTMLElement | null) {
    super('main', ['main', 'wordsbook-page'], parentNode, Template, model);
  }
}
