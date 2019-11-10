import {Container, DisplayObject} from "pixi.js";
import {Component} from "../..";
import {LayoutBehavior} from "./LayoutBehavior";

export class VerticalLayoutBehavior extends LayoutBehavior {
  public apply(target: Container, width: number, height: number): void {
    const children = target.children;

    let child: DisplayObject;
    const xOffset: number = this._margins.left;
    let yOffset: number = this._margins.top;

    for (child of children) {
      if (child instanceof Component) {
        child.drawNow();
      }

      if (child instanceof Container) {
        switch (this.hAlign) {
          case "left":
            child.x = xOffset;
            break;
          case "center":
            child.x = xOffset + (width - this.marginLeft - this.marginRight - child.width) * 0.5;
            break;
          case "right":
            child.x = width - this.marginRight - child.width;
            break;
        }
        child.y = yOffset;

        yOffset += child.height + this.verticalGap;
      }
    }
  }
}
