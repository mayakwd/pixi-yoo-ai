import {Component, IHasDimensions} from "../..";
import {AbstractComponent} from "../core/AbstractComponent";
import {DisplayObjectWithSize} from "../display/DisplayObjectWithSize";

export function isComponent(item: unknown): item is Component {
  return item instanceof Component;
}

export function isAbstractComponent(item: unknown): item is AbstractComponent {
  return item instanceof AbstractComponent;
}

export function getWidth(item: IHasDimensions | DisplayObjectWithSize): number {
  if (isComponent(item)) {
    return item.componentWidth;
  }
  return item.width;
}

export function getHeight(item: IHasDimensions | DisplayObjectWithSize): number {
  if (isComponent(item)) {
    return item.componentHeight;
  }
  return item.height;
}
