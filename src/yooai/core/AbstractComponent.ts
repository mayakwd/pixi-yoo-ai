import { Renderer } from '@pixi/core';
import { Container } from '@pixi/display';
import { InvalidationType } from './InvalidationType';

export class AbstractComponent extends Container {
  private _invalidationSet: Set<InvalidationType> = new Set();
  private _inInvalidationPhase: boolean = false;

  protected constructor() {
    super();
    this.invalidate('all');
  }

  public invalidate(invalidationType: InvalidationType = 'all'): void {
    this._invalidationSet.add(invalidationType);
  }

  public isInvalid(invalidationType: InvalidationType = 'all'): boolean {
    if (invalidationType === 'all') {
      return this._invalidationSet.size > 0;
    }
    return this._invalidationSet.has('all') || this._invalidationSet.has(invalidationType);
  }

  public drawNow(): void {
    this.draw();
  }

  public validateNow(): void {
    if (this.isInvalid() && !this._inInvalidationPhase) {
      this._inInvalidationPhase = true;
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
    // Intended to be empty
  }

  protected afterDraw() {
    // Intended to be empty
  }

  public renderCanvas(renderer: unknown) {
    if (this.destroyed) {
      return;
    }

    if (super.renderCanvas !== undefined) {
      super.renderCanvas(renderer);
    }
    this.update();
  }

  public render(renderer: Renderer) {
    if (this.destroyed) {
      return;
    }

    super.render(renderer);
    this.update();
  }

  protected update() {
    if (this.isInvalid()) {
      this.validateNow();
    }
  }
}

declare module '@pixi/display' {
  interface Container {
    renderCanvas(renderer: unknown): void;
  }
}
