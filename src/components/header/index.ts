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

const model = {
  logo: Logo,
  authIcon: AuthIcon,
  wordsbookIcon: WordsbookIcon,
  gamesIcon: GamesIcon,
  statsIcon: StatsIcon,
  teamIcon: TeamIcon,
};

export default class Header extends BaseComponent {
  private burgerMenuOpenButton;

  private burgerMenuCloseButton;

  private burgerMenu;

  private overlay;

  private authBtn;

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
    this.authBtn = this.node.querySelector('.header-auth');

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
}
