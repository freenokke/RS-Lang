import Page from '../helpers/page';
import DictionaryIcon from './img/dictionary-no-bg.png';
import SprintIcon from './img/cheetah-no-bg.png';
import AudioChallengeIcon from './img/headphones-no-bg.png';
import Template from './index.html';
import './style.scss';
import Api from '../services/api';
import { ILocalStorageUserData, IUserStatistic } from '../../types/users';

const model = {
  dictionaryIcon: DictionaryIcon,
  sprintIcon: SprintIcon,
  audioChallengeIcon: AudioChallengeIcon,
};

export default class Stats extends Page {
  private statisticBlock: HTMLElement;
  private page: HTMLElement;
  private api: Api;
  private sprintLongestSeries: HTMLElement;
  private sprintNewWords: HTMLElement;
  private sprintLearnedWords: HTMLElement;
  private sprintDiagram: HTMLElement;
  private audioNewWords: HTMLElement;
  private audioLongestSeries: HTMLElement;
  private audioLearnedWords: HTMLElement;
  private audioDiagram: HTMLElement;
  private sprintStatBlock: HTMLElement;
  private audioStatBlock: HTMLElement;
  private wordsNewWords: HTMLElement;
  private wordsLearnedWords: HTMLElement;
  private wordsDiagram: HTMLElement;
  private wordsStatBlock: HTMLElement;
  private sprintWrongValue: number;
  private sprintCorrectValue: number;
  private sprintLearnedValue: number;
  private sprintNewValue: number;
  private sprintLongestValue: number;
  private audioNewValue: number;
  private audioLearnedValue: number;
  private audioWrongValue: number;
  private audioCorrectValue: number;
  private audioLongestValue: number;

  constructor(parentNode: HTMLElement | null) {
    super('main', ['main', 'stats-page'], parentNode, Template, model);
    this.api = Api.getInstance();

    this.determineElements();
    this.init();
  }

  private async init() {
    if (this.checkAuth()) {
      const userData: ILocalStorageUserData = JSON.parse(
        localStorage.getItem('userData')
      );
      try {
        const stat = await this.api.getUserStatistic(
          userData.userId,
          userData.userToken
        );
        this.determineData(stat);
        this.renderWordsStat();
        this.renderAudioChallengeStat();
        this.renderSprintStat();
      } catch (error) {
        this.statisticBlock.innerHTML = `Время сессии вышло, <a href="#/auth">переавторизуйтесь</a>`;
      }
    }
  }

  private determineElements() {
    this.page = this.node.querySelector('main');
    this.statisticBlock = this.node.querySelector('.statistics');
    this.sprintNewWords = this.node.querySelector(
      '#content-2 .tabs-statistics__new-words'
    );
    this.sprintLongestSeries = this.node.querySelector(
      '#content-2 .tabs-statistics__series-lenght'
    );
    this.sprintDiagram = this.node.querySelector('.pie-sprint');
    this.sprintStatBlock = this.node.querySelector('#content-2');
    this.audioNewWords = this.node.querySelector(
      '#content-3 .tabs-statistics__new-words'
    );
    this.audioLongestSeries = this.node.querySelector(
      '#content-3 .tabs-statistics__series-lenght'
    );
    this.audioDiagram = this.node.querySelector('.pie-call');
    this.audioStatBlock = this.node.querySelector('#content-3');
    this.wordsNewWords = this.node.querySelector(
      '#content-1 .tabs-statistics__new-words'
    );
    this.wordsLearnedWords = this.node.querySelector(
      '#content-1 .tabs-statistics__general-words'
    );
    this.wordsDiagram = this.node.querySelector('.pie-words');
    this.wordsStatBlock = this.node.querySelector('#content-1');
  }

  private checkAuth(): boolean {
    if (localStorage.getItem('userData') === null) {
      this.statisticBlock.innerHTML = `<h3>Статистика доступна только для авторизованных пользователей</h3>`;
      return false;
    }
    return true;
  }

  renderWordsStat() {
    const totalWords =
      this.audioCorrectValue +
      this.sprintCorrectValue +
      this.audioWrongValue +
      this.sprintWrongValue;
    if (totalWords === 0) {
      this.wordsStatBlock.innerHTML = `
      <h4>Не данных для статистики.<br/> Сыграйте хотя бы 1 игру</h4>
      `;
    } else {
      this.wordsNewWords.textContent = (
        this.audioNewValue + this.sprintNewValue
      ).toString();
      this.wordsLearnedWords.textContent = (
        this.audioLearnedValue + this.sprintLearnedValue
      ).toString();
      const percentOfRightAnswers =
        ((this.audioCorrectValue + this.sprintCorrectValue) / totalWords) * 100;
      this.wordsDiagram.setAttribute(
        'style',
        `--p:${Math.round(percentOfRightAnswers)};--c:purple`
      );
      this.wordsDiagram.textContent = `${Math.round(percentOfRightAnswers)}%`;
    }
  }

  private renderAudioChallengeStat() {
    if (this.audioWrongValue === 0 && this.audioCorrectValue === 0) {
      this.audioStatBlock.innerHTML = `
      <h4>По данной игре еще нет статистики.<br/> Сыграйте хотя бы 1 игру</h4>
      `;
    } else {
      this.audioNewWords.textContent = this.audioNewValue.toString();
      this.audioLongestSeries.textContent = this.audioLongestValue.toString();
      const percentOfRightAnswers =
        (this.audioCorrectValue /
          (this.audioCorrectValue + this.audioWrongValue)) *
        100;
      this.audioDiagram.setAttribute(
        'style',
        `--p:${Math.round(percentOfRightAnswers)};--c:purple`
      );
      this.audioDiagram.textContent = `${Math.round(percentOfRightAnswers)}%`;
    }
  }

  private renderSprintStat() {
    if (this.sprintWrongValue === 0 && this.sprintCorrectValue === 0) {
      this.sprintStatBlock.innerHTML = `
      <h4>По данной игре еще нет статистики.<br/> Сыграйте хотя бы 1 игру<h4>
      `;
    }
    this.sprintNewWords.textContent = this.sprintNewValue.toString();
    this.sprintLongestSeries.textContent = this.sprintLongestValue.toString();
    const percentOfRightAnswers =
      (this.sprintCorrectValue /
        (this.sprintCorrectValue + this.sprintWrongValue)) *
      100;
    this.sprintDiagram.setAttribute(
      'style',
      `--p:${percentOfRightAnswers};--c:purple`
    );
    this.sprintDiagram.textContent = `${Math.round(percentOfRightAnswers)}%`;
  }

  // eslint-disable-next-line class-methods-use-this
  private determineData(stat: IUserStatistic) {
    this.sprintWrongValue = stat.optional.gameStat.sprint.wrongAswers;
    this.sprintCorrectValue = stat.optional.gameStat.sprint.correctAnswers;
    this.sprintLearnedValue = stat.optional.gameStat.sprint.learnedWords;
    this.sprintNewValue = stat.optional.gameStat.sprint.newWords;
    this.sprintLongestValue = stat.optional.gameStat.sprint.longestSeries;

    this.audioNewValue = stat.optional.gameStat.audio.newWords;
    this.audioLearnedValue = stat.optional.gameStat.audio.learnedWords;
    this.audioWrongValue = stat.optional.gameStat.audio.wrongAswers;
    this.audioCorrectValue = stat.optional.gameStat.audio.correctAnswers;
    this.audioLongestValue = stat.optional.gameStat.audio.longestSeries;
  }
}
