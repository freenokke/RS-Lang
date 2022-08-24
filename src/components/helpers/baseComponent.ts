export default class BaseComponent {
  private parentNode: HTMLElement | null;

  public node: HTMLElement;

  private template: string;

  private model: Record<string, string>;

  constructor(
    tagName: string,
    classNames: string[],
    parentNode: HTMLElement | null,
    template: string,
    model: Record<string, string>
  ) {
    this.parentNode = parentNode;
    this.node = document.createElement(tagName);
    this.template = template;
    this.model = model;
    this.buildTemplate();
    this.node.innerHTML = this.template;
    this.node.classList.add(...classNames);
    if (this.parentNode !== null) {
      this.parentNode.append(this.node);
    }
  }

  private buildTemplate() {
    Object.entries(this.model).forEach(([key, value]) => {
      this.template = this.template.replaceAll(`{{${key}}}`, value);
    });
  }
}
