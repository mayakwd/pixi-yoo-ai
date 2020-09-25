import {Container, InteractionEvent} from "pixi.js";
import {DataProvider, invalidate, ItemRenderer, ListEvent} from "../..";
import {VirtualScrollList} from "./VirtualScrollList";

export class List<T> extends VirtualScrollList<T> {
  @invalidate("data")
  public set enabledPredicate(value: ((data: T | undefined, dataProvider: DataProvider<T>) => boolean) | undefined) {
    this._enabledPredicate = value;
  }

  public set rowsCount(value: number) {
    value = Math.max(1, value);
    this.componentHeight = (this.verticalGap + this.rowHeight) * value - this.verticalGap + this.contentPadding * 2;
  }

  public get rowsCount(): number {
    const paddedRowHeight = this.rowHeight + this.verticalGap;
    return Math.max(1, Math.ceil((this.innerHeight + this.verticalGap) / paddedRowHeight));
  }

  public get enabledPredicate(): ((data: T | undefined, dataProvider: DataProvider<T>) => boolean) | undefined {
    return this._enabledPredicate;
  }

  public get labelEmitter(): ((data?: T) => string) | undefined {
    return this._labelEmitter;
  }

  @invalidate("data")
  public set labelEmitter(value: ((data?: T) => string) | undefined) {
    this._labelEmitter = value;
  }

  public get maxHorizontalScrollPosition(): number {
    return Math.max(0, this.contentWidth - this.innerWidth);
  }

  public get maxVerticalScrollPosition(): number {
    return Math.max(0, this.contentHeight - this.innerHeight);
  }

  protected _labelEmitter?: ((data?: T) => string);
  protected _enabledPredicate?: ((data: T | undefined, dataProvider: DataProvider<T>) => boolean);

  public constructor(
    parent?: Container,
    dataProvider?: DataProvider<T>,
    x?: number, y?: number,
    width?: number, height?: number,
  ) {
    super(parent, dataProvider, x, y, width, height);
  }

  public scrollToIndex(index: number, animated: boolean = true): void {
    this.scrollTo(
      index * (this.rowHeight + this.verticalGap),
      this.horizontalScrollPosition,
    );
  }

  public scrollToPage(index: number, animated: boolean = true): void {
    this.scrollTo(
      this.pageHeight * index,
      this.horizontalScrollPosition,
    );
  }

  protected draw(): void {
    if (this.isInvalid("size") || this.isInvalid("data")) {
      this.validateContentSize();
    }
    super.draw();
  }

  protected drawList(): void {
    this.drawScroll();

    const {startIndex, endIndex} = this.calculateDrawListIndexes();
    const itemToRendererMap = this.revokeActiveRenderers();

    if (this._dataProvider !== undefined) {
      for (let i = startIndex; i < endIndex; i++) {
        const renderer = this.prepareRenderer(i, itemToRendererMap);

        renderer.index = i;

        this.layoutRenderer(renderer, i, startIndex, endIndex);

        renderer.labelEmitter = this.labelEmitter;
        renderer.selected = (this._selectedIndices.indexOf(i) !== -1);
        renderer.enabled = this._enabledPredicate !== undefined ? this._enabledPredicate(renderer.data, this.dataProvider) : true;
        renderer.validateNow();

        this._list.addChild(renderer);
      }
    }
  }

  protected drawScroll() {
    this._horizontalScrollPosition = Math.min(this._horizontalScrollPosition, this.maxHorizontalScrollPosition);
    this._verticalScrollPosition = Math.min(this._verticalScrollPosition, this.maxVerticalScrollPosition);

    this._list.x = this._contentPadding - this._horizontalScrollPosition;
    this._list.y = this._contentPadding - this._verticalScrollPosition % (this.rowHeight + this.verticalGap);
  }

  protected calculateDrawListIndexes(): { startIndex: number, endIndex: number } {
    let startIndex = -1;
    let endIndex = -1;
    if (this._dataProvider !== undefined) {
      startIndex = Math.floor(this._verticalScrollPosition / (this.rowHeight + this.verticalGap));
      endIndex = Math.min(this._dataProvider.length, startIndex + this.rowsCount + 1);
    }
    return {startIndex, endIndex};
  }

  protected revokeActiveRenderers(): Map<T, ItemRenderer<T>> {
    const itemToRendererMap = new Map<T, ItemRenderer<T>>();
    while (this._activeRenderers.length > 0) {
      const renderer = this._activeRenderers.pop()!;
      const item = renderer.data;
      if (item === undefined || this._invalidItems.has(item)) {
        this._availableRenderers.push(renderer);
      } else {
        itemToRendererMap.set(item, renderer);
      }
      this._list.removeChild(renderer);
    }
    this._invalidItems.clear();
    return itemToRendererMap;
  }

  protected prepareRenderer(itemIndex: number, itemToRendererMap: Map<T, ItemRenderer<T>>) {
    let renderer: ItemRenderer<T> | undefined;
    let reused: boolean = false;
    const item = this._dataProvider!.getItemAt(itemIndex);
    if (itemToRendererMap.has(item)) {
      reused = true;
      renderer = itemToRendererMap.get(item);
      itemToRendererMap.delete(item);
    } else if (this._availableRenderers.length > 0) {
      renderer = this._availableRenderers.pop();
    }
    if (renderer === undefined) {
      renderer = new this._rendererClass();
      this.addRendererListeners(renderer);
    }
    this._activeRenderers.push(renderer);

    if (!reused) {
      renderer.data = item;
    }
    return renderer;
  }

  protected layoutRenderer(renderer: ItemRenderer<T>, index: number, startIndex: number, endIndex: number) {
    renderer.y = (this.rowHeight + this.verticalGap) * (index - startIndex);
    renderer.resize(this.innerWidth, this.rowHeight);
  }

  protected addRendererListeners(renderer: ItemRenderer<T>) {
    this._rendererEvents.addTarget(renderer);
    renderer.on("pointertap", this.handleItemClick, this);
  }

  protected handleItemClick(event: InteractionEvent) {
    if (!this._enabled) { return; }
    if (event.target instanceof ItemRenderer) {
      if (!event.target.enabled) { return; }
      const dataItemIndex = event.target.index;
      this.emit(ListEvent.ITEM_CLICK, new ListEvent(event.target.data, dataItemIndex));
      if (!this._selectable) { return; }

      const index = this._selectedIndices.indexOf(dataItemIndex);
      if (index !== -1) {
        if (this._allowMultipleSelection) {
          this._selectedIndices.splice(index, 1);
        } else {
          this._selectedIndices.length = 0;
        }
      } else {
        if (this._allowMultipleSelection && (this._maxSelectedItemsCount <= 0 || (this._selectedIndices.length < this._maxSelectedItemsCount))) {
          this._selectedIndices[this._selectedIndices.length] = dataItemIndex;
        } else {
          this._selectedIndices[0] = dataItemIndex;
        }
      }
      this.invalidate("data");
      this.emit(ListEvent.SELECTION_CHANGE);
    }
  }

  protected validateContentSize() {
    const paddedRowHeight = this.rowHeight + this.verticalGap;

    this._contentWidth = this.innerWidth;
    this._contentHeight = Math.max(this.length * paddedRowHeight - this.verticalGap, 0);
  }
}
