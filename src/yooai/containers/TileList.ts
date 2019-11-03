import {Container} from "pixi.js";
import {DataProvider} from "../data/DataProvider";
import {VirtualScrollList} from "./VirtualScrollList";

export class TileList<T> extends VirtualScrollList<T> {
  constructor(parent?: Container, dataProvider?: DataProvider<T>, x?: number, y?: number, width?: number, height?: number) {
    super(parent, dataProvider, x, y, width, height);
  }

  public scrollToIndex(index: number): void {
    // TODO
  }

  protected drawList(): void {

  }

}
