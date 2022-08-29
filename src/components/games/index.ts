import Page from '../helpers/page';
import SprintGameBgImage from './img/sprint-resized.jpg';
import SprintGameActivationImage from './img/cheetah-no-bg.png';
import AudioChallengeGameBgImage from './img/female-listening-resized.jpg';
import AudioChallengeGameActivationImage from './img/headphones-no-bg.png';
import Template from './index.html';
import './style.scss';
import Pages from '../../enum/routing';
import Rules from '../rules';
import { IWord } from '../../types/words';
import Api from '../services/api';

const model = {
  sprintGameBgImage: SprintGameBgImage,
  sprintGameActivationImage: SprintGameActivationImage,
  audioChallengeGameBgImage: AudioChallengeGameBgImage,
  audioChallengeGameActivationImage: AudioChallengeGameActivationImage,
};

export default class Games extends Page {
  private API: Api;
  private rules: Rules;
  private playAudiochallengeGameBtn;
  private audioCallLevelInputs: NodeListOf<HTMLInputElement>;

  constructor(parentNode: HTMLElement | null) {
    super('main', ['main', 'games-page'], parentNode, Template, model);
    this.playAudiochallengeGameBtn = this.node.querySelector(
      '.audio-call-games__button'
    );
    this.API = Api.getInstance();
    this.audioCallLevelInputs = this.node.querySelectorAll(
      'input[name="audio-call-level-input"]'
    );
    this.initEventListeners();
  }

  private initEventListeners(): void {
    this.initAudiochallengeListeners();
  }

  private initAudiochallengeListeners(): void {
    this.playAudiochallengeGameBtn.addEventListener('click', () => {
      const level = Array.from(this.audioCallLevelInputs).filter((item) => {
        return item.checked;
      })[0];
      const levelName = level.nextElementSibling.textContent;
      const { group } = level.dataset;
      const rulesText = `Вам в течение 60 секунд нужно отгадать слова, которые вы услышите.</br> 
      Выбранный уровень: ${levelName}`;
      const wordsFOrgame = this.loadWordsByChosenGroup(group);
      this.rules = new Rules(
        document.body,
        'Audiochallenge',
        rulesText,
        wordsFOrgame,
        Pages.audiochallenge,
        Pages.games
      );
    });
  }

  private async loadWordsByChosenGroup(level: string): Promise<IWord[]> {
    const arrayOfpages = Array(30)
      .fill('')
      .map((item, index) => index);
    const randomPage =
      arrayOfpages[Math.floor(Math.random() * arrayOfpages.length)];
    const words = this.API.getWords(level, randomPage.toString());
    return words;
  }
}
