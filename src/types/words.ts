export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface IWordWithDifficulty extends IWord {
  userWord?: Record<string, string>;
  _id?: string;
}

export interface IAggregatedWordResponse extends IWord {
  userWord: Record<string, string>;
}

export interface IAggregatedWord {
  paginatedResults: IAggregatedWordResponse[];
  totalCount: {
    count: number;
  }[];
}
