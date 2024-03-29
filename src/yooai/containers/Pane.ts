import { Container } from '@pixi/display';
import { Component, invalidate } from '../..';

export class Pane extends Component {
  public get skin(): Container | undefined {
    return this._skin;
  }

  @invalidate('skin')
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
    if (this.isInvalid('skin')) {
      this.drawBackground();
    }
    if (this.isInvalid('size')) {
      this.drawLayout();
    }
    super.draw();
  }

  protected drawBackground() {
    const oldValue = this._background;
    this._background = this.updateSkin(this._background, this._skin, 0);
    if (oldValue !== this._background) {
      this.invalidate('size');
    }
  }

  protected drawLayout() {
    if (this._background) {
      this._background.width = this.componentWidth;
      this._background.height = this.componentHeight;
    }
  }
}
