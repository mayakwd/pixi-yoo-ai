import {Container, Rectangle, Text, TextStyle} from "pixi.js";
import {Component, HorizontalAlign, theme, VerticalAlign} from "../..";

export class Label extends Component {

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    if (this._text === value) {
      return;
    }
    this._text = value;
    this.invalidate("text");
  }

  public get textStyle(): TextStyle {
    return this._textStyle;
  }

  public set textStyle(value: TextStyle) {
    if (this._textStyle === value) {
      return;
    }
    this._textStyle = value;
    this.invalidate("state");
  }

  public get marginLeft(): number {
    return this._margins.left;
  }

  public set marginLeft(value: number) {
    if (this._margins.left === value) {
      return;
    }
    this._margins.left = value;
    this.invalidate("size");
  }

  public get marginRight(): number {
    return this._margins.right;
  }

  public set marginRight(value: number) {
    if (this._margins.right === value) {
      return;
    }
    this._margins.right = value;
    this.invalidate("size");
  }

  public get marginTop(): number {
    return this._margins.top;
  }

  public set marginTop(value: number) {
    if (this._margins.top === value) {
      return;
    }
    this._margins.top = value;
    this.invalidate("size");
  }

  public get marginBottom(): number {
    return this._margins.bottom;
  }

  public set marginBottom(value: number) {
    if (this._margins.bottom === value) {
      return;
    }
    this._margins.bottom = value;
    this.invalidate("size");
  }

  public get vAlign(): VerticalAlign {
    return this._vAlign;
  }

  public set vAlign(value: VerticalAlign) {
    if (this._vAlign === value) {
      return;
    }
    this._vAlign = value;
    this.invalidate("size");
  }

  public get hAlign(): HorizontalAlign {
    return this._hAlign;
  }

  public set hAlign(value: HorizontalAlign) {
    if (this._hAlign === value) {
      return;
    }
    this._hAlign = value;
    this.invalidate("size");
  }

  public get contentWidth(): number {
    return this._textField.width;
  }

  public get contentHeight(): number {
    return this._textField.height;
  }

  protected _textField!: Text;
  protected _textStyle: TextStyle = theme.defaultTextStyle;
  protected _disabledTextStyle?: TextStyle = theme.defaultTextStyle;

  protected _hAlign: HorizontalAlign = "left";
  protected _vAlign: VerticalAlign = "center";
  protected _margins: Rectangle = new Rectangle();

  protected _text: string = "";

  public constructor(parent?: Container, x: number = 0, y: number = 0, text: string = "") {
    super(parent, x, y);

    this.text = text;

    this._width = 100;
    this._height = 24;
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
    this._textField.text = this._text;
    this._textField.style = !this._enabled && this._disabledTextStyle ? this._disabledTextStyle : this._textStyle;
  }

  protected drawLayout() {
    const textWidth = this._textField.width;
    const textHeight = this._textField.height;

    switch (this._vAlign) {
      case "top":
        this._textField.y = this.marginTop;
        break;
      case "center":
        this._textField.y = (this._height - textHeight) * 0.5;
        break;
      case "bottom":
        this._textField.y = this._height - textHeight - this.marginBottom;
        break;
    }

    switch (this._hAlign) {
      case "left":
        this._textField.x = this.marginLeft;
        break;
      case "center":
        this._textField.x = (this._width - this._textField.width) * 0.5;
        break;
      case "right":
        this._textField.x = this._width - textWidth - this.marginRight;
        break;
    }
  }
}
