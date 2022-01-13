import { Container, DisplayObject } from '@pixi/display';
import { HorizontalAlign, invalidate, LayoutBehavior, VerticalAlign } from '../..';
import { isComponent } from '../layout/utils';
import { Pane } from './Pane';

export abstract class AbstractBox extends Pane {
  public get marginLeft(): number {
    return this.layoutBehavior.marginLeft;
  }

  @invalidate('size')
  public set marginLeft(value: number) {
    this.layoutBehavior.marginLeft = value;
  }

  public get marginRight(): number {
    return this.layoutBehavior.marginRight;
  }

  @invalidate('size')
  public set marginRight(value: number) {
    this.layoutBehavior.marginRight = value;
  }

  public get marginTop(): number {
    return this.layoutBehavior.marginTop;
  }

  @invalidate('size')
  public set marginTop(value: number) {
    this.layoutBehavior.marginTop = value;
  }

  public get marginBottom(): number {
    return this.layoutBehavior.marginBottom;
  }

  @invalidate('size')
  public set marginBottom(value: number) {
    this.layoutBehavior.marginBottom = value;
  }

  public get verticalGap(): number {
    return this.layoutBehavior.verticalGap;
  }

  @invalidate('size')
  public set verticalGap(value: number) {
    this.layoutBehavior.verticalGap = value;
  }

  public get horizontalGap(): number {
    return this.layoutBehavior.horizontalGap;
  }

  @invalidate('size')
  public set horizontalGap(value: number) {
    this.layoutBehavior.horizontalGap = value;
  }

  public get vAlign(): VerticalAlign {
    return this.layoutBehavior.vAlign;
  }

  @invalidate('size')
  public set vAlign(value: VerticalAlign) {
    this.layoutBehavior.vAlign = value;
  }

  public get hAlign(): HorizontalAlign {
    return this.layoutBehavior.hAlign;
  }

  @invalidate('size')
  public set hAlign(value: HorizontalAlign) {
    this.layoutBehavior.hAlign = value;
  }

  public get contentWidth(): number {
    return this._contentWidth;
  }

  public get contentHeight(): number {
    return this._contentHeight;
  }

  protected _contentWidth: number = 0;
  protected _contentHeight: number = 0;

  protected constructor(
    private readonly layoutBehavior: LayoutBehavior,
    parent?: Container,
    x: number = 0,
    y: number = 0
  ) {
    super(parent, x, y);
  }

  public addChild<T extends DisplayObject[]>(...children: T): T[0] {
    children.forEach((child) => {
      if (isComponent(child)) {
        child.on('resize', this.invalidateSize, this);
      }
    });
    const [firstChild, ...rest] = children;
    return super.addChild(firstChild, ...rest);
  }

  public addChildAt<T extends DisplayObject>(child: T, index: number): T {
    if (isComponent(child)) {
      child.on('resize', this.invalidateSize, this);
    }
    return super.addChildAt(child, index);
  }

  public removeChild<TChildren extends DisplayObject[]>(...children: TChildren): TChildren[0] {
    children.forEach((child) => {
      if (isComponent(child)) {
        child.off('resize', this.invalidateSize, this);
      }
    });
    return super.removeChild(...children);
  }

  public removeChildAt(index: number): DisplayObject {
    const child = super.removeChildAt(index);
    if (isComponent(child)) {
      child.on('resize', this.invalidateSize, this);
    }
    return child;
  }

  public removeChildren(beginIndex?: number, endIndex?: number): DisplayObject[] {
    const children = super.removeChildren(beginIndex, endIndex);
    children.forEach((child) => {
      if (isComponent(child)) {
        child.on('resize', this.invalidateSize, this);
      }
    });
    return children;
  }

  public swapChildrenAt(index1: number, index2: number): void {
    const child1 = this.getChildAt(index1);
    const child2 = this.getChildAt(index2);
    super.swapChildren(child1, child2);
  }

  protected onChildrenChange(): void {
    if (this.isDestroyed) {
      return;
    }
    this.invalidate('size');
  }

  protected draw(): void {
    if (this.isInvalid('size')) {
      this.drawLayout();
    }
    super.draw();
  }

  protected drawLayout(): void {
    if (this.layoutBehavior) {
      this.layoutBehavior.apply(this, this._contentWidth, this._contentHeight);
    }
  }

  private invalidateSize(): void {
    this.invalidate('size');
  }
}
