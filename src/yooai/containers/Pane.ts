import {Container} from "pixi.js";
import {Component, invalidate} from "../..";

export class Pane extends Component {

  public get skin(): Container | undefined {
    return this._skin;
  }

  @invalidate("skin")
  public set skin(value: Container | undefined) {
    this._skin = value;
  }

  protected _skin?: Container;
  protected _background?: Container;

  public constructor(parent?: Container, x: number = 0, y: number = 0, width: number = 100, height: number = 100) {
    super(parent, x, y);

    this._componentWidth = width;
    this._componentHeight = height;
  }

  protected draw(): void {
    if (this.isInvalid("skin")) {
      this.drawBackground();
      this.invalidate("size");
    }
    if (this.isInvalid("size")) {
      this.drawLayout();
    }
    super.draw();
  }

  protected drawBackground() {
    this._background = this.updateSkin(this._background, this._skin, 0);
  }

  protected drawLayout() {
    if (this._background) {
      this._background.width = this._componentWidth;
      this._background.height = this._componentHeight;
    }
  }
}
