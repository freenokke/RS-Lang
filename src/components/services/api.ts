import { Domain, Path } from '../../enum/endpoints';
import {
  IUserCreate,
  IUserCreateResp,
  IUserSettings,
  IUserSignIn,
  IUserSignInResp,
  IUserStatistic,
  IUserWords,
  IUserWordsResp,
} from '../../types/users';
import { IWord, IAggregatedWord } from '../../types/words';

class Api {
  private static instance: Api;
  private domain: string;

  constructor() {
    this.domain = Domain.BASE;
  }

  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }

    return Api.instance;
  }

  public async getWords(group?: string, page?: string): Promise<IWord[]> {
    let res: Response;
    if (page === undefined && group === undefined) {
      res = await fetch(`${this.domain}/${Path.WORDS}`);
    } else if (page === undefined) {
      res = await fetch(`${this.domain}/${Path.WORDS}?group=${group}`);
    } else if (group === undefined) {
      res = await fetch(`${this.domain}/${Path.WORDS}?page=${page}`);
    } else {
      res = await fetch(
        `${this.domain}/${Path.WORDS}?group=${group}&page=${page}`
      );
    }
    const words: IWord[] = await res.json();
    return words;
  }

  public async getWordById(id: string): Promise<IWord> {
    const res = await fetch(`${this.domain}/${Path.WORDS}/${id}`);
    const word: IWord = await res.json();
    return word;
  }

  public async createUser(parameters: IUserCreate): Promise<IUserCreateResp> {
    const res = await fetch(`${this.domain}/${Path.USERS}`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(parameters),
    });
    const user: IUserCreateResp = await res.json();
    return user;
  }

  public async signInUser(parameters: IUserSignIn): Promise<IUserSignInResp> {
    const res = await fetch(`${this.domain}/${Path.SIGNIN}`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(parameters),
    });
    const data: IUserSignInResp = await res.json();
    localStorage.setItem('userToken', `${data.token}`);
    localStorage.setItem('userRefreshToken', `${data.refreshToken}`);
    return data;
  }

  public async getUserById(
    id: string,
    token: string
  ): Promise<IUserCreateResp> {
    const res = await fetch(`${this.domain}/${Path.USERS}/${id}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const user: IUserCreateResp = await res.json();
    return user;
  }

  public async updateUser(
    id: string,
    token: string,
    parameters: {
      email: string;
      password: string;
    }
  ): Promise<IUserCreateResp> {
    const res = await fetch(`${this.domain}/${Path.USERS}/${id}`, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(parameters),
    });
    const userData: IUserCreateResp = await res.json();
    return userData;
  }

  public async deleteUser(id: string, token: string): Promise<void> {
    await fetch(`${this.domain}/${Path.USERS}/${id}`, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private async getNewUserTokens(
    id: string,
    refreshToken: string
  ): Promise<IUserSignInResp> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${id}/${Path.TOKENS}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    const data: IUserSignInResp = await res.json();
    return data;
  }

  public async checkUserTokens(
    id: string,
    refreshToken: string
  ): Promise<void> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${id}/${Path.TOKENS}/check`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    const result: boolean = await res.json();

    if (result) {
      this.getNewUserTokens(id, refreshToken);
    }
  }

  // =================== Users/Words=============

  public async getAllUserWords(
    userId: string,
    token: string
  ): Promise<IUserWords[]> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.WORDS}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const words: IUserWords[] = await res.json();
    return words;
  }

  public async createUserWords(
    userId: string,
    wordId: string,
    parameters: IUserWords,
    token: string
  ): Promise<IUserWordsResp> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.WORDS}/${wordId}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(parameters),
      }
    );
    const createdUserWord: IUserWordsResp = await res.json();
    return createdUserWord;
  }

  public async getUserWordById(
    userId: string,
    wordId: string,
    token: string
  ): Promise<IUserWords> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.WORDS}/${wordId}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const word: IUserWords = await res.json();
    return word;
  }

  public async updateUserWord(
    userId: string,
    wordId: string,
    parameters: IUserWords,
    token: string
  ): Promise<IUserWords> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.WORDS}/${wordId}`,
      {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(parameters),
      }
    );
    const word: IUserWords = await res.json();
    return word;
  }

  public async deleteUserWord(
    userId: string,
    wordId: string,
    token: string
  ): Promise<void> {
    await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.WORDS}/${wordId}`,
      {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  public async getUserAggregatedWords(
    userId: string,
    token: string,
    group: string = '',
    page: string = '',
    wordsPerPage: string = '',
    filter: string = ''
  ): Promise<IAggregatedWord[]> {
    const queryParameters = [];
    if (group) {
      queryParameters.push(`group=${group}`);
    }
    if (page) {
      queryParameters.push(`page=${page}`);
    }
    if (wordsPerPage) {
      queryParameters.push(`wordsPerPage=${wordsPerPage}`);
    }
    if (filter) {
      queryParameters.push(`filter=${filter}`);
    }
    const finalQueryString = queryParameters.join('&');
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.AGWORDS}?${finalQueryString}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const words: IAggregatedWord[] = await res.json();
    return words;
  }

  public async getUserAggregatedWordById(
    userId: string,
    wordId: string,
    token: string
  ): Promise<IUserWords> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.AGWORDS}/${wordId}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const word: IUserWords = await res.json();
    return word;
  }

  public async getUserStatistic(
    userId: string,
    token: string
  ): Promise<IUserStatistic> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.STAT}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const statistic: IUserStatistic = await res.json();
    return statistic;
  }

  public async updateUserStatistic(
    userId: string,
    parameters: {
      learnedWords: number;
      optional?: { [key: string]: string | number };
    },
    token: string
  ): Promise<IUserStatistic> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.STAT}`,
      {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(parameters),
      }
    );
    const statistic: IUserStatistic = await res.json();
    return statistic;
  }

  public async getUserSettings(
    userId: string,
    token: string
  ): Promise<IUserSettings> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.SETTINGS}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const settings: IUserSettings = await res.json();
    return settings;
  }

  public async updateUserSettings(
    userId: string,
    parameters: {
      wordsPerDay: number;
      optional?: { [key: string]: string | number };
    },
    token: string
  ): Promise<IUserSettings> {
    const res = await fetch(
      `${this.domain}/${Path.USERS}/${userId}/${Path.SETTINGS}`,
      {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(parameters),
      }
    );
    const settings: IUserSettings = await res.json();
    return settings;
  }
}

export default Api;
