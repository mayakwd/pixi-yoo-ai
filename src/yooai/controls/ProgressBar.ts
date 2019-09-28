import {Container, TextStyle} from "pixi.js";
import {Component, Direction, HorizontalAlign, invalidate, VerticalAlign} from "../..";
import {Label} from "./Label";

export class ProgressBar extends Component {
  public get textStyle(): TextStyle {
    return this._label.textStyle;
  }

  public set textStyle(value: TextStyle) {
    this._label.textStyle = value;
  }

  public get labelOffsetX(): number {
    return this._label.offsetX;
  }

  public set labelOffsetX(value: number) {
    this._label.offsetX = value;
  }

  public get labelOffsetY(): number {
    return this._label.offsetY;
  }

  public set labelOffsetY(value: number) {
    this._label.offsetY = value;
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
    if (this._maximum <= this._minimum) { return 0; }
    let value = this._value;
    if (value > this._maximum) { value = this._maximum; }
    if (value < this._minimum) { value = this._minimum; }
    return 1 / (this._maximum - this._minimum) * value;
  }

  public get value(): number {
    return this._value;
  }

  @invalidate("state")
  public set value(value: number) {
    this._value = value;
  }

  public get maximum(): number {
    return this._maximum;
  }

  @invalidate("state")
  public set maximum(value: number) {
    this._maximum = value;
  }

  public get minimum(): number {
    return this._minimum;
  }

  @invalidate("state")
  public set minimum(value: number) {
    this._minimum = value;
  }

  public get direction(): Direction {
    return this._direction;
  }

  @invalidate("state")
  public set direction(value: Direction) {
    this._direction = value;
  }

  public get barPadding(): number {
    return this._barPadding;
  }

  @invalidate("state")
  public set barPadding(value: number) {
    this._barPadding = value;
  }

  public get trackSkin(): Container | undefined {
    return this._trackSkin;
  }

  @invalidate("skin")
  public set trackSkin(value: Container | undefined) {
    this._trackSkin = value;
  }

  public get barSkin(): Container | undefined {
    return this._barSkin;
  }

  @invalidate("skin")
  public set barSkin(value: Container | undefined) {
    this._barSkin = value;
  }

  public get displayText(): boolean {
    return this._displayText;
  }

  @invalidate("state")
  public set displayText(value: boolean) {
    this._displayText = value;
  }

  public get text(): string | undefined {
    return this._text;
  }

  @invalidate("text")
  public set text(value: string | undefined) {
    this._text = value;
  }

  public get displayTextEmitter(): ProgressTextEmitter | undefined {
    return this._displayTextEmitter;
  }

  @invalidate("text")
  public set displayTextEmitter(value: ProgressTextEmitter | undefined) {
    this._displayTextEmitter = value;
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

  public setValues(minimum: number, maximum: number, value: number): void {
    this.minimum = minimum;
    this.maximum = maximum;
    this.value = value;
  }

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

      this._track.width = (this._width - this._barPadding * 2) * horizontalMultiplier;
      this._track.height = (this._height - this._barPadding * 2) * verticalMultiplier;

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
