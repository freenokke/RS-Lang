export interface IUserCreate {
  name: string;
  email: string;
  password: string;
}

export interface IUserCreateResp {
  id: string;
  email: string;
  password: string;
}

export interface IUserSignIn {
  email: string;
  password: string;
}

export interface IUserSignInResp {
  message: 'string';
  token: 'string';
  refreshToken: 'string';
  userId: 'string';
  name: 'string';
}

export interface IUserWordsResp {
  id: string;
  difficulty: string;
  optional?: {
    guessedInARow: number;
    sprint: {
      guessed: number;
      unguessed: number;
    };
    audio: {
      guessed: number;
      unguessed: number;
    };
    attempts: number;
  };
  wordId: string;
}

export interface IUserWords {
  difficulty: string;
  optional?: {
    guessedInARow: number;
    sprint: {
      guessed: number;
      unguessed: number;
    };
    audio: {
      guessed: number;
      unguessed: number;
    };
    attempts: number;
  };
}

export interface IUserStatistic {
  learnedWords: number;
  optional?: {
    gameStat: {
      audio: {
        learnedWords: number;
        newWords: number;
        correctAnswers: number;
        wrongAswers: number;
        longestSeries: number;
      };
      sprint: {
        learnedWords: number;
        newWords: number;
        correctAnswers: number;
        wrongAswers: number;
        longestSeries: number;
      };
    };
  };
}
export interface IUserStatisticResp {
  id: string;
  learnedWords: number;
  optional?: {
    lastVisited: number;
    gameStat: {
      audio: {
        learnedWords: number;
        newWords: number;
        correctAnswers: number;
        wrongAswers: number;
        longestSeries: number;
      };
      sprint: {
        learnedWords: number;
        newWords: number;
        correctAnswers: number;
        wrongAswers: number;
        longestSeries: number;
      };
    };
  };
}

export interface IUserSettings {
  id: string;
  wordsPerDay: number;
  optional?: { [key: string]: string | number };
}

export interface IGetUserResp {
  id: string;
  name: string;
  email: string;
}

export interface ILocalStorageUserData {
  userToken: string;
  userRefreshToken: string;
  userName: string;
  userId: string;
}
