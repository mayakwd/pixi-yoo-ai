export class ListEvent<T> {
  public static readonly ITEM_CLICK = "itemClick";
  public static readonly SELECTION_CHANGE = "selectionChange";

  public constructor(
    public readonly item: T,
    public readonly index: number,
  ) { }

}
