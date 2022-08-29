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
  private playSprintGameBtn;
  private audioCallLevelInputs: NodeListOf<HTMLInputElement>;
  private sprintLevelInputs: NodeListOf<HTMLInputElement>;

  constructor(parentNode: HTMLElement | null) {
    super('main', ['main', 'games-page'], parentNode, Template, model);
    this.API = Api.getInstance();

    this.playAudiochallengeGameBtn = this.node.querySelector(
      '.audio-call-games__button'
    );
    this.playSprintGameBtn = this.node.querySelector('.sprint-games__link');
    this.audioCallLevelInputs = this.node.querySelectorAll(
      'input[name="audio-call-level-input"]'
    );
    this.sprintLevelInputs = this.node.querySelectorAll(
      'input[name="sprint-level-input"]'
    );
    this.initEventListeners();
  }

  private initEventListeners(): void {
    this.initAudiochallengeListeners();
    this.initSprintListeners();
  }

  private initSprintListeners(): void {
    this.playSprintGameBtn.addEventListener('click', async () => {
      const level = Array.from(this.sprintLevelInputs).filter((item) => {
        return item.checked;
      })[0];
      const levelName = level.nextElementSibling.textContent;
      const { group } = level.dataset;
      const wordsFOrgame = await this.loadWordsByChosenGroup(group);
      this.rules = new Rules(
        document.body,
        'Sprint',
        levelName,
        wordsFOrgame,
        Pages.audiochallenge,
        Pages.games
      );
    });
  }

  private initAudiochallengeListeners(): void {
    this.playAudiochallengeGameBtn.addEventListener('click', async () => {
      const level = Array.from(this.audioCallLevelInputs).filter((item) => {
        return item.checked;
      })[0];
      const levelName = level.nextElementSibling.textContent;
      const { group } = level.dataset;
      const wordsFOrgame = await this.loadWordsByChosenGroup(group);
      this.rules = new Rules(
        document.body,
        'Audiochallenge',
        levelName,
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
