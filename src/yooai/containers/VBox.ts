import {Container} from "pixi.js";
import {VerticalLayoutBehavior} from "../..";
import {AbstractBox} from "./AbstractBox";

export class VBox extends AbstractBox {

  public get contentWidth(): number {
    return this._contentWidth;
  }

  public get contentHeight(): number {
    return this._contentHeight;
  }

  private _contentWidth: number = 0;
  private _contentHeight: number = 0;

  public constructor(parent?: Container, x: number = 0, y: number = 0) {
    super(new VerticalLayoutBehavior(), parent, x, y);

    this._width = VBox.INITIAL_WIDTH;
  }

  protected drawLayout(): void {
    super.drawLayout();
    this.calculateContentSize();
    this._height = this._contentHeight + this.marginTop + this.marginBottom;
  }

  private calculateContentSize() {
    const childrenCount = this.children.length;

    this._contentHeight = 0;
    this._contentWidth = 0;

    let index = childrenCount - 1;
    let isContentHeightSet = false;

    while (index >= 0) {
      const child = this.children[index];
      if (child instanceof Container) {
        if (!isContentHeightSet) {
          this._contentHeight = child.y + child.height - this.marginTop;
          isContentHeightSet = true;
        }
        if (this._contentWidth < child.width) {
          this._contentWidth = child.width;
        }
      }
      index--;
    }
  }
}
