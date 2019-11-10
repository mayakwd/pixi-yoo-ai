import {utils} from "pixi.js";
import {ChangeEvent} from "./ChangeEvent";
import {ChangeType} from "./ChangeType";
import EventEmitter = utils.EventEmitter;

export class DataProvider<T> extends EventEmitter {
  private _data: T[];

  public constructor(data?: T[]) {
    super();
    this._data = data || [];
  }

  public get length(): number {
    return this._data.length;
  }

  public invalidateItemAt(index: number): void {
    if (this.length === 0) {
      throw new Error(`DataProvider is empty`);
    }
    this.validateIndex(index);
    this.dispatchChange(ChangeType.INVALIDATE, [this._data[index]], index, index);
  }

  public invalidateItem(item: T): void {
    const index = this._data.indexOf(item);
    if (index !== -1) {
      this.invalidateItemAt(index);
    }
  }

  public invalidate(): void {
    this.dispatchChange(ChangeType.INVALIDATE_ALL, [...this._data], 0, this._data.length);
  }

  public addItemAt(item: T, index: number): void {
    this.validateIndex(index);
    this._data.splice(index, 0, item);
    this.dispatchChange(ChangeType.ADD, [item], index, index);
  }

  public addItem(item: T): void {
    const index = this._data.length;
    this._data.push(item);
    this.dispatchChange(ChangeType.ADD, [item], index, index);
  }

  public addItemsAt(items: ReadonlyArray<T>, index: number): void {
    this.validateIndex(index);
    this._data.splice(index, 0, ...items);
    this.dispatchChange(ChangeType.ADD, items, index, index + items.length - 1);
  }

  public addItems(items: ReadonlyArray<T>): void {
    this.addItemsAt(items, this._data.length);
  }

  public getItemAt(index: number): T {
    this.validateIndex(index);
    return this._data[index];
  }

  public getItemIndex(item: T): number {
    return this._data.indexOf(item);
  }

  public removeItemAt(index: number): T {
    this.validateIndex(index);
    const items = this._data.splice(index, 1);
    this.dispatchChange(ChangeType.REMOVE, items, index, index);
    return items[0];
  }

  public removeItem(item: T): T | undefined {
    const index = this._data.indexOf(item);
    if (index !== -1) {
      return this.removeItemAt(index);
    }
    return undefined;
  }

  public removeAll(): void {
    const items = [...this._data];
    this._data = [];
    this.dispatchChange(ChangeType.REMOVE_ALL, items, 0, items.length);
  }

  public replaceItemAt(newItem: T, index: number): T | undefined {
    this.validateIndex(index);
    const items = [this._data[index]];
    this._data[index] = newItem;
    this.dispatchChange(ChangeType.REPLACE, items, index, index);
    return items[0];
  }

  public replaceItem(newItem: T, oldItem: T): T | undefined {
    const index = this.getItemIndex(oldItem);
    if (index !== -1) {
      return this.replaceItemAt(newItem, index);
    }
    return undefined;
  }

  public sort(sortFunc?: (a: T, b: T) => number): void {
    this._data.sort(sortFunc);
    this.dispatchChange(ChangeType.SORT, [...this._data], 0, this._data.length - 1);
  }

  private dispatchChange(type: ChangeType, items: ReadonlyArray<T>, startIndex: number, endIndex: number) {
    this.emit(ChangeEvent.DATA_CHANGE, new ChangeEvent(type, items, startIndex, endIndex));
  }

  private validateIndex(index: number) {
    if (index < 0 || index > this.length) {
      throw new Error(`Index ${index} out of range [0..${this.length}]`);
    }
  }
}
