import { AbstractComponent } from '../core/AbstractComponent';
import { DisplayObjectWithSize } from '../display/DisplayObjectWithSize';
import { HorizontalAlign } from './HorizontalAlign';
import { IHasDimensions } from './IHasDimensions';
import { IPoint } from './IPoint';
import { getHeight, getWidth } from './utils';
import { VerticalAlign } from './VerticalAlign';

export function alignChild(
  child: IHasDimensions | DisplayObjectWithSize,
  parent: IHasDimensions | DisplayObjectWithSize,
  vAlign?: VerticalAlign,
  hAlign?: HorizontalAlign,
  offset?: IPoint,
  result?: IPoint
) {
  if (result === undefined) {
    result = { x: 0, y: 0 };
  }

  if (child instanceof AbstractComponent) {
    child.validateNow();
  }

  const parentWidth = getWidth(parent);
  const parentHeight = getHeight(parent);

  const childWidth = getWidth(child);
  const childHeight = getHeight(child);

  let x: number | undefined;
  let y: number | undefined;

  if (vAlign !== undefined) {
    switch (vAlign) {
      case 'top':
        y = 0;
        break;
      case 'center':
        y = (parentHeight - childHeight) * 0.5;
        break;
      case 'bottom':
        y = parentHeight - childHeight;
        break;
    }
  }
  if (hAlign !== undefined) {
    switch (hAlign) {
      case 'left':
        x = 0;
        break;
      case 'center':
        x = (parentWidth - childWidth) * 0.5;
        break;
      case 'right':
        x = parentWidth - childWidth;
        break;
    }
  }

  if (x !== undefined) {
    result.x = x;
  }
  if (y !== undefined) {
    result.y = y;
  }

  if (offset !== undefined) {
    result.x += offset.x;
    result.y += offset.y;
  }

  return result;
}
