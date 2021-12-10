import { Container } from '@pixi/display';
import { Rectangle } from '@pixi/math';
import { invalidate } from '../..';
import { Pane } from './Pane';

export abstract class BaseScrollPane extends Pane {
  public get contentPadding(): number {
    return this._contentPadding;
  }

  @invalidate('size')
  public set contentPadding(value: number) {
    this._contentPadding = value;
  }

  public get contentHeight(): number {
    return this._contentHeight;
  }

  @invalidate('size')
  public set contentHeight(value: number) {
    this._contentHeight = value;
  }

  public get contentWidth(): number {
    return this._contentWidth;
  }

  @invalidate('size')
  public set contentWidth(value: number) {
    this._contentWidth = value;
  }

  public get verticalScrollPosition(): number {
    return this._verticalScrollPosition;
  }

  @invalidate('scroll')
  public set verticalScrollPosition(value: number) {
    this._verticalScrollPosition = Math.min(Math.max(0, value), this.maxVerticalScrollPosition);
    this.validateNow();
  }

  public get maxVerticalScrollPosition(): number {
    return this._maxVerticalScrollPosition;
  }

  @invalidate('scroll')
  public set maxVerticalScrollPosition(value: number) {
    this._maxVerticalScrollPosition = value;
    this.validateNow();
  }

  public get maxHorizontalScrollPosition(): number {
    return this._maxHorizontalScrollPosition;
  }

  @invalidate('scroll')
  public set maxHorizontalScrollPosition(value: number) {
    this._maxHorizontalScrollPosition = Math.min(Math.max(0, value), this.maxHorizontalScrollPosition);
    this.validateNow();
  }

  public get horizontalScrollPosition(): number {
    return this._horizontalScrollPosition;
  }

  @invalidate('scroll')
  public set horizontalScrollPosition(value: number) {
    this._horizontalScrollPosition = value;
    this.validateNow();
  }

  protected _contentScrollRect: Rectangle = new Rectangle();
  protected _contentWidth: number = 0;
  protected _contentHeight: number = 0;
  protected _contentPadding: number = 0;
  protected _maxHorizontalScrollPosition: number = 0;
  protected _horizontalScrollPosition: number = 0;
  protected _maxVerticalScrollPosition: number = 0;
  protected _verticalScrollPosition: number = 0;

  protected constructor(parent?: Container, x?: number, y?: number, width: number = 100, height: number = 100) {
    super(parent, x, y, width, height);
  }

  protected configure() {
    super.configure();

    this._contentScrollRect = new Rectangle(0, 0, 100, 100);
  }

  protected setContentSize(width: number, height: number): void {
    if (width === this._contentWidth && height === this._contentHeight) {
      return;
    }

    this._contentWidth = width;
    this._contentHeight = height;
    this.invalidate('size');
  }
}
