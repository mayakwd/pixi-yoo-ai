import {Container} from "pixi.js";
import {HorizontalLayoutBehavior} from "../..";
import {AbstractBox} from "./AbstractBox";

export class HBox extends AbstractBox {

  public get contentWidth(): number {
    return this._contentWidth;
  }

  public get contentHeight(): number {
    return this._contentHeight;
  }
  private _contentWidth: number = 0;
  private _contentHeight: number = 0;

  public constructor(parent?: Container, x: number = 0, y: number = 0) {
    super(new HorizontalLayoutBehavior(), parent, x, y);

    this._height = HBox.INITIAL_HEIGHT;
  }

  protected drawLayout(): void {
    super.drawLayout();
    this.calculateContentSize();

    this._width = this._contentWidth + this.marginLeft + this.marginRight;
  }

  private calculateContentSize() {
    const childrenCount = this.children.length;

    this._contentHeight = 0;
    this._contentWidth = 0;

    let index = childrenCount - 1;
    let contentWidthIsSet = false;

    while (index >= 0) {
      const child = this.children[index];
      if (child instanceof Container) {
        if (!contentWidthIsSet) {
          this._contentWidth = child.x + child.width - this.marginLeft;
          contentWidthIsSet = true;
        }
        if (this._contentHeight < child.height) {
          this._contentHeight = child.height;
        }
      }
      index--;
    }
  }
}
