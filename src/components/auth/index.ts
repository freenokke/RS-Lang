import Pages from '../../enum/routing';
import Header from '../header';
import Page from '../helpers/page';
import Api from '../services/api';
import Template from './index.html';
import './style.scss';

class Auth extends Page {
  private API: Api;
  private HEADER: Header;

  private authBtn: HTMLButtonElement;
  private authEmailInput: HTMLInputElement;
  private authPasswordInput: HTMLInputElement;
  private authErrorMessage: HTMLElement;
  private authForgetPasswordBtn: HTMLElement;
  private authRegistrationBtn: HTMLElement;

  private regBtn: HTMLButtonElement;
  private regPasswordInput: HTMLInputElement;
  private regEmailInput: HTMLInputElement;
  private regErrorMessage: HTMLElement;
  private regNameInput: HTMLInputElement;
  private regReturnToAuthBtn: HTMLElement;

  constructor(header: Header, parentNode: HTMLElement | null) {
    super('div', ['auth-block'], parentNode, Template, {
      comeBackHash: Pages.main,
    });
    this.HEADER = header;
    this.API = Api.getInstance();
    this.determineElements();
    this.initEventListeners();
  }

  private determineElements() {
    this.authPopupElements();
    this.registrationPopupElements();
  }

  private initEventListeners() {
    this.authPopupListeners();
    this.regPopupListeners();
  }

  private authPopupListeners() {
    this.authBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const email = this.authEmailInput.value;
        const password = this.authPasswordInput.value;
        await this.API.signInUser({ email, password });
        window.location.hash = Pages.main;
        this.clearAuthInputs();
        this.HEADER.changeAuthorizationIcon();
      } catch {
        this.authErrorMessage.innerHTML = `Такого пользователя не существует, зарегистрируйтесь`;
      }
    });
    this.authForgetPasswordBtn.onclick = () => {
      this.authErrorMessage.innerHTML = '';
    };
    this.authRegistrationBtn.onclick = () => {
      this.authErrorMessage.innerHTML = '';
    };
  }

  private regPopupListeners() {
    this.regBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const name = this.regNameInput.value;
      const email = this.regEmailInput.value;
      const password = this.regPasswordInput.value;
      const res = await this.API.createUserResponseTracking({
        name,
        email,
        password,
      });
      if (res.ok) {
        this.API.signInUser({ email, password });
        window.location.hash = Pages.main;
        this.clearRegInputs();
        this.HEADER.changeAuthorizationIcon();
      } else if (res.status === 417) {
        this.regErrorMessage.innerHTML = `Пользователь с таким email уже существует`;
      } else if (res.status === 422) {
        this.regErrorMessage.innerHTML = `Некорректные логин или пароль`;
      }
    });
    this.regReturnToAuthBtn.onclick = () => {
      this.regErrorMessage.innerHTML = '';
    };
  }

  private authPopupElements() {
    this.authEmailInput = this.node.querySelector(
      '.form-auth__email'
    ) as HTMLInputElement;
    this.authPasswordInput = this.node.querySelector(
      '.form-auth__password'
    ) as HTMLInputElement;
    this.authBtn = this.node.querySelector(
      '.form-auth__button'
    ) as HTMLButtonElement;
    this.authErrorMessage = this.node.querySelector(
      '.auth__error-message'
    ) as HTMLElement;
    this.authForgetPasswordBtn = this.node.querySelector(
      '.form-auth__forget-password-link'
    ) as HTMLElement;
    this.authRegistrationBtn = this.node.querySelector(
      '.form-auth__registration-link'
    ) as HTMLElement;
  }

  registrationPopupElements() {
    this.regBtn = this.node.querySelector(
      '.form-reg__button'
    ) as HTMLButtonElement;
    this.regPasswordInput = this.node.querySelector(
      '.form-reg__password'
    ) as HTMLInputElement;
    this.regEmailInput = this.node.querySelector(
      '.form-reg__email'
    ) as HTMLInputElement;
    this.regNameInput = this.node.querySelector(
      '.form-reg__name'
    ) as HTMLInputElement;
    this.regErrorMessage = this.node.querySelector(
      '.reg__error-message'
    ) as HTMLElement;
    this.regReturnToAuthBtn = this.node.querySelector(
      '.form-reg__back-to-existing-account'
    ) as HTMLElement;
  }

  private clearAuthInputs() {
    this.authEmailInput.value = '';
    this.authPasswordInput.value = '';
  }

  private clearRegInputs() {
    this.regEmailInput.value = '';
    this.regPasswordInput.value = '';
    this.regNameInput.value = '';
  }
}

export default Auth;
