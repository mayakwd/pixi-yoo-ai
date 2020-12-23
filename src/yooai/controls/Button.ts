import {Container, Point, TextStyle} from "pixi.js";
import {alignChild, HorizontalAlign, invalidate, IPoint, Placement, VerticalAlign} from "../..";
import {getHeight, getWidth} from "../layout/utils";
import {InteractiveComponent} from "./InteractiveComponent";
import {Label} from "./Label";

export class Button extends InteractiveComponent {

  public get text(): string {
    return this._label.text;
  }

  @invalidate("text")
  public set text(value: string) {
    this._label.text = value;
  }

  public get icon(): Container | undefined {
    return this._icon;
  }

  public set icon(value: Container | undefined) {
    if (this._icon === value) {
      return;
    }
    this._icon = value;
    if (this._enabled || this._disabledIcon === undefined) {
      this.invalidate("icon");
    }
  }

  public get disabledIcon(): Container | undefined {
    return this._disabledIcon;
  }

  public set disabledIcon(value: Container | undefined) {
    if (this._disabledIcon === value) {
      return;
    }
    this._disabledIcon = value;
    if (!this._enabled) {
      this.invalidate("icon");
    }
  }

  public get selectedIcon(): Container | undefined {
    return this._selectedIcon;
  }

  public set selectedIcon(value: Container | undefined) {
    if (this._selectedIcon === value) {
      return;
    }
    this._selectedIcon = value;
    if (this._enabled && this._selected) {
      this.invalidate("icon");
    }
  }

  public get textStyle(): TextStyle {
    return this._label.textStyle;
  }

  public set textStyle(value: TextStyle) {
    this._label.textStyle = value;
    this.invalidate("text");
  }

  public get contentOffsetX(): number {
    return this._contentOffset.x;
  }

  @invalidate("size")
  public set contentOffsetX(value: number) {
    this._contentOffset.x = value;
  }

  public get contentOffsetY(): number {
    return this._contentOffset.y;
  }

  @invalidate("size")
  public set contentOffsetY(value: number) {
    this._contentOffset.y = value;
  }

  public get vAlign(): VerticalAlign {
    return this._vAlign;
  }

  @invalidate("size")
  public set vAlign(value: VerticalAlign) {
    this._vAlign = value;
  }

  public get hAlign(): HorizontalAlign {
    return this._hAlign;
  }

  @invalidate("size")
  public set hAlign(value: HorizontalAlign) {
    this._hAlign = value;
  }

  protected _label!: Label;

  protected _icon?: Container;
  protected _selectedIcon?: Container;
  protected _disabledIcon?: Container;
  protected _currentIcon?: Container;

  protected _contentOffset!: Point;
  protected _vAlign: VerticalAlign = "center";
  protected _hAlign: HorizontalAlign = "center";
  protected _iconPlacement: Placement = "left";
  protected _iconGap: number = 4;

  constructor(parent?: Container, x: number = 0, y: number = 0, width: number = 80, height: number = 24) {
    super(parent, x, y, width, height);
  }

  public setContentOffset(x: number | IPoint, y?: number): void {
    if (typeof x === "object") {
      const point = x as IPoint;
      if (point.x !== undefined && point.y !== undefined) {
        this._contentOffset.set(point.x, point.y);
      }
    } else if (y !== undefined) {
      this._contentOffset.x = x;
      this._contentOffset.y = y;
    }
    this.invalidate("size");
  }

  protected configure() {
    super.configure();
    this._contentOffset = new Point();
    this._label = new Label(this);
    this.buttonMode = true;
  }

  protected draw(): void {
    if (this.isInvalid("icon")) {
      this.drawIcon();
      this.invalidate("size");
    }
    if (this.isInvalid("text")) {
      this.drawLabel();
      this.invalidate("size");
    }
    super.draw();
  }

  protected drawLayout() {
    super.drawLayout();

    const {contentWidth, contentHeight} = this.calculateContentSize();
    let {x: xOffset, y: yOffset} = alignChild({
      width: contentWidth,
      height: contentHeight,
    }, this, this._vAlign, this._hAlign);

    xOffset += this.contentOffsetX;
    yOffset += this.contentOffsetY;

    if (this._currentIcon !== undefined) {
      const labelWidth = getWidth(this._label);
      const labelHeight = getHeight(this._label);
      const iconWidth = getWidth(this._currentIcon);
      const iconHeight = getHeight(this._currentIcon);
      const verticalGap = labelHeight > 0 ? this._iconGap : 0;
      const horizontalGap = labelWidth > 0 ? this._iconGap : 0;
      switch (this._iconPlacement) {
        case "up":
          this._currentIcon.x = xOffset + (contentWidth - iconWidth) * 0.5;
          this._currentIcon.y = yOffset;
          yOffset += iconHeight + verticalGap;
          break;
        case "down":
          this._currentIcon.x = xOffset + (contentWidth - iconWidth) * 0.5;
          this._currentIcon.y = yOffset + contentHeight - iconHeight;
          yOffset -= iconHeight + verticalGap - labelHeight;
          break;
        case "left":
          this._currentIcon.x = xOffset;
          this._currentIcon.y = yOffset + (contentHeight - iconHeight) * 0.5;
          xOffset += iconWidth + horizontalGap;
          break;
        case "right":
          this._currentIcon.x = xOffset + contentWidth - iconWidth;
          this._currentIcon.y = yOffset + (contentHeight - iconHeight) * 0.5;
          xOffset -= iconWidth + horizontalGap - labelWidth;
          break;
      }
    }

    this._label.x = xOffset;
    this._label.y = yOffset;
  }

  protected drawIcon() {
    if (this._currentIcon !== undefined && this._currentIcon.parent === this) {
      this.removeChild(this._currentIcon);
    }
    this._currentIcon = this.getIconForCurrentState();
    if (this._currentIcon !== undefined) {
      this.addChild(this._currentIcon);
    }
  }

  protected drawLabel() {
    this._label.resize(this._label.contentWidth, this._label.contentHeight);
  }

  protected getIconForCurrentState() {
    if (!this._enabled) {
      if (this._disabledIcon !== undefined) {
        return this._disabledIcon;
      }
      return this._icon;
    }
    if (this._selected && this._selectedIcon !== undefined) {
      return this._selectedIcon;
    }
    return this._icon;
  }

  protected calculateContentSize(): { contentWidth: number, contentHeight: number } {
    let contentWidth = this._label.contentWidth;
    let contentHeight = this._label.contentHeight;
    if (this._currentIcon !== undefined) {
      switch (this._iconPlacement) {
        case "left":
        case "right":
          contentWidth += getWidth(this._currentIcon) + (contentWidth > 0 ? this._iconGap : 0);
          break;
        case "up":
        case "down":
          contentHeight += getHeight(this._currentIcon) + (contentHeight > 0 ? this._iconGap : 0);
          break;
      }
    }
    return {contentWidth, contentHeight};
  }
}
