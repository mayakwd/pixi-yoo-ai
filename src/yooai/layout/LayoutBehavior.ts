import {Container, Point, Rectangle} from "pixi.js";
import {HorizontalAlign} from "./HorizontalAlign";
import {VerticalAlign} from "./VerticalAlign";

export abstract class LayoutBehavior {
  public vAlign: VerticalAlign = "center";
  public hAlign: HorizontalAlign = "left";

  protected _margins: Rectangle = new Rectangle();
  protected _gaps: Point = new Point();

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
    this._margins.left = value;
  }

  public get marginRight(): number {
    return this._margins.right;
  }

  public set marginRight(value: number) {
    this._margins.right = value;
  }

  public get marginTop(): number {
    return this._margins.top;
  }

  public set marginTop(value: number) {
    this._margins.top = value;
  }

  public get marginBottom(): number {
    return this._margins.bottom;
  }

  public set marginBottom(value: number) {
    this._margins.bottom = value;
  }

  public abstract apply(target: Container, width: number, height: number): void;

}
