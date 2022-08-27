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
    document.addEventListener('click', (e) => {
      const isClickInsideMenu = this.burgerMenu.contains(
        e.target as HTMLElement
      );
      if (!isClickInsideMenu) {
        this.hideBurgerMenu();
      }
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
    this.overlay.style.display = 'none';
    document.body.classList.remove('_lock');
  }

  showBurgerMenu() {
    this.burgerMenu?.classList.add('burger-menu_active');
    this.overlay.style.display = 'block';
    document.body.classList.add('_lock');
  }

  changeAuthorizationIcon() {
    const user = localStorage.getItem('userName');
    if (user !== null) {
      this.username.innerHTML = `Hello, <span class="header-username__name">${user}</span>`;
    } else {
      this.username.innerHTML = '';
    }
    if (localStorage.getItem('userToken') !== null) {
      this.authBtn.classList.remove('header-auth__icon_active');
      this.logoutBtn.classList.add('header-auth__icon_active');
    } else {
      this.authBtn.classList.add('header-auth__icon_active');
      this.logoutBtn.classList.remove('header-auth__icon_active');
    }
  }
}
