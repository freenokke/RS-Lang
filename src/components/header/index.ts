import BaseComponent from '../helpers/baseComponent';
import Template from './index.html';
import Logo from './img/logo.png';
import AuthIcon from './img/user.svg';
import WordsbookIcon from './img/book.svg';
import GamesIcon from './img/gamepad.svg';
import StatsIcon from './img/chart.svg';
import TeamIcon from './img/team.svg';
import './style.scss';
import Pages from '../../enum/routing';
import LogoutIcon from './img/logout.svg';
import { ILocalStorageUserData } from '../../types/users';

const model = {
  logo: Logo,
  authIcon: AuthIcon,
  wordsbookIcon: WordsbookIcon,
  gamesIcon: GamesIcon,
  statsIcon: StatsIcon,
  teamIcon: TeamIcon,
  logoutIcon: LogoutIcon,
};

export default class Header extends BaseComponent {
  private burgerMenuOpenButton;

  private burgerMenuCloseButton;

  private burgerMenu;

  private overlay;

  private authBtn;

  private logoutBtn;

  private username;

  constructor(parentNode: HTMLElement | null) {
    super('header', ['header-container'], parentNode, Template, model);
    this.burgerMenuOpenButton = this.node.querySelector('.header-burger-icon');
    this.burgerMenu = this.node.querySelector('.burger-menu');
    this.burgerMenuCloseButton = this.node.querySelector(
      '.burger-menu__close-button'
    );
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');
    document.body.append(this.overlay);
    this.authBtn = this.node.querySelector('.login');
    this.logoutBtn = this.node.querySelector('.logout');
    this.username = this.node.querySelector('.header-username');

    this.initEventListeners();
  }

  initEventListeners() {
    this.burgerMenuOpenButton?.addEventListener('click', (e) => {
      this.showBurgerMenu();
      e.stopPropagation();
    });
    this.burgerMenuCloseButton?.addEventListener('click', () => {
      this.hideBurgerMenu();
    });

    this.burgerMenu?.addEventListener('click', (e) => {
      const li = (e.target as HTMLElement).closest('li.menu-item');
      if (li) {
        this.hideBurgerMenu();
      }
    });
    this.authBtn?.addEventListener('click', () => {
      window.location.hash = Pages.auth;
    });
    this.logoutBtn?.addEventListener('click', () => {
      localStorage.clear();
      this.changeAuthorizationIcon();
    });
  }

  hideBurgerMenu() {
    this.burgerMenu?.classList.remove('burger-menu_active');
    this.burgerMenu?.classList.add('burger-menu_not-active');
    this.overlay.style.display = 'none';
    document.body.classList.remove('_lock');
    (this.burgerMenu as HTMLElement).onanimationend = () => {
      this.burgerMenu?.classList.remove('burger-menu_not-active');
    };
    document.removeEventListener('click', this.isClickInsideMenu);
  }

  showBurgerMenu() {
    this.burgerMenu?.classList.remove('burger-menu_not-active');
    this.burgerMenu?.classList.add('burger-menu_active');
    this.overlay.style.display = 'block';
    document.body.classList.add('_lock');
    document.addEventListener('click', this.isClickInsideMenu);
  }

  changeAuthorizationIcon() {
    const userData: ILocalStorageUserData = JSON.parse(
      localStorage.getItem('userData')
    );
    if (userData !== null) {
      this.username.innerHTML = `<span class="header-username__name">${userData.userName}</span>`;
      this.authBtn.classList.remove('header-auth__icon_active');
      this.logoutBtn.classList.add('header-auth__icon_active');
    } else {
      this.username.innerHTML = '';
      this.authBtn.classList.add('header-auth__icon_active');
      this.logoutBtn.classList.remove('header-auth__icon_active');
    }
  }

  private isClickInsideMenu = (ev: MouseEvent) => {
    const isClickInsideMenu = this.burgerMenu.contains(
      ev.target as HTMLElement
    );
    if (!isClickInsideMenu) {
      this.hideBurgerMenu();
    }
  };
}
