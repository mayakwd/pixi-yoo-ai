import {gsap} from "gsap";
import {Container, Graphics} from "pixi.js";
import {
  ChangeEvent,
  ChangeType,
  DataProvider,
  EventProxy,
  invalidate,
  InvalidationType,
  ItemRenderer,
  ListEvent,
} from "../..";
import {BaseScrollPane} from "./BaseScrollPane";

export abstract class VirtualScrollList<T> extends BaseScrollPane {
  public get animated(): boolean {
    return this._animated;
  }

  public set animated(value: boolean) {
    this._animated = value;
  }

  public get maxSelectedItemsCount(): number {
    return this._maxSelectedItemsCount;
  }

  @invalidate("selection")
  public set maxSelectedItemsCount(value: number) {
    this._maxSelectedItemsCount = value;
    if (this._maxSelectedItemsCount > 0 && this._selectedIndices.length > this._maxSelectedItemsCount) {
      this._selectedIndices.length = this._maxSelectedItemsCount;
      this.emit(ListEvent.SELECTION_CHANGE);
    }
  }

  public get rendererEvents(): EventProxy<T> {
    return this._rendererEvents;
  }

  public get pageScrollDuration(): number {
    return this._pageScrollDuration;
  }

  public set pageScrollDuration(value: number) {
    this._pageScrollDuration = value;
  }

  public get verticalGap(): number {
    return this._verticalGap;
  }

  @invalidate("size")
  public set verticalGap(value: number) {
    this._verticalGap = value;
  }

  public get selectable(): boolean {
    return this._selectable;
  }

  @invalidate("data")
  public set selectable(value: boolean) {
    this._selectable = value;
  }

  public get allowMultipleSelection(): boolean {
    return this._allowMultipleSelection;
  }

  @invalidate("data")
  public set allowMultipleSelection(value: boolean) {
    this._allowMultipleSelection = value;

    if (!this._allowMultipleSelection && this._selectedIndices.length > 1) {
      this._selectedIndices.length = 1;
      this.emit(ListEvent.SELECTION_CHANGE);
    }
  }

  public get rowHeight(): number {
    return this._rowHeight;
  }

  @invalidate("size")
  public set rowHeight(value: number) {
    this._rowHeight = value;
  }

