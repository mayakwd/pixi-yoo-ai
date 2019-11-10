import {TextStyle} from "pixi.js";
import {HorizontalAlign, InteractiveComponent, invalidate, Label, VerticalAlign} from "../..";

export class ItemRenderer<T> extends InteractiveComponent {
  public index: number = -1;

  protected _label!: Label;
  protected _labelEmitter?: (data?: T) => string;
  protected _data?: T;

  public constructor() {
    super();
  }

  public get data(): T | undefined {
    return this._data;
  }

  @invalidate("data")
  public set data(value: T | undefined) {
    this._data = value;
  }

  public get labelEmitter(): ((data?: T) => string) | undefined {
    return this._labelEmitter;
  }

  @invalidate("data")
  public set labelEmitter(value: ((data?: T) => string) | undefined) {
    this._labelEmitter = value;
  }

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

  protected configure() {
    super.configure();

    this._label = new Label(this);
    this._label.vAlign = "center";
    this._label.hAlign = "center";
  }

  protected drawData() {
    let labelText: string;
    if (this._labelEmitter !== undefined) {
      labelText = this._labelEmitter(this._data);
    } else {
      labelText = this._data ? String(this._data) : "";
    }
    this._label.text = labelText;
    this._label.drawNow();
  }

  protected draw(): void {
    if (this.isInvalid("data")) {
      this.drawData();
    }
    if (this.isInvalid("state")) {
      this.drawBackground();
      this.invalidate("size");
    }
    super.draw();
  }

  protected drawLayout() {
    this._label.resize(this._width, this._height);
    super.drawLayout();
  }
}
