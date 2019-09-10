import {Container, TextStyle} from "pixi.js";
import {Component, Direction, HorizontalAlign, Label, VerticalAlign} from "../..";

export class ProgressBar extends Component {
  public get textStyle(): TextStyle {
    return this._label.textStyle;
  }

  public set textStyle(value: TextStyle) {
    this._label.textStyle = value;
  }

  public get labelMarginLeft(): number {
    return this._label.marginLeft;
  }

  public set labelMarginLeft(value: number) {
    this._label.marginLeft = value;
  }

  public get labelMarginRight(): number {
    return this._label.marginRight;
  }

  public set labelMarginRight(value: number) {
    this._label.marginRight = value;
  }

  public get labelMarginTop(): number {
    return this._label.marginTop;
  }

  public set labelMarginTop(value: number) {
    this._label.marginTop = value;
  }

  public get labelMarginBottom(): number {
    return this._label.marginBottom;
  }

  public set labelMarginBottom(value: number) {
    this._label.marginBottom = value;
  }

  public get labelVAlign(): VerticalAlign {
    return this._label.vAlign;
  }

  public set labelVAlign(value: VerticalAlign) {
    this._label.vAlign = value;
  }

  public get labelHAlign(): HorizontalAlign {
    return this._label.hAlign;
  }

  public set labelHAlign(value: HorizontalAlign) {
    this._label.hAlign = value;
  }

  public get percentComplete(): number {
    return 1 / (this._maximum - this._minimum) * this._value;
  }

  public get value(): number {
    return this._value;
  }

  public set value(value: number) {
    if (this._value === value) {
      return;
    }
    this._value = value;
    this.invalidate("state");
  }

  public get maximum(): number {
    return this._maximum;
  }

  public set maximum(value: number) {
    if (this._maximum === value) {
      return;
    }
    this._maximum = value;
    this.invalidate("state");
  }

  public get minimum(): number {
    return this._minimum;
  }

  public set minimum(value: number) {
    if (this._minimum === value) {
      return;
    }
    this._minimum = value;
    this.invalidate("state");
  }

  public get direction(): Direction {
    return this._direction;
  }

  public set direction(value: Direction) {
    if (this._direction === value) {
      return;
    }
    this._direction = value;
    this.invalidate("state");
  }

  public get barPadding(): number {
    return this._barPadding;
  }

  public set barPadding(value: number) {
    if (this._barPadding === value) {
      return;
    }
    this._barPadding = value;
    this.invalidate("state");
  }

  public get trackSkin(): Container | undefined {
    return this._trackSkin;
  }

  public set trackSkin(value: Container | undefined) {
    if (this._trackSkin === value) {
      return;
    }
    this._trackSkin = value;
    this.invalidate("skin");
  }

  public get barSkin(): Container | undefined {
    return this._barSkin;
  }

  public set barSkin(value: Container | undefined) {
    if (this._barSkin === value) {
      return;
    }
    this._barSkin = value;
    this.invalidate("skin");
  }

  public get displayText(): boolean {
    return this._displayText;
  }

  public set displayText(value: boolean) {
    this._displayText = value;
    this.invalidate("state");
  }

  public get text(): string | undefined {
    return this._text;
  }

  public set text(value: string | undefined) {
    this._text = value;
    this.invalidate("text");
  }

  public get displayTextEmitter(): ProgressTextEmitter | undefined {
    return this._displayTextEmitter;
  }

  public set displayTextEmitter(value: ProgressTextEmitter | undefined) {
    if (this._displayTextEmitter === value) {
      return;
    }
    this._displayTextEmitter = value;
    this.invalidate("text");
  }

  private static DEFAULT_TEXT_EMITTER(minimum: number, maximum: number, value: number) {
    return `${Math.floor(value - minimum)} / ${Math.floor(maximum - minimum)}`;
  }

  protected _label!: Label;

  protected _barSkin?: Container;
  protected _trackSkin?: Container;

  protected _barPadding: number = 0;
  protected _direction: Direction = "right";

  protected _minimum: number = 0;
  protected _maximum: number = 1;
  protected _value: number = 0;
  protected _displayText: boolean = false;
  protected _text?: string;
  protected _displayTextEmitter?: ProgressTextEmitter;

  protected _bar?: Container;
  protected _track?: Container;

  protected configure() {
    this._label = new Label(this);
  }

  protected draw(): void {
    if (this.isInvalid("skin")) {
      this.drawElements();
      this.invalidate("state");
    }
    if (this.isInvalid("state")) {
      this.invalidate("text");
      this.invalidate("size");
    }
    if (this.isInvalid("text")) {
      this.drawText();
    }
    if (this.isInvalid("size")) {
      this.drawLayout();
    }
    super.draw();
  }

  protected drawElements() {
    this._bar = this.updateSkin(this._bar, this._barSkin, 0);
    this._track = this.updateSkin(this._track, this._trackSkin);

    if (this._displayText) {
      this.addChild(this._label);
    } else {
      if (this._label.parent !== undefined) {
        this.removeChild(this._label);
      }
    }
  }

  protected drawLayout() {
    if (this._bar !== undefined) {
      this._bar.width = this._width;
      this._bar.height = this._height;
    }
    if (this._track !== undefined) {
      const toRight = this._direction === "right";
      const toLeft = this._direction === "left";
      const toUp = this._direction === "up";
      const toDown = this._direction === "down";

      const horizontalMultiplier = toLeft || toRight ? this.percentComplete : 1;
      const verticalMultiplier = toUp || toDown ? this.percentComplete : 1;

      this._track.width = (this._width - this._barPadding * 2) * verticalMultiplier;
      this._track.height = (this._height - this._barPadding * 2) * horizontalMultiplier;

      switch (this._direction) {
        case "right":
        case "left":
          this._track.x = toRight ? this._barPadding : this._width - this._track.width - this._barPadding;
          this._track.y = this._barPadding;
          break;
        case "up":
        case "down":
          this._track.y = toDown ? this._barPadding : this._height - this._track.height - this._barPadding;
          this._track.x = this._barPadding;
          break;
      }
    }
    if (this._displayText) {
      this._label.resize(this._width, this._height);
    }
  }

  private drawText() {
    if (!this._displayText) {
      this._label.visible = false;
    } else {
      this._label.visible = true;
      this._label.text = this.getTextValue();
    }
  }

  private getTextValue(): string {
    if (this._displayTextEmitter !== undefined) {
      return this._displayTextEmitter(this._minimum, this._maximum, this._value);
    } else if (this._text !== undefined) {
      return this._text;
    } else {
      return ProgressBar.DEFAULT_TEXT_EMITTER(this._minimum, this._maximum, this._value);
    }
  }
}

export type ProgressTextEmitter = (minimum: number, maximum: number, value: number) => string;
