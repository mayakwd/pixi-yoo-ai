import {HorizontalAlign} from "./HorizontalAlign";
import {IHasDimensions} from "./IHasDimensions";
import {IPoint} from "./IPoint";
import {VerticalAlign} from "./VerticalAlign";

export function alignChild(
  child: IHasDimensions, parent: IHasDimensions,
  vAlign?: VerticalAlign, hAlign?: HorizontalAlign,
  offset?: IPoint,
  result?: IPoint,
) {
  if (result === undefined) { result = {x: 0, y: 0}; }

  let x: number | undefined;
  let y: number | undefined;

  if (vAlign !== undefined) {
    switch (vAlign) {
      case "top":
        y = 0;
        break;
      case "center":
        y = (parent.height - child.height) * 0.5;
        break;
      case "bottom":
        y = parent.height - child.height;
        break;
    }
  }
  if (hAlign !== undefined) {
    switch (hAlign) {
      case "left":
        x = 0;
        break;
      case "center":
        x = (parent.width - child.width) * 0.5;
        break;
      case "right":
        x = parent.width - child.width;
        break;
    }
  }

  if (x !== undefined) { result.x = x; }
  if (y !== undefined) { result.y = y; }

  if (offset !== undefined) {
    result.x += offset.x;
    result.y += offset.y;
  }

  return result;
}
