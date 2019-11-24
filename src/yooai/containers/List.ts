import {Container} from "pixi.js";
import {DataProvider, invalidate, ItemRenderer} from "../..";
import {ListEvent} from "../..";
import {VirtualScrollList} from "./VirtualScrollList";
import InteractionEvent = PIXI.interaction.InteractionEvent;

export class List<T> extends VirtualScrollList<T> {
  public get labelEmitter(): ((data?: T) => string) | undefined {
    return this._labelEmitter;
  }

  @invalidate("data")
  public set labelEmitter(value: ((data?: T) => string) | undefined) {
    this._labelEmitter = value;
  }

  public get maxHorizontalScrollPosition(): number {
    return Math.max(this.contentWidth - this.width + this.contentPadding * 2, 0);
  }

  public get maxVerticalScrollPosition(): number {
    return Math.max(0, this.contentHeight - this.height + this.contentPadding * 2);
  }

  public get rowsCount(): number {
    return this._rowsCount;
  }

  protected _rowsCount: number = 0;
  protected _labelEmitter?: ((data?: T) => string);

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
      animated,
    );
  }

  public scrollToPage(index: number, animated: boolean = true): void {
    this.scrollTo(
      this.pageHeight * index,
      this.horizontalScrollPosition,
      animated,
    );
  }

  protected draw(): void {
    if (this.isInvalid("size")) {
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
        renderer.drawNow();
      }
    }
  }

  protected drawScroll() {
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
      if (item === undefined || !this._invalidItems.has(item)) {
        this._availableRenderers.push(renderer);
      } else {
        itemToRendererMap.set(item, renderer);
        this._invalidItems.add(item);
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
    this._list.addChild(renderer);
    this._activeRenderers.push(renderer);

    if (!reused) {
      renderer.data = item;
    }
    return renderer;
  }

  protected layoutRenderer(renderer: ItemRenderer<T>, index: number, startIndex: number, endIndex: number) {
    renderer.y = (this.rowHeight + this.verticalGap) * (index - startIndex);
    renderer.resize(this.calculateAvailableWidth(), this.rowHeight);
  }

  protected addRendererListeners(renderer: ItemRenderer<T>) {
    this._rendererEvents.addTarget(renderer);
    renderer.on("pointertap", this.handleItemClick, this);
  }

  protected handleItemClick(event: InteractionEvent) {
    if (!this._enabled) { return; }
    if (event.target instanceof ItemRenderer) {
      this.emit(ListEvent.ITEM_CLICK, new ListEvent(event.target.data, event.target.index));
      if (!this._selectable) { return; }

      if (this.selectedIndex !== event.target.index) {
        this.selectedIndex = event.target.index;
        this.emit(ListEvent.SELECTION_CHANGE);
      }
    }
  }

  public get availableRowsCount(): number {
    return this.length;
  }

  protected validateContentSize() {
    const paddedRowHeight = this.rowHeight + this.verticalGap;
    this._contentWidth = this.calculateAvailableWidth();
    this._contentHeight = Math.max(this.availableRowsCount * (paddedRowHeight), 0);
    this._rowsCount = Math.ceil(this.calculateAvailableHeight() / paddedRowHeight);
  }
}
