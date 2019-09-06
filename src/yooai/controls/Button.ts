import {Container, TextStyle} from "pixi.js";
import {HorizontalAlign, VerticalAlign} from "../..";
import {Placement} from "../layout/Placement";
import {InteractiveComponent} from "./InteractiveComponent";
import {Label} from "./Label";
import Rectangle = PIXI.Rectangle;

export class Button extends InteractiveComponent {

  public get text(): string {
    return this._label.text;
  }

  public set text(value: string) {
    this._label.text = value;
    this.invalidate("text");
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
      this.invalidate("text");
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
      this.invalidate("text");
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
      this.invalidate("text");
    }
  }

  public get textStyle(): TextStyle {
    return this._label.textStyle;
  }

  public set textStyle(value: TextStyle) {
    this._label.textStyle = value;
    this.invalidate("text");
  }

  public get contentMarginLeft(): number {
    return this._margins.left;
  }

  public set contentMarginLeft(value: number) {
    this._margins.left = value;
    this.invalidate("text");
  }

  public get contentMarginRight(): number {
    return this._margins.right;
  }

  public set contentMarginRight(value: number) {
    this._margins.right = value;
    this.invalidate("text");
  }

  public get contentMarginTop(): number {
    return this._margins.top;
  }

  public set contentMarginTop(value: number) {
    this._margins.top = value;
    this.invalidate("text");
  }

  public get contentMarginBottom(): number {
    return this._margins.bottom;
  }

  public set contentMarginBottom(value: number) {
    this._margins.bottom = value;
    this.invalidate("text");
  }

  public get vAlign(): VerticalAlign {
    return this._vAlign;
  }

  public set vAlign(value: VerticalAlign) {
    this._vAlign = value;
    this.invalidate("text");
  }

  public get hAlign(): HorizontalAlign {
    return this._hAlign;
  }

  public set hAlign(value: HorizontalAlign) {
    this._hAlign = value;
    this.invalidate("text");
  }

  protected _label!: Label;

  protected _icon?: Container;
  protected _selectedIcon?: Container;
  protected _disabledIcon?: Container;
  protected _currentIcon?: Container;

  protected _margins: Rectangle = new Rectangle();
  protected _vAlign: VerticalAlign = "center";
  protected _hAlign: HorizontalAlign = "center";
  protected _iconPlacement: Placement = "left";
  protected _iconGap: number = 4;

  constructor(parent?: Container, x: number = 0, y: number = 0, width: number = 80, height: number = 24) {
    super(parent, x, y, width, height);
  }

  protected configure() {
    super.configure();
    this._label = new Label(this);
  }

  protected draw(): void {
    if (this.isInvalid("text")) {
      this.drawLabel();
    }
    super.draw();
  }

  protected drawLabel() {
    if (this._currentIcon !== undefined && this._currentIcon.parent === this) {
      this.removeChild(this._currentIcon);
    }

    this._label.resize(this._label.contentWidth, this._label.contentHeight);
    this._label.drawNow();

    this._currentIcon = this.getIconForCurrentState();
    if (this._currentIcon !== undefined) {
      this.addChild(this._currentIcon);
    }

    const {contentWidth, contentHeight} = this.calculateContentSize();
    let {xOffset, yOffset} = this.calculateContentOffset(contentWidth, contentHeight);

    if (this._currentIcon !== undefined) {
      const verticalGap = this._label.contentHeight > 0 ? this._iconGap : 0;
      const horizontalGap = this._label.contentWidth > 0 ? this._iconGap : 0;
      switch (this._iconPlacement) {
        case "up":
          this._currentIcon.x = xOffset + (contentWidth - this._currentIcon.width) * 0.5;
          this._currentIcon.y = yOffset;
          yOffset += this._currentIcon.height + verticalGap;
          break;
        case "down":
          this._currentIcon.x = xOffset + (contentWidth - this._currentIcon.width) * 0.5;
          this._currentIcon.y = yOffset + contentHeight - this._currentIcon.height;
          yOffset -= this._currentIcon.height + verticalGap - this._label.contentHeight;
          break;
        case "left":
          this._currentIcon.x = xOffset;
          this._currentIcon.y = yOffset + (contentHeight - this._currentIcon.height) * 0.5;
          xOffset += this._currentIcon.width + horizontalGap;
          break;
        case "right":
          this._currentIcon.x = xOffset + contentWidth - this._currentIcon.width;
          this._currentIcon.y = yOffset + (contentHeight - this._currentIcon.height) * 0.5;
          xOffset -= this._currentIcon.width + horizontalGap - this._label.width;
          break;
      }
    }

    this._label.x = xOffset;
    this._label.y = yOffset;
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

  protected calculateContentOffset(contentWidth: number, contentHeight: number): { xOffset: number, yOffset: number } {
    let xOffset: number = 0;
    let yOffset: number = 0;

    switch (this._vAlign) {
      case "top":
        yOffset = 0;
        break;
      case "center":
        yOffset = (this._height - contentHeight) * 0.5;
        break;
      case "bottom":
        yOffset = this._height - contentHeight;
        break;
    }

    switch (this._hAlign) {
      case "left":
        xOffset = 0;
        break;
      case "center":
        xOffset = (this._width - contentWidth) * 0.5;
        break;
      case "right":
        xOffset = this._width - contentWidth;
        break;
    }
    return {xOffset, yOffset};
  }

  protected calculateContentSize(): { contentWidth: number, contentHeight: number } {
    let contentWidth = this._label.width;
    let contentHeight = this._label.height;
    if (this._currentIcon !== undefined) {
      switch (this._iconPlacement) {
        case "left":
        case "right":
          contentWidth += this._currentIcon.width + (contentWidth > 0 ? this._iconGap : 0);
          break;
        case "up":
        case "down":
          contentHeight += this._currentIcon.height + (contentHeight > 0 ? this._iconGap : 0);
          break;
      }
    }
    return {contentWidth, contentHeight};
  }
}
