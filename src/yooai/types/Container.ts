import { Container } from '@pixi/display';

/**
 * @ignore
 * @private
 */
declare class CanvasContainer extends Container {
  public renderCanvas(renderer: unknown): void;
}

export { CanvasContainer as Container };
