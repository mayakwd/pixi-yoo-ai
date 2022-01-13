import { Container } from '@pixi/display';
import { HorizontalLayoutBehavior } from '../..';
import { AbstractComponent } from '../core/AbstractComponent';
import { getHeight, getWidth } from '../layout/utils';
import { AbstractBox } from './AbstractBox';

export class HBox extends AbstractBox {
  public constructor(parent?: Container, x: number = 0, y: number = 0) {
    super(new HorizontalLayoutBehavior(), parent, x, y);

    this._componentHeight = HBox.INITIAL_HEIGHT;
  }

  protected drawLayout(): void {
    this.calculateContentSize();
    this._componentWidth = this._contentWidth + this.marginLeft + this.marginRight;
    this._componentHeight = this._contentHeight + this.marginTop + this.marginBottom;
    super.drawLayout();
  }

  private calculateContentSize() {
    const childrenCount = this.children.length;

    this._contentHeight = 0;
    this._contentWidth = 0;

    let index = childrenCount - 1;
    let contentWidthIsSet = false;

    while (index >= 0) {
      const child = this.children[index];
      if (child instanceof Container) {
        if (child instanceof AbstractComponent && child.isInvalid()) {
          child.validateNow();
        }
        const childWidth = getWidth(child);
        const childHeight = getHeight(child);
        if (!contentWidthIsSet) {
          this._contentWidth = child.x + childWidth - this.marginLeft;
          contentWidthIsSet = true;
        }
        if (this._contentHeight < childHeight) {
          this._contentHeight = childHeight;
        }
      }
      index--;
    }
  }
}
