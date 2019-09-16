// tslint:disable
import {InvalidationType} from "./InvalidationType";

export function invalidate(invalidationType: InvalidationType) {
  return function <T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    const set = descriptor.set;
    if (set !== undefined) {
      descriptor.set = function(value: T) {
        // @ts-ignore
        if (this[propertyKey] === value) {
          return;
        }
        set.call(this, value);
        // @ts-ignore
        this.invalidate(invalidationType);
      };
    }
  };
}
