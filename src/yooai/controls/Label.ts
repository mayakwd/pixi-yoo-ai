import {Container, Point, Text, TextStyle} from "pixi.js";
import {Component, HorizontalAlign, invalidate, IPoint, theme, VerticalAlign} from "../..";

export class Label extends Component {
  public get wordWrap(): boolean {
    return this._wordWrap;
  }

  @invalidate("text")
  public set wordWrap(value: boolean) {
    this._wordWrap = value;
  }

  public get text(): string {
    return this._text;
  }

  @invalidate("text")
  public set text(value: string) {
    this._text = value;
  }

  public get textStyle(): TextStyle {
    return this._textStyle;
  }

  @invalidate("state")
  public set textStyle(value: TextStyle) {
    this._textStyle = value;
  }

  public get offsetX(): number {
    return this._offset.x;
  }

  @invalidate("size")
  public set offsetX(value: number) {
    this._offset.x = value;
  }

  public get offsetY(): number {
    return this._offset.y;
  }

  @invalidate("size")
  public set offsetY(value: number) {
    this._offset.y = value;
  }

  public get vAlign(): VerticalAlign {
    return this._vAlign;
  }

  @invalidate("size")
  public set vAlign(value: VerticalAlign) {
    this._vAlign = value;
  }

  public get hAlign(): HorizontalAlign {
    return this._hAlign;
  }

  @invalidate("size")
  public set hAlign(value: HorizontalAlign) {
    this._hAlign = value;
  }

  public get contentWidth(): number {
    if (!this._textField.text) { return 0; }
    return this._textField.width;
  }

  public get contentHeight(): number {
    if (!this._textField.text) { return 0; }
    return this._textField.height;
  }

  protected _textField!: Text;
  protected _textStyle: TextStyle = theme.defaultTextStyle;
  protected _disabledTextStyle?: TextStyle = theme.defaultTextStyle;

  protected _hAlign: HorizontalAlign = "left";
  protected _vAlign: VerticalAlign = "center";
  protected _offset: Point = new Point();

  protected _text: string = "";
  protected _wordWrap: boolean = false;

  public constructor(parent?: Container, x: number = 0, y: number = 0, text: string = "") {
    super(parent, x, y);

    this.text = text;

    this._componentWidth = 100;
    this._componentHeight = 24;
  }

  public setOffset(x: number | IPoint, y?: number): void {
    if (typeof x === "object") {
      const point = x as IPoint;
      if (point.x !== undefined && point.y !== undefined) {
        this._offset.set(point.x, point.y);
      }
    } else if (y !== undefined) {
      this._offset.x = x;
      this._offset.y = y;
    }
    this.invalidate("size");
  }

  protected configure() {
    this._textField = new Text(this._text, this._textStyle);
    this.addChild(this._textField);
  }

  protected draw(): void {
    if (this.isInvalid("text") || this.isInvalid("state")) {
      this.drawText();
      this.invalidate("size");
    }
    if (this.isInvalid("size")) {
      this.drawLayout();
    }
    super.draw();
  }

  protected drawText() {
    const textStyle = !this._enabled && this._disabledTextStyle ? this._disabledTextStyle : this._textStyle;
    this._textField.style = Object.assign({}, textStyle, this._wordWrap ? {
      wordWrap: true,
      wordWrapWidth: this._componentWidth,
    } : undefined);
    this._textField.text = this._text;
    this._textField.updateText(true);
  }

  protected drawLayout() {
    this.alignChild(this._textField, this._vAlign, this._hAlign, this._offset);
  }
}
