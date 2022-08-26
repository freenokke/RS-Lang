const wordCards = document.querySelectorAll('.word-card');
const playButton = document.querySelectorAll('.word-card__transcription-svg');

wordCards.forEach((card) => {
  card.addEventListener('click', () => {
    const front = card.querySelector('.word-card__front');
    const back = card.querySelector('.word-card__back');
    [front, back].forEach((side) => {
      side.classList.toggle('card-flipped');
    });
    const playButton = card.querySelector('.word-card__transcription-svg');
    playButton
  });
  const playButton = card.querySelector('.word-card__transcription-svg');
  playButton.addEventListener('click', (e) => {
    e.stopPropagation();
  })
});
