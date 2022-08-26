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
  // private wordCards: HTMLCollection;
  // private playButton: HTMLCollection;

  constructor(parentNode: HTMLElement | null) {
    super('div', [], parentNode, Template, model);
    // this.wordCards = document.querySelectorAll('.word-card');
    // this.playButton = document.querySelectorAll(
    //   '.word-card__transcription-svg'
    // );
  }

  // public rotateCards() {
  //   this.wordCards.forEach((card) => {
  //     card.addEventListener('click', () => {
  //       const front = card.querySelector('.word-card__front');
  //       const back = card.querySelector('.word-card__back');
  //       [front, back].forEach((side) => {
  //         side.classList.toggle('card-flipped');
  //       });
  //       const playButton = card.querySelector('.word-card__transcription-svg');
  //       playButton;
  //     });
  //     const playButton = card.querySelector('.word-card__transcription-svg');
  //     playButton.addEventListener('click', (e) => {
  //       e.stopPropagation();
  //     });
  //   });
  // }
}
