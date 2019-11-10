export class ListEvent<T> {
  public static readonly ITEM_CLICK = "itemClick";

  public constructor(
    public readonly item: T,
    public readonly index: number,
  ) { }

}
