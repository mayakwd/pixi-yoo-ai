export interface IDestroyable {
  readonly isDestroyed: boolean;

  destroy(): void;
}
