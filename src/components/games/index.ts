import Page from '../helpers/page';
import SprintGameBgImage from './img/sprint-min.jpg';
import SprintGameActivationImage from './img/cheetah-no-bg.png';
import AudioChallengeGameBgImage from './img/female-listening-min.jpg';
import AudioChallengeGameActivationImage from './img/headphones-no-bg.png';
import Template from './index.html';
import './style.scss';

const model = {
  sprintGameBgImage: SprintGameBgImage,
  sprintGameActivationImage: SprintGameActivationImage,
  audioChallengeGameBgImage: AudioChallengeGameBgImage,
  audioChallengeGameActivationImage: AudioChallengeGameActivationImage,
};

export default class Games extends Page {
  constructor(parentNode: HTMLElement | null) {
    super('main', [], parentNode, Template, model);
  }
}
