import { Domain } from '../../../../../enum/endpoints';
import { IWord } from '../../../../../types/words';
import Page from '../../../../helpers/page';
import Template from './index.html';

export default class WordsbookDescription extends Page {
  private word;

  private playButton: HTMLButtonElement;

  constructor(parentNode: HTMLElement, word: IWord) {
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
    this.init();
    this.initEventListeners();
  }

  init() {
    this.playButton = this.node.querySelector(
      '.wordsbook-description__transcription-play'
    );
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