  public set pageSize(value: number) {
    this._pageSize = Math.max(1, value);
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public get pagesCount(): number {
    return Math.ceil(this.availableRowsCount / this.pageSize);
  }

  public abstract get availableRowsCount(): number;

  public get rendererClass(): new() => ItemRenderer<T> {
    return this._rendererClass;
  }

  @invalidate("renderer")
  public set rendererClass(value: new() => ItemRenderer<T>) {
    this._rendererClass = value;
  }

  public get selectedIndices(): ReadonlyArray<number> {
    return [...this._selectedIndices];
  }

  public set selectedIndices(value: ReadonlyArray<number>) {
    this._selectedIndices = value.concat();
    this.invalidate("data");
  }

  public get selectedItem(): T | undefined {
    if (this._selectedIndices.length > 0) {
      return this._dataProvider?.getItemAt(this._selectedIndices[0]);
    }
    return undefined;
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
    this.selectedIndices = (value === -1) ? [] : [value];
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
        if (index !== -1) {
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

  protected get pageHeight(): number {
    return this.pageSize * (this.rowHeight + this.verticalGap);
  }

  protected get pageWidth(): number {
    return this._contentWidth;
  }

  public get length(): number {
    return this.dataProvider.length;
  }

  protected _holder: Container;
  protected _list: Container;
  protected _activeRenderers: Array<ItemRenderer<T>> = [];
  protected _availableRenderers: Array<ItemRenderer<T>> = [];
  protected _renderedItems: Set<T> = new Set<T>();
  protected _invalidItems: Set<T> = new Set<T>();
  protected _allowMultipleSelection: boolean = false;
  protected _maxSelectedItemsCount: number = 0;
  protected _selectable: boolean = false;
  protected _selectedIndices: number[] = [];
  protected _dataProvider?: DataProvider<T>;
  protected _rectMask: Graphics;
  protected _rendererClass: new() => ItemRenderer<T> = ItemRenderer;
  protected _rendererEvents: EventProxy<T> = new EventProxy<T>();

  protected _rowHeight: number = 32;
  protected _verticalGap: number = 0;
  protected _pageSize: number = 1;
  protected _pageScrollDuration: number = 0.175;
  protected _animated: boolean = true;

  protected constructor(
    parent?: Container,
    dataProvider?: DataProvider<T>,
    x?: number, y?: number, width?: number, height?: number,
  ) {
    super(parent, x, y, width, height);

    this.interactiveChildren = true;
    this._dataProvider = dataProvider !== undefined ? dataProvider : new DataProvider<T>();
    this._holder = this.addChild(new Container());
    this._holder.interactiveChildren = true;
    this._holder.mask = this._rectMask = new Graphics();
    this.addChild(this._rectMask);

    this._list = this._holder.addChild(new Container());
    this._list.interactiveChildren = true;
  }

  public setDataProvider(value: DataProvider<T> | undefined) {
    if (this._dataProvider === value) {
      return;
    }

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

  public clearSelection(): void {
    this.selectedIndex = -1;
  }

  public getItemRenderer(item: T): ItemRenderer<T> | undefined {
    return this._activeRenderers.find((value) => value.data === item);
  }

  public addItem(item: T) {
    this.checkDataProviderAvailability();
    this._dataProvider!.addItem(item);
    this.clearAllRenderers();
  }

  public addItems(items: ReadonlyArray<T>) {
    this.checkDataProviderAvailability();
    this._dataProvider!.addItems(items);
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

  public invalidateActiveItems(...type: InvalidationType[]): void {
    this._activeRenderers.forEach((renderer) => {
      if (type.length === 0) {
        renderer.invalidate();
      } else {
        type.forEach((value) => renderer.invalidate(value));
      }
      renderer.validateNow();
    });
    this.invalidate("data");
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

  public abstract scrollToPage(index: number): void;

  public scrollPageUp(): void {
    this.scrollTo(
      this.verticalScrollPosition - this.pageHeight,
      this.horizontalScrollPosition,
    );
  }

  public scrollPageDown(): void {
    this.scrollTo(
      this.verticalScrollPosition + this.pageHeight,
      this.horizontalScrollPosition,
    );
  }

  public scrollRowUp(): void {
    this.scrollTo(
      this.verticalScrollPosition - this.rowHeight - this.verticalGap,
      this.horizontalScrollPosition,
    );
  }

  public scrollRowDown(): void {
    this.scrollTo(
      this.verticalScrollPosition + this.rowHeight + this.verticalGap,
      this.horizontalScrollPosition,
    );
  }

  public scrollTo(verticalPosition: number, horizontalPosition: number) {
    verticalPosition = Math.min(Math.max(0, verticalPosition), this.maxVerticalScrollPosition);
    horizontalPosition = Math.min(Math.max(0, horizontalPosition), this.maxHorizontalScrollPosition);

    if (verticalPosition === this.verticalScrollPosition && horizontalPosition === this.horizontalScrollPosition) {
      return;
    }

    if (this._animated) {
      const distance = Math.sqrt(
        Math.pow(this.verticalScrollPosition - verticalPosition, 2) +
        Math.pow(this.horizontalScrollPosition - horizontalPosition, 2),
      );
      const duration = this._pageScrollDuration / this.pageHeight * distance;
      gsap.to(this,
        {
          verticalScrollPosition: verticalPosition,
          horizontalScrollPosition: horizontalPosition,
          duration,
          ease: "power2.out",
        });
    } else {
      this.verticalScrollPosition = verticalPosition;
      this.horizontalScrollPosition = horizontalPosition;
    }
  }

  public destroy(): void {
    gsap.killTweensOf(this);
    super.destroy();
  }

  protected calculateAvailableHeight() {
    return this._componentHeight - this._contentPadding * 2;
  }

  protected calculateAvailableWidth() {
    return this._componentWidth - this._contentPadding * 2;
  }

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
    if (this.isInvalid("scroll") || this.isInvalid("data") || this.isInvalid("size")) {
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
    rect.width = this._componentWidth;
    rect.height = this._componentHeight;

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
