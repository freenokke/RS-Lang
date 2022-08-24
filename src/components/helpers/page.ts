import BaseComponent from './baseComponent';

export default class Page extends BaseComponent {
  private tagName;

  constructor(
    tagName: string,
    classNames: string[],
    parentNode: HTMLElement | null,
    template: string,
    model: Record<string, string>
  ) {
    super(tagName, classNames, parentNode, template, model);
    this.tagName = tagName;
  }
}
