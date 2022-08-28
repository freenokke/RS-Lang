import Pages from '../enum/routing';
import Header from './header';
import Page from './helpers/page';
import Main from './main';
import Team from './team';
import Wordsbook from './wordsbook';
import Games from './games';
import Audiochallenge from './audiochallenge';
import Stats from './stats';
import Sprint from './sprint';
import Footer from './footer';
import Auth from './auth';

export default class App {
  public header: Header;
  private footer: Footer;
  private authPopup: Auth;

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
      console.log(window.location.hash);
    });
  }

  renderNewPage(pageId: string) {
    const element = document.querySelector(`#${App.currentPage}`);
    if (element) {
      element.remove();
    }
    let page: Page | null = null;
    if (pageId === Pages.main) {
      document.body.append(this.header.node);
      page = new Main(document.body);
      page.node.id = App.currentPage;
      document.body.append(this.footer.node);
    } else if (pageId === Pages.wordsbook) {
      document.body.append(this.header.node);
      page = new Wordsbook(document.body);
      page.node.id = App.currentPage;
      document.body.append(this.footer.node);
    } else if (pageId === Pages.about) {
      document.body.append(this.header.node);
      page = new Team(document.body);
      page.node.id = App.currentPage;
      document.body.append(this.footer.node);
    } else if (pageId === Pages.games) {
      document.body.append(this.header.node);
      page = new Games(document.body);
      page.node.id = App.currentPage;
      document.body.append(this.footer.node);
    } else if (pageId === Pages.audiochallenge) {
      this.header.node.remove();
      this.footer.node.remove();
      page = new Audiochallenge([], 'yourhash', document.body);
      page.node.id = App.currentPage;
    } else if (pageId === Pages.auth || pageId === Pages.registration) {
      this.header.node.remove();
      this.footer.node.remove();
    } else if (pageId === Pages.sprint) {
      this.header.node.remove();
      this.footer.node.remove();
      page = new Sprint([], 'yourhash', document.body);
      page.node.id = App.currentPage;
    } else if (pageId === Pages.stats) {
      document.body.append(this.header.node);
      page = new Stats(document.body);
      page.node.id = App.currentPage;
      document.body.append(this.footer.node);
    } else {
      console.log('Unknown page');
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
}
