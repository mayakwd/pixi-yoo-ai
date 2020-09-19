import {Container} from "pixi.js";
import {InvalidationType} from "./InvalidationType";

export class AbstractComponent extends Container {
  private _invalidationSet: Set<InvalidationType> = new Set();
  private _inInvalidationPhase: boolean = false;
  private _invalidationFrame: number = -1;

  protected constructor() {
    super();
    this._invalidationFrame = requestAnimationFrame(() => {
      this.initialize();
      this._invalidationFrame = -1;
    });
  }

  public invalidate(invalidationType: InvalidationType = "all"): void {
    this._invalidationSet.add(invalidationType);
    if (this._invalidationFrame === -1 && !this._inInvalidationPhase) {
      this._invalidationFrame = requestAnimationFrame(() => {
        if (!this._destroyed && this.parent !== undefined) {
          this.validateNow();
        }
        this._invalidationFrame = -1;
      });
    }
  }

  public isInvalid(invalidationType: InvalidationType = "all"): boolean {
    if (invalidationType === "all") {
      return this._invalidationSet.size > 0;
    }
    return this._invalidationSet.has("all") || this._invalidationSet.has(invalidationType);
  }

  public drawNow(): void {
    this.draw();
  }

  public validateNow(): void {
    if (this.isInvalid() && !this._inInvalidationPhase) {
      this._inInvalidationPhase = true;
      for (const child of this.children) {
        if (child instanceof AbstractComponent) {
          child.validateNow();
        }
      }
      this.draw();
      this.afterDraw();
      this.validate();
      this._inInvalidationPhase = false;
    } else if (this._inInvalidationPhase) {
      this.draw();
      this.afterDraw();
    }
  }

  private validate(): void {
    this._invalidationSet.clear();
  }

  protected draw(): void {
  }

  protected afterDraw() {
  }

  private initialize(): void {
    this._invalidationFrame = -1;
    this.addDisplayListListeners();
    if (this.parent !== undefined) {
      this.invalidate();
    }
  }

  private addDisplayListListeners() {
    this.on("added", this.onAdded, this);
    this.on("removed", this.onRemoved, this);
  }

  private onAdded() {
    this.validateNow();
  }

  private onRemoved() {
    if (this._invalidationFrame !== -1) {
      cancelAnimationFrame(this._invalidationFrame);
    }
    this._invalidationFrame = -1;
  }
}
