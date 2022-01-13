import { Container } from '@pixi/display';
import { AbstractComponent } from '../core/AbstractComponent';
import { LayoutBehavior } from './LayoutBehavior';
import { getHeight, getWidth } from './utils';

export class HorizontalLayoutBehavior extends LayoutBehavior {
  public apply(target: Container, width: number, height: number): void {
    const children = target.children;

    let xOffset: number = this._margins.left;
    const yOffset: number = this._margins.top;

    for (const child of children) {
      if (child instanceof AbstractComponent && child.isInvalid()) {
        child.validateNow();
      }

      if (child instanceof Container) {
        const childHeight = getHeight(child);
        const childWidth = getWidth(child);
        switch (this.vAlign) {
          case 'top':
            child.y = yOffset;
            break;
          case 'center':
            child.y = yOffset + (height - childHeight) * 0.5;
            break;
          case 'bottom':
            child.y = height - this.marginBottom - childHeight;
            break;
        }
        child.x = xOffset;

        xOffset += childWidth + this.horizontalGap;
      }
    }
  }
}
