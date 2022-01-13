import { isAbstractComponent } from '../layout/utils';
import { AbstractComponent } from './AbstractComponent';
import { InvalidationType } from './InvalidationType';

export function invalidate(invalidationType: InvalidationType) {
  return function <T>(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const { set, get } = descriptor;
    if (set !== undefined) {
      if (get === undefined) {
        throw new Error(`To get proper invalidation the getter for "${propertyKey}" must be defined`);
      }
      descriptor.set = function (this: AbstractComponent, value: T) {
        if (get.call(this) === value) {
          return;
        }
        set.call(this, value);
        this.invalidate(invalidationType);
      };
    } else if (get !== undefined) {
      throw new Error(
        `You can invalidate property ${propertyKey}, it has only getter. Invalidation decorator must be applied to setter`
      );
    } else if (typeof descriptor.value === 'function') {
      const originalMethod = descriptor.value;
      descriptor.value = function (this: AbstractComponent, ...args: unknown[]): T {
        if (!isAbstractComponent(this)) {
          throw new Error("Object is not a component, it's can't be invalidated");
        }
        const result = originalMethod.call(this, ...args);
        this.invalidate(invalidationType);
        return result;
      };
    }
  };
}
