import Page from '../../../../helpers/page';

export default class PaginationLi extends Page {
  private value: string | null;

  private button: HTMLButtonElement | null = null;

  private isActive: boolean;

  private handler;

  constructor(
    parentNode: HTMLElement,
    value: string | null,
    isActive: boolean,
    handler: (page: number) => void
  ) {
    super('li', ['pagination__li'], parentNode, '', {});
    this.value = value;
    this.isActive = isActive;
    this.handler = handler;
    this.init();
  }

  init() {
    if (this.value !== null) {
      if (this.value === '<') {
        this.button = PaginationLi.createButton(this.value);
      } else if (this.value === '>') {
        this.button = PaginationLi.createButton(this.value);
      } else {
        this.button = PaginationLi.createButton(this.value);
        this.button.addEventListener('click', () => {
          this.handler(Number(this.value));
        });
      }
      this.node.append(this.button);
    } else {
      this.node.textContent = '...';
    }
    if (this.isActive && this.button) {
      this.button.classList.add('pagination__button_active');
    }
  }

  private static createButton(value: string) {
    const button = document.createElement('button');
    button.classList.add('pagination__button');
    button.textContent = value;
    return button;
  }
}
