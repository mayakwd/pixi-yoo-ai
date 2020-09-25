import {Container} from "pixi.js";
import {DataProvider, invalidate, ItemRenderer} from "../..";
import {Direction} from "../layout/Direction";
import {List} from "./List";

export class TileList<T> extends List<T> {
  public get direction(): Direction {
    return this._direction;
  }

  @invalidate("size")
  public set direction(value: Direction) {
    this._direction = value;
  }

  public get horizontalGap(): number {
    return this._horizontalGap;
  }

  @invalidate("size")
  public set horizontalGap(value: number) {
    this._horizontalGap = value;
  }

  public get columnWidth(): number {
    return this._columnWidth;
  }

  @invalidate("size")
  public set columnWidth(value: number) {
    this._columnWidth = value;
  }

  protected _columnWidth = 80;
  protected _horizontalGap = 0;
  protected _direction: Direction = "vertical";

  public constructor(parent?: Container, dataProvider?: DataProvider<T>, x?: number, y?: number, width?: number, height?: number) {
    super(parent, dataProvider, x, y, width, height);
  }

  public get columnsCount(): number {
    const paddedColumnWidth = this.columnWidth + this.horizontalGap;
    return Math.max(1, Math.ceil((this.innerWidth + this.horizontalGap) / paddedColumnWidth));
  }

  public set columnsCount(value: number) {
    value = Math.max(1, value);
    this.componentWidth = (this.horizontalGap + this.columnWidth) * value - this.horizontalGap + this.contentPadding * 2;
  }

  public scrollToIndex(index: number): void {
    let verticalPosition: number = this.verticalScrollPosition;
    let horizontalPosition: number = this.horizontalScrollPosition;
    switch (this._direction) {
      case "vertical":
        verticalPosition = Math.floor(index / this.columnsCount) * (this.rowHeight + this.verticalGap);
        break;
      case "horizontal":
        horizontalPosition = Math.floor(index / this.rowsCount) * (this.columnWidth + this.horizontalGap);
        break;
    }
    this.scrollTo(verticalPosition, horizontalPosition);
  }

  public scrollToPage(index: number, animated = true): void {
    let verticalPosition: number = this.verticalScrollPosition;
    let horizontalPosition: number = this.horizontalScrollPosition;
    switch (this._direction) {
      case "vertical":
        verticalPosition = this.pageHeight * index;
        break;
      case "horizontal":
        horizontalPosition = this.pageWidth * index;
        break;
    }
    this.scrollTo(verticalPosition, horizontalPosition);
  }

  public scrollPageUp(animated = true): void {
    this.scrollBy(
      this.direction === "horizontal" ? 0 : -this.pageWidth,
      this.direction === "vertical" ? 0 : -this.pageHeight,
      animated,
    );
  }

  public scrollPageDown(animated = true): void {
    this.scrollBy(
      this.direction === "horizontal" ? 0 : this.pageWidth,
      this.direction === "vertical" ? 0 : this.pageHeight,
      animated,
    );
  }

  public scrollRowUp(animated = true): void {
    this.scrollBy(
      this.direction === "horizontal" ? 0 : -this.columnWidth,
      this.direction === "vertical" ? 0 : -this.rowHeight,
      animated,
    );
  }

  public scrollRowDown(animated = true): void {
    this.scrollBy(
      this.direction === "horizontal" ? 0 : this.columnWidth,
      this.direction === "vertical" ? 0 : this.rowHeight,
      animated,
    );
  }

  protected scrollBy(verticalOffset: number, horizontalOffset: number, animated: boolean) {
    const verticalPosition: number = this.verticalScrollPosition + verticalOffset;
    const horizontalPosition: number = this.horizontalScrollPosition + horizontalOffset;
    this.scrollTo(verticalPosition, horizontalPosition);
  }

  protected calculateDrawListIndexes(): { startIndex: number; endIndex: number } {
    let startIndex = -1;
    let endIndex = -1;
    if (this._dataProvider !== undefined) {
      switch (this._direction) {
        case "vertical":
          startIndex = Math.floor(this._verticalScrollPosition / (this.rowHeight + this.verticalGap)) * this.columnsCount;
          endIndex = Math.min(this._dataProvider.length, startIndex + (this.rowsCount + 1) * this.columnsCount);
          break;
        case "horizontal":
          startIndex = Math.floor(this._horizontalScrollPosition / (this.columnWidth + this.horizontalGap)) * this.rowsCount;
          endIndex = Math.min(this._dataProvider.length, startIndex + (this.columnsCount + 1) * this.rowsCount);
          break;
      }
    }
    return {startIndex, endIndex};
  }

  protected drawScroll() {
    let verticalPosition = this.verticalScrollPosition;
    let horizontalPosition = this.horizontalScrollPosition;
    switch (this._direction) {
      case "vertical":
        verticalPosition %= this.rowHeight + this.verticalGap;
        break;
      case "horizontal":
        horizontalPosition %= this.columnWidth + this.horizontalGap;
        break;
    }
    this._list.x = this._contentPadding - horizontalPosition;
    this._list.y = this._contentPadding - verticalPosition;
  }

  protected get pageWidth(): number {
    switch (this._direction) {
      case "vertical":
        return this._contentWidth;
      case "horizontal":
        return this.pageSize * (this.columnWidth + this.horizontalGap);
    }
  }

  protected get pageHeight(): number {
    switch (this._direction) {
      case "vertical":
        return this.pageSize * (this.rowHeight + this.verticalGap);
      case "horizontal":
        return this._contentHeight;
    }
  }

  public get pagesCount(): number {
    switch (this._direction) {
      case "vertical": {
        const paddedRowHeight = this.rowHeight + this.verticalGap;
        return Math.ceil(this.contentHeight / paddedRowHeight / this.pageSize);
      }
      case "horizontal": {
        const paddedColumnWidth = this.columnWidth + this.horizontalGap;
        return Math.ceil(this.contentWidth / paddedColumnWidth / this.pageSize);
      }
    }
  }

  protected layoutRenderer(renderer: ItemRenderer<T>, index: number, startIndex: number, endIndex: number) {
    renderer.index = index;
    let column: number;
    let row: number;

    switch (this.direction) {
      case "vertical": {
        const columnsCount = this.columnsCount;
        column = (index - startIndex) % columnsCount;
        row = Math.floor((index - startIndex) / columnsCount);
        break;
      }
      case "horizontal": {
        const rowsCount = this.rowsCount;
        column = Math.floor((index - startIndex) / rowsCount);
        row = (index - startIndex) % rowsCount;
        break;
      }
    }

    renderer.x = column * (this.columnWidth + this.horizontalGap);
    renderer.y = row * (this.rowHeight + this.verticalGap);
    renderer.resize(this.columnWidth, this.rowHeight);
  }

  protected validateContentSize() {
    const paddedRowHeight = this.rowHeight + this.verticalGap;
    const paddedColumnWidth = this.columnWidth + this.horizontalGap;
    switch (this._direction) {
      case "horizontal":
        this._contentWidth = Math.max(0, paddedColumnWidth * Math.ceil(this.length / this.rowsCount) - this.horizontalGap);
        this._contentHeight = Math.max(0, paddedRowHeight * this.rowsCount - this.verticalGap);
        break;
      case "vertical":
        this._contentWidth = Math.max(0, paddedColumnWidth * this.columnsCount - this.horizontalGap);
        this._contentHeight = Math.max(0, paddedRowHeight * Math.ceil(this.length / this.columnsCount) - this.verticalGap);
        break;
    }
  }
}
