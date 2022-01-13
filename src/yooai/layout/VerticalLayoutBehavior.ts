import { Container, DisplayObject } from '@pixi/display';
import { AbstractComponent } from '../core/AbstractComponent';
import { LayoutBehavior } from './LayoutBehavior';
import { getHeight, getWidth } from './utils';

export class VerticalLayoutBehavior extends LayoutBehavior {
  public apply(target: Container, width: number, height: number): void {
    const children = target.children;

    let child: DisplayObject;
    const xOffset: number = this._margins.left;
    let yOffset: number = this._margins.top;

    for (child of children) {
      if (child instanceof AbstractComponent && child.isInvalid()) {
        child.validateNow();
      }

      if (child instanceof Container) {
        const childHeight = getHeight(child);
        const childWidth = getWidth(child);
        switch (this.hAlign) {
          case 'left':
            child.x = xOffset;
            break;
          case 'center':
            child.x = xOffset + (width - childWidth) * 0.5;
            break;
          case 'right':
            child.x = width - this.marginRight - childWidth;
            break;
        }
        child.y = yOffset;

        yOffset += childHeight + this.verticalGap;
      }
    }
  }
}
