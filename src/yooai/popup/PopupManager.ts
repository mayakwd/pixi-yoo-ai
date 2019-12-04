import {gsap} from "gsap";
import {Application, Container, Graphics, interaction} from "pixi.js";
import {DisplayObjectWithSize} from "../display/DisplayObjectWithSize";
import InteractionEvent = interaction.InteractionEvent;

export class PopupManager {

  private get stageWidth(): number {
    return this.application.screen.width;
  }

  private get stageHeight(): number {
    return this.application.screen.height;
  }

  private static defaultOverlayFactory(): DisplayObjectWithSize {
    const quad = new Graphics();
    quad.beginFill(0x113322, 0.25);
    quad.drawRect(0, 0, 100, 100);
    quad.endFill();
    quad.interactive = true;
    return quad;
  }

  public overlayFactory?: () => DisplayObjectWithSize;

  private readonly _popups: Map<DisplayObjectWithSize, DisplayObjectWithSize | undefined> = new Map();
  private readonly root: Container;

  public constructor(
    private readonly application: Application,
    root?: Container,
  ) {
    this.root = root === undefined ? application.stage : root;
  }

  public show(popup: DisplayObjectWithSize, params: IShowParams = {}) {
    const {isModal = true, isCentered = true, offsetX = 0, offsetY = 0, onComplete} = params;
    let overlay: DisplayObjectWithSize | undefined;
    if (isModal) {
      const factory = this.overlayFactory || PopupManager.defaultOverlayFactory;
      overlay = factory();
      overlay.width = this.stageWidth;
      overlay.height = this.stageHeight;
      this.root.addChild(overlay);

      overlay.alpha = 0;
      gsap.fromTo(overlay, 0.1, {alpha: 0}, {alpha: 1}).play();
    }

    this.root.addChild(popup);

    if (isCentered) {
      popup.x = (this.stageWidth - popup.width) * 0.5 + offsetX;
      popup.y = (this.stageHeight - popup.height) * 0.5 + offsetY;
    }

    popup.on("removed", this.onPopupRemoved, this);

    popup.alpha = 0;
    gsap.fromTo(
      popup, 0.175,
      {alpha: 0, y: popup.y + 20},
      {alpha: 1, y: popup.y, ease: "power2.inOut",
        onComplete
      },
    ).play();

    this._popups.set(popup, overlay);
  }

  public hide(popup: DisplayObjectWithSize, destroy: boolean = false, onComplete?: () => void): void {
    if (this._popups.has(popup)) {
      popup.off("removed", this.onPopupRemoved, this);

      const overlay = this._popups.get(popup);
      if (overlay !== undefined) {
        this.root.removeChild(overlay);
        overlay.destroy();
      }

      if (popup.parent === this.root) {
        this.root.removeChild(popup);
      }
      if (destroy) {
        popup.destroy();
      }
      this._popups.delete(popup);
      if (onComplete !== undefined) {
        onComplete();
      }
    }
  }

  private onPopupRemoved(event: InteractionEvent) {
    const popup = event.target as DisplayObjectWithSize;
    this.hide(popup);
  }
}

interface IShowParams {
  isModal?: boolean;
  isCentered?: boolean;
  offsetX?: number;
  offsetY?: number;
  onComplete?: () => void;
}
