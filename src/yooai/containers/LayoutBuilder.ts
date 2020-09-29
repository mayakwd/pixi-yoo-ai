import {DisplayObject} from "pixi.js";
import {HorizontalAlign, VerticalAlign} from "../..";
import {Direction} from "../layout/Direction";
import {AbstractBox} from "./AbstractBox";
import {HBox} from "./HBox";
import {VBox} from "./VBox";

export type LayoutBuilderSettings = {
  hAlign?: HorizontalAlign,
  vAlign?: VerticalAlign,
  hGap?: number,
  vGap?: number
}

export class LayoutBuilder {
  private vGap: number = 0;
  private hGap: number = 0;
  private children: Array<LayoutBuilder | DisplayObject> = [];
  private hAlign: HorizontalAlign = "left";
  private vAlign: VerticalAlign = "top";

  public constructor(private readonly type: Direction, settings: LayoutBuilderSettings = {
    hAlign: "left",
    vAlign: "top",
    hGap: 0,
    vGap: 0,
  }) {
    const {hAlign = "left", vAlign = "top", vGap = 0, hGap = 0} = settings;
    this.hAlign = hAlign;
    this.vAlign = vAlign;
    this.vGap = vGap;
    this.hGap = hGap;
  }

  public add(...items: Array<LayoutBuilder | DisplayObject>): this {
    this.children.push(...items);
    return this;
  }

  public withVAlign(vAlign: VerticalAlign): this {
    this.vAlign = vAlign;
    return this;
  }

  public withHAlign(hAlign: HorizontalAlign): this {
    this.hAlign = hAlign;
    return this;
  }

  public withHGap(hGap: number): this {
    this.hGap = hGap;
    return this;
  }

  public withVGap(vGap: number): this {
    this.vGap = vGap;
    return this;
  }

  public build(): AbstractBox {
    let box: AbstractBox;
    switch (this.type) {
      case "horizontal":
        box = new HBox();
        break;
      case "vertical":
        box = new VBox();
        break;
    }
    box.verticalGap = this.vGap;
    box.horizontalGap = this.hGap;
    box.hAlign = this.hAlign;
    box.vAlign = this.vAlign;
    for (const child of this.children) {
      if (child instanceof LayoutBuilder) {
        box.addChild(child.build());
      } else {
        box.addChild(child);
      }
    }
    return box;
  }
}

export function buildLayout(type: Direction, settings: LayoutBuilderSettings = {
  hAlign: "left",
  vAlign: "top",
  hGap: 0,
  vGap: 0,
}): LayoutBuilder {
  return new LayoutBuilder(type, settings);
}
