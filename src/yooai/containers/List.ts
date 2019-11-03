import {Container} from "pixi.js";
import {invalidate, ItemRenderer} from "../..";
import {DataProvider} from "../data/DataProvider";
import {VirtualScrollList} from "./VirtualScrollList";

export class List<T> extends VirtualScrollList<T> {
  constructor(parent?: Container, dataProvider?: DataProvider<T>, x?: number, y?: number, width?: number, height?: number) {
    super(parent, dataProvider, x, y, width, height);
  }

  public get labelEmitter(): ((data?: T) => string) | undefined {
    return this._labelEmitter;
  }

  @invalidate("data")
  public set labelEmitter(value: ((data?: T) => string) | undefined) {
    this._labelEmitter = value;
  }

  private _labelEmitter?: ((data?: T) => string);

  protected drawList(): void {
    const rowHeight = this.rowHeight;

    this._list.x = this._contentPadding;
    this._list.y = this._contentPadding - this._verticalScrollPosition % rowHeight;

    let startIndex = -1;
    let endIndex = -1;

    if (this._dataProvider !== undefined) {
      startIndex = Math.floor(this._verticalScrollPosition / rowHeight);
      endIndex = Math.min(this._dataProvider.length, startIndex + this.rowsCount + 1);
    }

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

    if (this._dataProvider !== undefined) {
      let renderer: ItemRenderer<T> | undefined;
      for (let i = startIndex; i < endIndex; i++) {
        let reused: Boolean = false;
        let item = this._dataProvider.getItemAt(i);
        if (itemToRendererMap.has(item)) {
          reused = true;
          renderer = itemToRendererMap.get(item);
          itemToRendererMap.delete(item);
        } else if (this._availableRenderers.length > 0) {
          renderer = this._availableRenderers.pop();
        }
        if (renderer === undefined) {
          renderer = new this._rendererClass();
          // renderer.on("tap", this.handleRendererClick, this);
          // renderer.on("pointerover", this.handlerRendererOver, this);
          // renderer.on("pointerout", this.handleRendererOut, this);
        }
        this._list.addChild(renderer);
        this._activeRenderers.push(renderer);

        renderer.y = rowHeight * (i - startIndex);
        renderer.resize(this.calculateAvailableWidth(), rowHeight);

        if (!reused) {
          renderer.data = item;
        }
        renderer.labelEmitter = this.labelEmitter;
        renderer.selected = (this._selectedIndices.indexOf(i) != -1);
        renderer.drawNow();
      }
    }
  }

  public get rowsCount(): number {
    return Math.ceil(this.calculateAvailableHeight() / (this.rowHeight + this.rowSpacing));
  }

  public scrollToIndex(index: number): void {
  }

  private calculateAvailableHeight() {
    return this._height - this._contentPadding * 2;
  }

  private calculateAvailableWidth() {
    return this._width - this._contentPadding * 2;
  }
}
