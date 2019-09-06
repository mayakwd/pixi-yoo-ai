import {Container} from "pixi.js";
import {Component} from "../..";

export class Pane extends Component {

  public get skin(): Container | undefined {
    return this._skin;
  }

  public set skin(value: Container | undefined) {
    if (this._skin === value) {
      return;
    }
    this._skin = value;
    this.invalidate("skin");
  }
  protected _skin?: Container;
  protected _background?: Container;

  public constructor(parent?: Container, x: number = 0, y: number = 0, width: number = 100, height: number = 100) {
    super(parent, x, y);

    this._width = width;
    this._height = height;
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
    if (this._background !== undefined && this._background.parent === this) {
      this.removeChild(this._background);
    }
    this._background = this._skin;
    if (this._background) {
      this.addChildAt(this._background, 0);
    }
  }

  protected drawLayout() {
    if (this._background) {
      this._background.width = this._width;
      this._background.height = this._height;
    }
  }
}
