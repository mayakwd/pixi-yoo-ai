import { DisplayObjectWithSize } from '../display/DisplayObjectWithSize';
import { IHasDimensions } from './IHasDimensions';
import { ScaleMode } from './ScaleMode';
import { getHeight, getWidth, isComponent } from './utils';

interface IBasicScaleOptions {
  size: IHasDimensions | DisplayObjectWithSize;
  snapToPixel?: boolean;
  allowEnlarge?: boolean;
}

export interface IScaleOptionsWithArea extends IBasicScaleOptions {
  fitArea: IHasDimensions | DisplayObjectWithSize;
}

export interface IScaleOptions extends IScaleOptionsWithArea {
  scaleMode: ScaleMode;
}

export class RatioUtil {
  public static scale(options: IScaleOptions, result?: IHasDimensions): IHasDimensions {
    const { size, fitArea, scaleMode, snapToPixel = true } = options;
    switch (scaleMode) {
      case ScaleMode.FIT:
        return RatioUtil.scaleToFit({ size, fitArea, snapToPixel }, result);
      case ScaleMode.FILL:
        return RatioUtil.scaleToFill({ size, fitArea, snapToPixel }, result);
    }
  }

  public static widthToHeightRatio(size: IHasDimensions | DisplayObjectWithSize): number {
    const width = getWidth(size);
    const height = getHeight(size);
    return width / height;
  }

  public static heightToWidthRatio(size: IHasDimensions | DisplayObjectWithSize): number {
    const width = getWidth(size);
    const height = getHeight(size);
    return height / width;
  }

  public static scaleToFill(options: IScaleOptionsWithArea, result?: IHasDimensions): IHasDimensions {
    const { size, fitArea } = options;
    const fitWidth = getWidth(fitArea);
    const fitHeight = getHeight(fitArea);
    const width = getWidth(size);
    const height = getHeight(size);
    const scaleRatio = Math.max(fitWidth / width, fitHeight / height);
    return this.scaleByRatio(options, scaleRatio, result);
  }

  public static scaleToFit(options: IScaleOptionsWithArea, result?: IHasDimensions): IHasDimensions {
    const { size, fitArea } = options;
    const fitWidth = getWidth(fitArea);
    const fitHeight = getHeight(fitArea);
    const width = getWidth(size);
    const height = getHeight(size);
    const scaleRatio = Math.min(fitWidth / width, fitHeight / height);
    return this.scaleByRatio(options, scaleRatio, result);
  }

  private static scaleByRatio(
    options: IScaleOptionsWithArea,
    scaleRatio: number,
    result?: IHasDimensions | DisplayObjectWithSize
  ) {
    const { size, snapToPixel = true, allowEnlarge = false } = options;
    if (result === undefined) {
      result = { ...size };
    }
    if (!allowEnlarge) {
      scaleRatio = Math.min(1, scaleRatio);
    }
    if (isComponent(result)) {
      result.componentWidth *= scaleRatio;
      result.componentHeight *= scaleRatio;
    } else {
      result.width *= scaleRatio;
      result.height *= scaleRatio;
    }
    return snapToPixel ? RatioUtil.roundSize(result) : result;
  }

  private static roundSize(size: IHasDimensions | DisplayObjectWithSize): IHasDimensions {
    if (isComponent(size)) {
      size.componentWidth = Math.round(size.componentWidth);
      size.componentHeight = Math.round(size.componentHeight);
    } else {
      size.width = Math.round(size.width);
      size.height = Math.round(size.height);
    }
    return size;
  }
}
