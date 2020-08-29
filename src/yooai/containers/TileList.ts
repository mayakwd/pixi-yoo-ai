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

  public get columnsCount(): number {
    return this._columnsCount;
  }

  public get maxHorizontalScrollPosition(): number {
    return Math.max(this.contentWidth - this.componentWidth, 0);
  }

  public get maxVerticalScrollPosition(): number {
    return Math.max(this.contentHeight - this.componentHeight, 0);
  }

  public get rowsCount(): number {
    return this._rowsCount;
  }

  protected _columnWidth: number = 80;
  protected _columnsCount: number = 0;
  protected _horizontalGap: number = 0;
  protected _direction: Direction = "vertical";

  public constructor(
    parent?: Container,
    dataProvider?: DataProvider<T>,
    x?: number, y?: number, width?: number, height?: number,
  ) {
    super(parent, dataProvider, x, y, width, height);
  }

  public get availableRowsCount(): number {
    if (this.columnsCount === 0) {
      return 0;
    }
    return Math.ceil(this.length / this.columnsCount);
  }

  public get availableColumnsCount(): number {
    if (this.rowsCount === 0) {
      return 0;
    }
    return Math.ceil(this.length / this.rowsCount);
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

  public scrollToPage(index: number, animated: boolean = true): void {
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

  public scrollPageUp(animated: boolean = true): void {
    this.scrollBy(
      this.direction === "horizontal" ? 0 : -this.pageWidth,
      this.direction === "vertical" ? 0 : -this.pageHeight,
      animated,
    );
  }

  public scrollPageDown(animated: boolean = true): void {
    this.scrollBy(
      this.direction === "horizontal" ? 0 : this.pageWidth,
      this.direction === "vertical" ? 0 : this.pageHeight,
      animated,
    );
  }

  public scrollRowUp(animated: boolean = true): void {
    this.scrollBy(
      this.direction === "horizontal" ? 0 : -this.columnWidth,
      this.direction === "vertical" ? 0 : -this.rowHeight,
      animated,
    );
  }

  public scrollRowDown(animated: boolean = true): void {
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

  protected draw(): void {
    if (this.isInvalid("size") || this.isInvalid("data")) {
      const columnsCount = this.columnsCount;
      const itemsCount = this.dataProvider?.length ?? 0;
      this._contentWidth =
        Math.max(columnsCount * (this.columnWidth + this.horizontalGap) - this.horizontalGap, 0);
      this._contentHeight =
        Math.max(Math.ceil(itemsCount / columnsCount) * (this.rowHeight + this.verticalGap), 0);
    }

    super.draw();
  }

  protected calculateDrawListIndexes(): { startIndex: number; endIndex: number } {
    let startIndex = -1;
    let endIndex = -1;
    if (this._dataProvider !== undefined) {
      switch (this._direction) {
        case "vertical":
          const columnsCount = this.columnsCount;
          startIndex = Math.floor(this._verticalScrollPosition / (this.rowHeight + this.verticalGap)) * columnsCount;
          endIndex = Math.min(this._dataProvider.length, startIndex + (this.rowsCount + 1) * columnsCount);
          break;
        case "horizontal":
          const rowsCount = this.rowsCount;
          startIndex = Math.floor(this._horizontalScrollPosition / (this.columnWidth + this.horizontalGap)) * rowsCount;
          endIndex = Math.min(this._dataProvider.length, startIndex + (this.columnsCount + 1) * rowsCount);
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
      case "vertical":
        return Math.ceil(this.availableRowsCount / this.pageSize);
      case "horizontal":
        return Math.ceil(this.availableColumnsCount / this.pageSize);
    }
  }

  protected layoutRenderer(renderer: ItemRenderer<T>, index: number, startIndex: number, endIndex: number) {
    renderer.index = index;
    let column: number;
    let row: number;

    switch (this._direction) {
      case "vertical":
        const columnsCount = this.columnsCount;
        column = (index - startIndex) % columnsCount;
        row = Math.floor((index - startIndex) / columnsCount);
        break;
      case "horizontal":
        const rowsCount = this.rowsCount;
        column = Math.floor((index - startIndex) / rowsCount);
        row = (index - startIndex) % rowsCount;
        break;
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
        const availableHeight = this.calculateAvailableHeight() + this.verticalGap;
        this._columnsCount = Math.ceil(this.calculateAvailableWidth() / paddedColumnWidth);
        this._rowsCount = Math.floor(availableHeight / paddedRowHeight);
        this._contentWidth = Math.max(this.availableColumnsCount * paddedColumnWidth, 0);
        this._contentHeight = this.calculateAvailableHeight();
        break;
      case "vertical":
        const availableWidth = this.calculateAvailableWidth() + this.horizontalGap;
        this._rowsCount = Math.ceil(this.calculateAvailableHeight() / paddedRowHeight);
        this._columnsCount = Math.floor(availableWidth / paddedColumnWidth);
        this._contentWidth = this.calculateAvailableWidth();
        this._contentHeight = Math.max(this.availableRowsCount * paddedRowHeight, 0);
        break;
    }
  }
}
