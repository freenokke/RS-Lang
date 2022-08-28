import Page from '../helpers/page';
import SprintGameBgImage from './img/sprint-resized.jpg';
import SprintGameActivationImage from './img/cheetah-no-bg.png';
import AudioChallengeGameBgImage from './img/female-listening-resized.jpg';
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
    super('main', ['main', 'games-page'], parentNode, Template, model);
  }
}
