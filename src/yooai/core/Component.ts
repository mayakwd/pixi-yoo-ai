import {Container, DisplayObject, Rectangle} from "pixi.js";
import {IDestroyable} from "./IDestroyable";
import {invalidate} from "./invalidate";
import {InvalidationType} from "./InvalidationType";

export class Component extends Container implements IDestroyable {
  public get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public get width(): number {
    return this._width;
  }

  @invalidate("size")
  public set width(width: number) {
    this._width = width;
  }

  public get height(): number {
    return this._height;
  }

  @invalidate("size")
  public set height(height: number) {
    this._height = height;
  }

  public get centerX(): number {
    return this.x + this._width * 0.5;
  }

  public get centerY(): number {
    return this.y + this._width * 0.5;
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
    this.x = value - this._width;
  }

  public get right(): number {
    return this.x + this._width;
  }

  public set bottom(value: number) {
    this.y = value - this._height;
  }

  public get bottom(): number {
    return this.y + this._height;
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  @invalidate("state")
  public set enabled(enabled: boolean) {
    this._enabled = enabled;
  }

  protected static readonly INITIAL_HEIGHT = 100;
  protected static readonly INITIAL_WIDTH = 100;

  protected _isDestroyed: boolean = false;
  protected _width: number = 0;
  protected _height: number = 0;
  protected _enabled: boolean = true;
  protected _invalidationSet: Set<InvalidationType> = new Set();
  protected _hitArea: Rectangle = new Rectangle(0, 0, this._width, this._height);

  public constructor(parent?: Container, x: number = 0, y: number = 0) {
    super();

    this.hitArea = this._hitArea;

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
    this._width = width;
    this._height = height;

    this.invalidate("size");
    this.emit("resize");
  }

  public invalidate(invalidationType: InvalidationType = "all"): void {
    this._invalidationSet.add(invalidationType);
  }

  public isInvalid(invalidationType: InvalidationType = "all"): boolean {
    if (invalidationType === "all") {
      return this._invalidationSet.size > 0;
    }
    return this._invalidationSet.has(invalidationType);
  }

  public destroy(): void {
    if (this._isDestroyed) {
      return;
    }
    super.destroy({children: true});
  }

  public drawNow(): void {
    this.draw();
  }

  public validateNow(): void {
    if (this.isInvalid()) {
      for (const child of this.children) {
        if (child instanceof Component) {
          child.validateNow();
        }
      }
      this.updateHitArea();
      this.draw();
      this.validate();
    }
  }

  public updateTransform(): void {
    this.validateNow();
    super.updateTransform();
  }

  public render(renderer: PIXI.Renderer): void {
    super.render(renderer);
  }

  protected configure() {
    // Block is intended to be empty
  }

  protected draw(): void {
    // Block is intended to be empty
  }

  protected validate(): void {
    this._invalidationSet.clear();
  }

  protected updateSkin(currentValue?: Container, newValue?: Container, childIndex?: number): Container | undefined {
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

  protected updateHitArea() {
    this._hitArea.width = this._width;
    this._hitArea.height = this._height;
  }
}
