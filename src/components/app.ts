import Pages from '../enum/routing';
import Header from './header';
import Page from './helpers/page';
import Main from './main';
import Team from './team';
import Wordsbook from './wordsbook';
import Games from './games';
import Stats from './stats';
import Footer from './footer';
import Auth from './auth';

export default class App {
  public header: Header;
  private footer: Footer;
  private authPopup: Auth;

  private static page: Page | null;
  private static currentPage = 'current-page';

  constructor() {
    this.initEventListeners();
    this.header = new Header(null);
    this.footer = new Footer(null);
    this.authPopup = new Auth(this.header, document.body);
  }

  initEventListeners() {
    window.addEventListener('hashchange', () => {
      const { hash } = window.location;
      this.renderNewPage(hash);
      window.console.log(window.location.hash);
    });

    window.addEventListener('load', () => {
      console.log('loaded');
    });
  }

  renderNewPage(pageId: string) {
    const element = document.querySelector(`#${App.currentPage}`);
    if (element) {
      element.remove();
    }
    App.page = null;
    if (pageId === Pages.main) {
      this.renderMainPage();
    } else if (pageId === Pages.wordsbook) {
      this.renderWordsBookPage();
    } else if (pageId === Pages.about) {
      this.renderAboutPage();
    } else if (pageId === Pages.games) {
      this.renderGamesPage();
    } else if (pageId === Pages.audiochallenge) {
      this.renderAudiochallengePage();
    } else if (pageId === Pages.auth || pageId === Pages.registration) {
      this.renderAuthPage();
    } else if (pageId === Pages.sprint) {
      this.renderSprintGame();
    } else if (pageId === Pages.stats) {
      this.renderStatsPage();
    } else {
      window.console.log('Unknown page');
    }
  }

  run() {
    const { hash } = window.location;
    if (hash) {
      this.renderNewPage(hash);
    } else {
      window.location.hash = Pages.main;
    }
    this.checkAuthorisation();
  }

  private checkAuthorisation() {
    this.header.changeAuthorizationIcon();
  }

  private renderMainPage() {
    document.body.append(this.header.node);
    App.page = new Main(document.body);
    App.page.node.id = App.currentPage;
    document.body.append(this.footer.node);
  }

  private renderWordsBookPage() {
    document.body.append(this.header.node);
    App.page = new Wordsbook(document.body);
    App.page.node.id = App.currentPage;
    document.body.append(this.footer.node);
  }

  private renderAboutPage() {
    document.body.append(this.header.node);
    App.page = new Team(document.body);
    App.page.node.id = App.currentPage;
    document.body.append(this.footer.node);
  }

  private renderGamesPage() {
    document.body.append(this.header.node);
    App.page = new Games(document.body);
    App.page.node.id = App.currentPage;
    document.body.append(this.footer.node);
  }

  private renderAudiochallengePage() {
    this.header.node.remove();
    this.footer.node.remove();
  }

  private renderAuthPage() {
    this.header.node.remove();
    this.footer.node.remove();
  }

  private renderSprintGame() {
    this.header.node.remove();
    this.footer.node.remove();
  }

  private renderStatsPage() {
    document.body.append(this.header.node);
    App.page = new Stats(document.body);
    App.page.node.id = App.currentPage;
    document.body.append(this.footer.node);
  }
}
