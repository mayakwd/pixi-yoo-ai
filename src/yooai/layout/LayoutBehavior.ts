import { Container } from '@pixi/display';
import { Point, Rectangle } from '@pixi/math';
import { HorizontalAlign } from './HorizontalAlign';
import { VerticalAlign } from './VerticalAlign';

export abstract class LayoutBehavior {
  public get verticalGap(): number {
    return this._gaps.y;
  }

  public set verticalGap(value: number) {
    this._gaps.y = value;
  }

  public get horizontalGap(): number {
    return this._gaps.x;
  }

  public set horizontalGap(value: number) {
    this._gaps.x = value;
  }

  public get marginLeft(): number {
    return this._margins.left;
  }

  public set marginLeft(value: number) {
    this._margins.x = value;
  }

  public get marginRight(): number {
    return this._margins.right;
  }

  public set marginRight(value: number) {
    this._margins.x = value - this._margins.width;
  }

  public get marginTop(): number {
    return this._margins.top;
  }

  public set marginTop(value: number) {
    this._margins.y = value;
  }

  public get marginBottom(): number {
    return this._margins.bottom;
  }

  public set marginBottom(value: number) {
    this._margins.y = value - this._margins.height;
  }

  public vAlign: VerticalAlign = 'center';
  public hAlign: HorizontalAlign = 'left';

  protected _margins: Rectangle = new Rectangle();
  protected _gaps: Point = new Point();

  public abstract apply(target: Container, width: number, height: number): void;
}
