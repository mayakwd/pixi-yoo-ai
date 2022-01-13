import { IPoint } from './IPoint';

export interface IHasDimensions extends Partial<IPoint> {
  width: number;
  height: number;
}
