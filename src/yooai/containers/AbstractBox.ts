import {Container} from "pixi.js";
import {HorizontalAlign, LayoutBehavior, VerticalAlign} from "../..";
import {Pane} from "./Pane";

export abstract class AbstractBox extends Pane {

  public get marginLeft(): number {
    return this.layoutBehavior.marginLeft;
  }

  public set marginLeft(value: number) {
    this.layoutBehavior.marginLeft = value;
  }

  public get marginRight(): number {
    return this.layoutBehavior.marginRight;
  }

  public set marginRight(value: number) {
    this.layoutBehavior.marginRight = value;
  }

  public get marginTop(): number {
    return this.layoutBehavior.marginTop;
  }

  public set marginTop(value: number) {
    this.layoutBehavior.marginTop = value;
  }

  public get marginBottom(): number {
    return this.layoutBehavior.marginBottom;
  }

  public set marginBottom(value: number) {
    this.layoutBehavior.marginBottom = value;
  }

  public get verticalGap(): number {
    return this.layoutBehavior.verticalGap;
  }

  public set verticalGap(value: number) {
    this.layoutBehavior.verticalGap = value;
  }

  public get horizontalGap(): number {
    return this.layoutBehavior.horizontalGap;
  }

  public set horizontalGap(value: number) {
    this.layoutBehavior.horizontalGap = value;
  }

  public get vAlign(): VerticalAlign {
    return this.layoutBehavior.vAlign;
  }

  public set vAlign(value: VerticalAlign) {
    this.layoutBehavior.vAlign = value;
  }

  public get hAlign(): HorizontalAlign {
    return this.layoutBehavior.hAlign;
  }

  public set hAlign(value: HorizontalAlign) {
    this.layoutBehavior.hAlign = value;
  }

  public abstract get contentHeight(): number;

  public abstract get contentWidth(): number;

  protected constructor(
    private readonly layoutBehavior: LayoutBehavior,
    parent?: Container,
    x: number = 0,
    y: number = 0,
  ) {
    super(parent, x, y);
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
    this.invalidate("size");
  }

  protected draw(): void {
    if (this.isInvalid("size")) {
      this.drawLayout();
    }
    super.draw();
  }

  protected drawLayout(): void {
    if (this.layoutBehavior) {
      this.layoutBehavior.apply(this, this._componentWidth, this._componentHeight);
    }
  }
}
