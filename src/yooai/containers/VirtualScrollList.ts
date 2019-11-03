import {Container} from "pixi.js";
import {invalidate, ItemRenderer} from "../..";
import {ChangeEvent, ChangeType, DataProvider} from "../data/DataProvider";
import {BaseScrollPane} from "./BaseScrollPane";
import Graphics = PIXI.Graphics;

export abstract class VirtualScrollList<T> extends BaseScrollPane {
  public get rowSpacing(): number {
    return this._rowSpacing;
  }

  @invalidate("size")
  public set rowSpacing(value: number) {
    this._rowSpacing = value;
  }

  public get selectable(): boolean {
    return this._selectable;
  }

  @invalidate("selected")
  public set selectable(value: boolean) {
    this._selectable = value;
  }

  public get allowMultipleSelection(): boolean {
    return this._allowMultipleSelection;
  }

  @invalidate("selected")
  public set allowMultipleSelection(value: boolean) {
    this._allowMultipleSelection = value;
  }

  public get rowHeight(): number {
    return this._rowHeight;
  }

  @invalidate("size")
  public set rowHeight(value: number) {
    this._rowHeight = value;
  }

  public get rendererClass(): { new(): ItemRenderer<T> } {
    return this._rendererClass;
  }

  @invalidate("renderer")
  public set rendererClass(value: { new(): ItemRenderer<T> }) {
    this._rendererClass = value;
  }

  public get selectedIndices(): ReadonlyArray<number> {
    return [...this._selectedIndices];
  }

  public set selectedIndices(value: ReadonlyArray<number>) {
    if (!this._selectable) {
      return;
    }
    this._selectedIndices = value.concat();
    this.invalidate("selected");
  }

  public get selectedItem(): T | undefined {
    return this._selectedIndices.length > 0 && this._dataProvider !== undefined ? this._dataProvider.getItemAt(0) : undefined;
  }

  public set selectedItem(value: T | undefined) {
    if (!this._dataProvider) {
      return;
    }
    this.selectedIndex = value !== undefined ? this._dataProvider.getItemIndex(value) : -1;
  }

  public get selectedIndex(): number {
    return (this._selectedIndices.length > 0) ? this._selectedIndices[this._selectedIndices.length - 1] : -1;
  }

  public set selectedIndex(value: number) {
    this.selectedIndices = (value == -1) ? [] : [value];
  }

  public get selectedItems(): ReadonlyArray<T> {
    if (this._dataProvider !== undefined) {
      return this._selectedIndices.map((index) => this._dataProvider!.getItemAt(index));
    }
    return [];
  }

  public set selectedItems(items: ReadonlyArray<T>) {
    const indices = [];
    if (items !== undefined && items.length === 0 && this._dataProvider !== undefined) {
      for (const item of items) {
        const index = this._dataProvider.getItemIndex(item);
        if (index != -1) {
          indices.push(index);
        }
      }
    }
    this.selectedIndices = indices;
  }

  public get dataProvider(): DataProvider<T> {
    if (this._dataProvider === undefined) {
      this._dataProvider = new DataProvider<T>();
    }
    return this._dataProvider;
  }

  public setDataProvider(value: DataProvider<T> | undefined) {
    if (this._dataProvider === value) return;

    if (this._dataProvider !== undefined) {
      this._dataProvider.off(ChangeEvent.DATA_CHANGE, this.onDataChange, this);
    }
    this._dataProvider = value;
    if (this._dataProvider !== undefined) {
      this._dataProvider.on(ChangeEvent.DATA_CHANGE, this.onDataChange, this);
    }
    this.clearSelection();
    this.clearAllRenderers();
  }

  protected _holder: Container;
  protected _list: Container;
  protected _activeRenderers: ItemRenderer<T>[] = [];
  protected _availableRenderers: ItemRenderer<T>[] = [];
  protected _renderedItems: Set<T> = new Set<T>();
  protected _invalidItems: Set<T> = new Set<T>();
  protected _allowMultipleSelection: boolean = false;
  protected _selectable: boolean = false;
  protected _selectedIndices: number[] = [];
  protected _dataProvider?: DataProvider<T>;
  protected _rectMask: Graphics;
  protected _rendererClass: { new(): ItemRenderer<T> } = ItemRenderer;

  protected _rowHeight: number = 32;
  protected _rowSpacing: number = 0;

  protected constructor(parent?: Container, dataProvider?: DataProvider<T>, x?: number, y?: number, width?: number, height?: number) {
    super(parent, x, y, width, height);

    this._dataProvider = dataProvider !== undefined ? dataProvider : new DataProvider<T>();
    this._holder = this.addChild(new Container());
    this._holder.mask = this._rectMask = new Graphics();
    this._list = this._holder.addChild(new Container());
  }

