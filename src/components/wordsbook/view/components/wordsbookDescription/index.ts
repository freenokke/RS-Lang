import { Domain } from '../../../../../enum/endpoints';
import { IWordWithDifficulty } from '../../../../../types/words';
import Page from '../../../../helpers/page';
import Api from '../../../../services/api';
import Template from './index.html';

export default class WordsbookDescription extends Page {
  private word;

  private playButton: HTMLButtonElement;

  public buttonsContainer: HTMLDivElement;

  private textWrapper: HTMLDivElement;

  private api: Api;

  constructor(parentNode: HTMLElement, word: IWordWithDifficulty) {
    // Эта обертка нужна по техническим причинам. НЕ УДАЛЯТЬ!!!

    super('div', [], parentNode, Template, {
      image: `${Domain.BASE}/${word.image}`,
      word: word.word,
      translation: word.wordTranslate,
      transcription: word.transcription,
      textMeaning: word.textMeaning,
      textMeaningTranslation: word.textMeaningTranslate,
      textExample: word.textExample,
      textExampleTranslation: word.textExampleTranslate,
    });
    this.word = word;
    this.api = Api.getInstance();
    this.init();
    this.initEventListeners();
  }

  init() {
    this.playButton = this.node.querySelector(
      '.wordsbook-description__transcription-play'
    );
    this.buttonsContainer = this.node.querySelector(
      '.wordsbook-description__buttons-container'
    );
    this.textWrapper = this.node.querySelector(
      '.wordsbook-description__text-wrapper'
    );
    this.showWordStats();
  }

  private async showWordStats() {
    try {
      if (localStorage.getItem('userData')) {
        // console.log(this.word);
        const wordStat = await this.api.getUserWordById(
          JSON.parse(localStorage.getItem('userData')).userId,
          // eslint-disable-next-line no-underscore-dangle
          this.word._id,
          JSON.parse(localStorage.getItem('userData')).userToken
        );
        if (wordStat.optional) {
          const audioElement = document.createElement('p');
          audioElement.innerHTML = `</br><b>Аудиовызов</b>: угадано <b>${wordStat.optional.audio.guessed}</b>,
        не угадано <b>${wordStat.optional.audio.unguessed}</b></br></br>`;
          this.textWrapper.append(audioElement);
          const sprintElement = document.createElement('p');
          sprintElement.innerHTML = `<b>Спринт</b>: угадано <b>${wordStat.optional.sprint.guessed}</b>,
         не угадано <b>${wordStat.optional.sprint.unguessed}</b>`;
          this.textWrapper.append(sprintElement);
        }
      }
    } catch {
      console.log('Not found');
    }
  }

  initEventListeners() {
    this.playButton.addEventListener('click', () => {
      const tracks = [
        `${Domain.BASE}/${this.word.audio}`,
        `${Domain.BASE}/${this.word.audioMeaning}`,
        `${Domain.BASE}/${this.word.audioExample}`,
      ];
      let currentTrackIdx = 1;
      const audio = new Audio();
      [audio.src] = tracks;
      audio.volume = 0.5;
      audio.play();
      audio.onended = () => {
        if (currentTrackIdx < tracks.length) {
          audio.src = tracks[currentTrackIdx];
          audio.play();
          currentTrackIdx += 1;
        }
      };
    });
  }
}
