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
  optional?: { [key: string]: string };
  wordId: string;
}

export interface IUserWords {
  difficulty: string;
  optional?: { [key: string]: string };
}

export interface IUserStatistic {
  id: string;
  learnedWords: number;
  optional?: { [key: string]: string | number };
}

export interface IUserSettings {
  id: string;
  wordsPerDay: number;
  optional?: { [key: string]: string | number };
}
