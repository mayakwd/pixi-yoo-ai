import { EventEmitter } from '@pixi/utils';

export class EventProxy {
  private readonly _targets: EventEmitter[] = [];
  private _events: Map<string | symbol, IEventScope[]> = new Map();

  public addTarget(target: EventEmitter): void {
    this._targets.push(target);
    for (const [event, scopes] of this._events) {
      for (const scope of scopes) {
        const { fn, context } = scope;
        if (scope.once) {
          target.once(event, fn, context);
        } else {
          target.on(event, fn, context);
        }
      }
    }
  }

  public removeTarget(target: EventEmitter): void {
    const index = this._targets.indexOf(target);
    if (index !== -1) {
      this._targets.splice(index, 1);
      for (const [event, scopes] of this._events) {
        for (const scope of scopes) {
          const { fn, context, once } = scope;
          target.removeListener(event, fn, context, once);
        }
      }
    }
  }

  public on(event: string | symbol, fn: (...args: unknown[]) => void, context?: unknown): this {
    for (const target of this._targets) {
      target.on(event, fn, context);
    }
    this.addEventScope(event, fn, context, false);
    return this;
  }

  public off(event: string | symbol, fn?: (...args: unknown[]) => void, context?: unknown, once?: boolean): this {
    const scopes = this._events.get(event);
    if (scopes !== undefined) {
      const index = scopes.findIndex((value) => value.fn === fn && value.context === context && value.once === once);
      if (index !== -1) {
        scopes.splice(index, 1);
        for (const target of this._targets) {
          target.off(event, fn, context, once);
        }
      }
    }
    return this;
  }

  public removeListener(
    event: string | symbol,
    fn?: (...args: unknown[]) => void,
    context?: unknown,
    once?: boolean
  ): this {
    this.off(event, fn, context, once);
    return this;
  }

  public removeAllListeners(event?: string | symbol): this {
    for (const target of this._targets) {
      target.removeAllListeners(event);
    }

    if (event !== undefined && this._events.has(event)) {
      this._events.delete(event);
    }

    return this;
  }

  private addEventScope(event: string | symbol, fn: (...args: unknown[]) => void, context: unknown, once: boolean) {
    let scopes: IEventScope[] | undefined;
    if (this._events.has(event)) {
      scopes = this._events.get(event);
    } else {
      this._events.set(event, (scopes = []));
    }
    scopes?.push({ fn, context, once });
  }
}

interface IEventScope {
  fn: (...args: unknown[]) => void;
  context?: unknown;
  once?: boolean;
}
