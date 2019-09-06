import {Container} from "pixi.js";
import {Component} from "../..";
import {LayoutBehavior} from "./LayoutBehavior";

export class HorizontalLayoutBehavior extends LayoutBehavior {
  public apply(target: Container, width: number, height: number): void {
    const children = target.children;

    let xOffset: number = this._margins.left;
    const yOffset: number = this._margins.top;

    for (const child of children) {
      if (child instanceof Component) {
        child.drawNow();
      }

      if (child instanceof Container) {
        switch (this.vAlign) {
          case "top":
            child.y = yOffset;
            break;
          case "center":
            child.y = yOffset + (height - this.marginTop - this.marginBottom - child.height) * 0.5;
            break;
          case "bottom":
            child.y = height - this.marginBottom - child.height;
            break;
        }
        child.x = xOffset;

        xOffset += child.width + this.horizontalGap;
      }
    }
  }
}
