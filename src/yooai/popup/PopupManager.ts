import { Application } from '@pixi/app';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { InteractionEvent } from '@pixi/interaction';
import { gsap } from 'gsap';
import { PopupEvent } from '../..';
import { DisplayObjectWithSize } from '../display/DisplayObjectWithSize';
import { getHeight, getWidth } from '../layout/utils';

export class PopupManager {
  private static createWrapper(color: number, alpha: number): DisplayObjectWithSize {
    const quad = new Graphics();
    quad.beginFill(color, alpha);
    quad.drawRect(0, 0, 100, 100);
    quad.endFill();
    quad.interactive = true;
    return quad;
  }

  private readonly _root: Container;
  private readonly _popups: Map<DisplayObjectWithSize, DisplayObjectWithSize | undefined> = new Map();
  private readonly _stack: DisplayObjectWithSize[] = [];

  private _activePopup?: DisplayObjectWithSize;

  public constructor(private readonly application: Application, root?: Container) {
    this._root = root === undefined ? application.stage : root;
  }

  private get stageWidth(): number {
    return this.application.screen.width;
  }

  private get stageHeight(): number {
    return this.application.screen.height;
  }

  public show(popup: DisplayObjectWithSize, params: IShowParams = {}) {
    const { isModal = true, isCentered = true, offsetX = 0, offsetY = 0, onComplete } = params;
    if (isModal && this._activePopup !== undefined) {
      this.pushInStack(this._activePopup);
    }
    let wrapper: DisplayObjectWithSize | undefined;
    if (isModal) {
      wrapper = PopupManager.createWrapper(params.wrapperColor ?? 0x113322, params.wrapperAlpha ?? 0.25);
      wrapper.width = this.stageWidth;
      wrapper.height = this.stageHeight;
      this._root.addChild(wrapper);

      wrapper.alpha = 0;
      gsap.to(wrapper, { duration: 0.15, alpha: 1 }).play();
    }

    popup.emit(PopupEvent.FOCUS_IN);
    this._root.addChild(popup);

    if (isCentered) {
      popup.x = (this.stageWidth - getWidth(popup)) * 0.5 + offsetX;
      popup.y = (this.stageHeight - getHeight(popup)) * 0.5 + offsetY;
    }

    popup.on('removed', this.onPopupRemoved, this);

    popup.alpha = 0;
    gsap
      .fromTo(
        popup,
        0.175,
        { alpha: 0, y: popup.y + 20 },
        {
          alpha: 1,
          y: popup.y,
          ease: 'power2.out',
          onInterrupt: onComplete,
          onComplete
        }
      )
      .play();

    this._popups.set(popup, wrapper);
    if (isModal) {
      this._activePopup = popup;
    }
  }

  public hide(popup: DisplayObjectWithSize, destroy: boolean = false, onComplete?: () => void): void {
    if (this._popups.has(popup)) {
      popup.emit(PopupEvent.FOCUS_OUT);
      popup.off('removed', this.onPopupRemoved, this);

      const wrapper = this._popups.get(popup);
      if (wrapper !== undefined) {
        const completeCallback = () => {
          this._root.removeChild(wrapper);
          wrapper.destroy();
        };
        gsap.killTweensOf(wrapper);
        gsap.to(wrapper, {
          duration: 0.15,
          alpha: 0,
          onInterrupt: completeCallback,
          onComplete: completeCallback
        });
      }

      if (popup.parent === this._root) {
        gsap.killTweensOf(popup);
        const completeCallback = () => {
          this._root.removeChild(popup);
          if (destroy) {
            popup.destroy();
          }
          onComplete?.();
        };
        gsap
          .to(popup, {
            alpha: 0,
            y: popup.y + 20,
            ease: 'power2.out',
            duration: 0.15,
            onInterrupt: completeCallback,
            onComplete: completeCallback
          })
          .play();
      } else {
        gsap.killTweensOf(popup);
        if (destroy) {
          popup.destroy();
        }
        onComplete?.();
      }
      this._popups.delete(popup);
    }

    if (this._activePopup === popup) {
      this._activePopup = undefined;
      this.popFromStack();
    } else {
      const index = this._stack.indexOf(popup);
      if (index !== -1) {
        this._stack.splice(index, 1);
      }
    }
  }

  private onPopupRemoved(event: InteractionEvent) {
    const popup = event.target as DisplayObjectWithSize;
    this.hide(popup);
  }

  private pushInStack(popup: DisplayObjectWithSize) {
    this._stack.push(popup);
    this.pushPopup(popup);
  }

  private popFromStack() {
    if (this._stack.length > 0) {
      const popup = this._stack.pop();
      if (popup !== undefined) {
        this.popPopup(popup);
        this._activePopup = popup;
      }
    }
  }

  private pushPopup(popup: DisplayObjectWithSize) {
    if (this._popups.has(popup)) {
      popup.off('removed', this.onPopupRemoved, this);
      if (popup.parent === this._root) {
        const wrapper = this._popups.get(popup);
        const targets = [popup];
        if (wrapper !== undefined) {
          targets.push(wrapper);
        }
        popup.emit(PopupEvent.FOCUS_OUT);
        gsap.to(targets, {
          alpha: 0,
          duration: 0.15,
          ease: 'power2.in',
          onComplete: () => {
            for (const target of targets) {
              if (this._root === target.parent) {
                this._root.removeChild(target);
              }
            }
          }
        });
      }
    }
  }

  private popPopup(popup: DisplayObjectWithSize) {
    if (this._popups.has(popup)) {
      popup.emit(PopupEvent.FOCUS_IN);
      popup.on('removed', this.onPopupRemoved, this);
      const wrapper = this._popups.get(popup);
      const targets = [popup];
      if (wrapper !== undefined) {
        targets.push(wrapper);
      }
      for (const target of targets.reverse()) {
        this._root.addChild(target);
      }
      gsap.to(targets, {
        alpha: 1,
        duration: 0.15,
        ease: 'power2.out'
      });
    }
  }
}

interface IShowParams {
  isModal?: boolean;
  isCentered?: boolean;
  wrapperColor?: number;
  wrapperAlpha?: number;
  offsetX?: number;
  offsetY?: number;
  onComplete?: () => void;
}
