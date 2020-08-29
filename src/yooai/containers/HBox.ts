import {Container} from "pixi.js";
import {HorizontalLayoutBehavior} from "../..";
import {getHeight, getWidth} from "../layout/utils";
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

    this._componentHeight = HBox.INITIAL_HEIGHT;
  }

  protected drawLayout(): void {
    super.drawLayout();
    this.calculateContentSize();

    this._componentWidth = this._contentWidth + this.marginLeft + this.marginRight;
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
        const childWidth = getWidth(child);
        const childHeight = getHeight(child);
        if (!contentWidthIsSet) {
          this._contentWidth = child.x + childWidth - this.marginLeft;
          contentWidthIsSet = true;
        }
        if (this._contentHeight < childHeight) {
          this._contentHeight = childHeight;
        }
      }
      index--;
    }
  }
}
