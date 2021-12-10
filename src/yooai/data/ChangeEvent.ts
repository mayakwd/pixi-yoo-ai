import { ChangeType } from './ChangeType';

export class ChangeEvent<T> {
  public static readonly DATA_CHANGE: string = 'dataChange';

  constructor(
    public readonly changeType: ChangeType,
    public readonly items: ReadonlyArray<T>,
    public readonly startIndex: number,
    public readonly endIndex: number
  ) {}
}