  public clearSelection(): void {
    this.selectedIndex = -1;
  }

  public getItemRenderer(item: T): ItemRenderer<T> | undefined {
    return this._activeRenderers.find(value => value.data === item);
  }

  public addItem(item: T) {
    this.checkDataProviderAvailability();
    this._dataProvider!.addItem(item);
    this.clearAllRenderers();
  }

  public addItemAt(item: T, index: number) {
    this.checkDataProviderAvailability();
    this._dataProvider!.addItemAt(item, index);
    this.clearAllRenderers();
  }

  public removeAll() {
    if (this._dataProvider !== undefined) {
      this._dataProvider.removeAll();
    }
  }

  public getItemAt(index: number): T | undefined {
    return this._dataProvider === undefined ? undefined : this._dataProvider.getItemAt(index);
  }

  public removeItem(item: T) {
    if (!this._dataProvider) {
      return;
    }
    this._dataProvider.removeItem(item);
  }

  public removeItemAt(index: number) {
    if (!this._dataProvider) {
      return;
    }
    this._dataProvider.removeItemAt(index);
  }

  public replaceItemAt(item: T, index: number) {
    if (!this._dataProvider) {
      return;
    }
    this._dataProvider.replaceItemAt(item, index);
  }

  public clearAllRenderers() {
    this._availableRenderers = [];
    while (this._activeRenderers.length > 0) {
      this._list.removeChild(this._activeRenderers.pop()!);
    }
    this.invalidate("data");
  }

  public invalidateItem(item: T) {
    if (this._renderedItems.has(item)) {
      this._invalidItems.add(item);
      this.invalidate("data");
    }
  }

  public invalidateItemAt(index: number) {
    if (this._dataProvider === undefined) {
      return;
    }
    this.invalidateItem(this._dataProvider.getItemAt(index));
  }

  public sort(sortFunc?: (A: T, B: T) => number): void {
    if (this._dataProvider !== undefined) {
      this._dataProvider.sort(sortFunc);
    }
  }

  public isItemSelected(item: T): boolean {
    if (this._dataProvider === undefined) {
      return false;
    }
    const index = this._dataProvider.getItemIndex(item);
    return index !== -1 && this._selectedIndices.indexOf(index) !== -1;
  }

  public scrollToSelected(): void {
    this.scrollToIndex(this.selectedIndex);
  }

  public abstract scrollToIndex(index: number): void;

  protected checkDataProviderAvailability() {
    if (!this._dataProvider) {
      this._dataProvider = new DataProvider<T>();
    }
  }

  protected draw(): void {
    if (this.isInvalid("renderer")) {
      this.clearAllRenderers();
      this.invalidate("data");
    }
    if (this.isInvalid("data")) {
      this.drawList();
    }
    super.draw();
  }

  protected drawLayout() {
    super.drawLayout();
    this.drawRectMask();
  }

  protected drawRectMask() {
    const rect = this._contentScrollRect;
    this._rectMask.clear();
    this._rectMask.beginFill(0xFF0000, 1);
    this._rectMask.drawRect(rect.x || 0, rect.y || 0, rect.width, rect.height);
    this._rectMask.endFill();
  }

  protected onDataChange(event: ChangeEvent<T>) {
    const {startIndex, endIndex, changeType} = event;
    const selectedItems = this.selectedItems;

    switch (changeType) {
      case ChangeType.INVALIDATE_ALL:
        this.clearSelection();
        this.clearAllRenderers();
        break;
      case ChangeType.INVALIDATE:
        for (const item of event.items) {
          this.invalidateItem(item);
        }
        break;
      case ChangeType.ADD:
        for (const i in this._selectedIndices) {
          if (this._selectedIndices[i] >= startIndex) {
            this._selectedIndices[i] += startIndex - endIndex;
          }
        }
        break;
      case ChangeType.REMOVE:
        for (let i = this._selectedIndices.length - 1; i >= 0; i--) {
          const index = this._selectedIndices[i];
          if (index < startIndex) { continue; }
          if (index <= endIndex) {
            this._selectedIndices.splice(i, 1);
          } else {
            this._selectedIndices[i] -= startIndex - endIndex + 1;
          }
        }
        break;
      case ChangeType.REMOVE_ALL:
        this.clearSelection();
        break;
      case ChangeType.REPLACE:
        break;
      case ChangeType.SORT:
        this.selectedItems = selectedItems;
        break;
    }
    this.invalidate("data");
  }

  protected abstract drawList(): void;
}
