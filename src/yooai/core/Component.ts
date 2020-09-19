import {Container, DisplayObject, Filter, Rectangle} from "pixi.js";
import {alignChild, HorizontalAlign, IHasDimensions, IPoint, VerticalAlign} from "../..";
import {AbstractComponent} from "./AbstractComponent";
import {IDestroyable} from "./IDestroyable";
import {invalidate} from "./invalidate";

export class Component extends AbstractComponent implements IDestroyable {
  public get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public get disabledFilters(): Filter[] | undefined {
    return this._disabledFilters;
  }

  @invalidate("state")
  public set disabledFilters(value: Filter[] | undefined) {
    if (this._disabledFilters !== value) { this.removeDisabledFilters(); }
    this._disabledFilters = value;
    this.applyDisabledFilters();
  }

  public get componentWidth(): number {
    return this._componentWidth;
  }

  @invalidate("size")
  public set componentWidth(width: number) {
    this._componentWidth = width;
  }

  public get componentHeight(): number {
    return this._componentHeight;
  }

  @invalidate("size")
  public set componentHeight(height: number) {
    this._componentHeight = height;
  }

  public get centerX(): number {
    return this.x + this._componentWidth * 0.5;
  }

  public get centerY(): number {
    return this.y + this._componentWidth * 0.5;
  }

  public set left(value: number) {
    this.x = value;
  }

  public get left(): number {
    return this.x;
  }

  public set top(value: number) {
    this.y = value;
  }

  public get top(): number {
    return this.y;
  }

  public set right(value: number) {
    this.x = value - this._componentWidth;
  }

  public get right(): number {
    return this.x + this._componentWidth;
  }

  public set bottom(value: number) {
    this.y = value - this._componentHeight;
  }

  public get bottom(): number {
    return this.y + this._componentHeight;
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  @invalidate("state")
  public set enabled(enabled: boolean) {
    this._enabled = enabled;
    if (this._enabled) {
      this.removeDisabledFilters();
    } else {
      this.applyDisabledFilters();
    }
  }

  protected static readonly INITIAL_HEIGHT = 100;
  protected static readonly INITIAL_WIDTH = 100;

  protected _isDestroyed: boolean = false;
  protected _componentWidth: number = 0;
  protected _componentHeight: number = 0;
  protected _enabled: boolean = true;
  protected _hitArea: Rectangle = new Rectangle(0, 0, this._componentWidth, this._componentHeight);
  protected _disabledFilters?: Filter[];

  public constructor(parent?: Container, x: number = 0, y: number = 0) {
    super();

    this.x = x;
    this.y = y;

    this.configure();
    this.invalidate("all");
    if (parent) {
      parent.addChild(this);
    }
  }

  public contains(displayObject: DisplayObject | undefined): boolean {
    if (displayObject === undefined) {
      return false;
    }
    if (displayObject === this) {
      return true;
    }
    let parent = displayObject.parent;
    while (parent !== undefined) {
      if (parent === this) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  public resize(width: number, height: number): void {
    this._componentWidth = width;
    this._componentHeight = height;

    this.invalidate("size");
    this.emit("resize");
  }

  public moveTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public destroy(): void {
    if (this._isDestroyed) {
      return;
    }
    super.destroy({children: true});
  }

  protected configure() {
    // Block intended to be empty
  }

  protected draw(): void {
    // Block intended to be empty
  }

  protected afterDraw() {
    this.updateHitArea();
  }

  protected updateSkin<T extends DisplayObject>(currentValue?: T, newValue?: T, childIndex?: number): T | undefined {
    if (currentValue !== newValue) {
      if (currentValue !== undefined && currentValue.parent === this) {
        this.removeChild(currentValue);
      }
      if (newValue !== undefined) {
        if (childIndex !== undefined) {
          this.addChildAt(newValue, childIndex);
        } else {
          this.addChild(newValue);
        }
      }
      return newValue;
    } else {
      return currentValue;
    }
  }

  protected vAlignChild(child: IHasDimensions, vAlign: VerticalAlign, offset?: IPoint) {
    alignChild(child, this, vAlign, undefined, offset, child as IPoint);
  }

  protected hAlignChild(child: IHasDimensions, hAlign: HorizontalAlign, offset?: IPoint) {
    alignChild(child, this, undefined, hAlign, offset, child as IPoint);
  }

  protected alignChild(child: IHasDimensions, vAlign?: VerticalAlign, hAlign?: HorizontalAlign, offset?: IPoint) {
    alignChild(child, this, vAlign, hAlign, offset, child as IPoint);
  }

  protected updateHitArea() {
    this._hitArea.width = this._componentWidth;
    this._hitArea.height = this._componentHeight;
  }

  protected removeDisabledFilters() {
    if (this._disabledFilters !== undefined && this._enabled) {
      this.filters = this.filters?.filter((filter) => this._disabledFilters!.indexOf(filter) === -1);
    }
  }

  protected applyDisabledFilters() {
    if (!this._enabled && this._disabledFilters !== undefined) {
      this.filters = this._disabledFilters.concat(this.filters ?? []);
    }
  }
}
