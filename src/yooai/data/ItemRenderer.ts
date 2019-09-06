import {TextStyle} from "pixi.js";
import {HorizontalAlign, Label, VerticalAlign} from "../..";
import {InteractiveComponent} from "../controls/InteractiveComponent";

export class ItemRenderer<T extends IItemRendererData> extends InteractiveComponent {
  public index: number = -1;

  protected _label!: Label;
  protected _labelEmitter?: (data?: T) => string;
  protected _data?: T;

  protected constructor() {
    super();
  }

  public get data(): T | undefined {
    return this._data;
  }

  public set data(value: T | undefined) {
    this._data = value;
  }

  public get labelEmitter(): ((data?: T) => string) | undefined {
    return this._labelEmitter;
  }

  public set labelEmitter(value: ((data?: T) => string) | undefined) {
    this._labelEmitter = value;
  }

  public get textStyle(): TextStyle {
    return this._label.textStyle;
  }

  public set textStyle(value: TextStyle) {
    this._label.textStyle = value;
  }

  public get marginLeft(): number {
    return this._label.marginLeft;
  }

  public set marginLeft(value: number) {
    this._label.marginLeft = value;
  }

  public get marginRight(): number {
    return this._label.marginRight;
  }

  public set marginRight(value: number) {
    this._label.marginRight = value;
  }

  public get marginTop(): number {
    return this._label.marginTop;
  }

  public set marginTop(value: number) {
    this._label.marginTop = value;
  }

  public get marginBottom(): number {
    return this._label.marginBottom;
  }

  public set marginBottom(value: number) {
    this._label.marginBottom = value;
  }

  public get vAlign(): VerticalAlign {
    return this._label.vAlign;
  }

  public set vAlign(value: VerticalAlign) {
    this._label.vAlign = value;
  }

  public get hAlign(): HorizontalAlign {
    return this._label.hAlign;
  }

  public set hAlign(value: HorizontalAlign) {
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
      labelText = this._data ? this._data.toString() : "";
    }
    this._label.text = labelText;
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

export interface IItemRendererData { disabled?: boolean; }
