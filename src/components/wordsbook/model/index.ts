import { IWord } from '../../../types/words';
import Api from '../../services/api';

export default class Model {
  private api: Api;

  private onLevelChanged;

  private onWordChanged;

  private onPageChanged;

  private onWordsChanged;

  public words: IWord[];

  public currentWord: IWord;

  public currentLevel: number;

  public currentPage: number;

  constructor(
    onLevelChanged: (level: number) => void,
    onWordChanged: (word: IWord) => void,
    onPageChanged: (page: number) => void,
    onWordsChanged: (words: IWord[]) => void
  ) {
    this.onLevelChanged = onLevelChanged;
    this.onWordChanged = onWordChanged;
    this.onPageChanged = onPageChanged;
    this.onWordsChanged = onWordsChanged;
    this.api = Api.getInstance();
    this.currentLevel = 0;
    this.currentPage = 0;
    this.updateLevel(0);
  }

  async onLevelOrPageUpdated() {
    this.words = await this.api.getWords(
      this.currentLevel.toString(),
      this.currentPage.toString()
    );
    this.updateWords(this.words);
  }

  updateWords(words: IWord[]) {
    this.words = words;
    this.onWordsChanged(this.words);
  }

  async updateLevel(level: number) {
    this.currentLevel = level;
    this.currentPage = 0;
    await this.onLevelOrPageUpdated();
    this.onPageChanged(0);
  }

  async updatePage(page: number) {
    this.currentPage = page - 1;
    await this.onLevelOrPageUpdated();
    this.onPageChanged(page);
  }

  updateWord(word: IWord) {
    this.currentWord = word;
    this.onWordChanged(word);
  }
}
