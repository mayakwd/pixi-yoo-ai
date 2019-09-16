import {IHasDimensions} from "./IHasDimensions";
import {ScaleMode} from "./ScaleMode";

interface IBasicScaleOptions {
  size: IHasDimensions;
  snapToPixel?: boolean;
  allowEnlarge?: boolean;
}

export interface IScaleOptionsWithArea extends IBasicScaleOptions {
  fitArea: IHasDimensions;
}

export interface IScaleOptions extends IScaleOptionsWithArea {
  scaleMode: ScaleMode;
}

export class RatioUtil {
  public static scale(options: IScaleOptions, result?: IHasDimensions): IHasDimensions {
    const {size, fitArea, scaleMode, snapToPixel = true} = options;
    switch (scaleMode) {
      case ScaleMode.FIT:
        return RatioUtil.scaleToFit({size, fitArea, snapToPixel}, result);
      case ScaleMode.FILL:
        return RatioUtil.scaleToFill({size, fitArea, snapToPixel}, result);
    }
  }

  public static widthToHeightRatio(size: IHasDimensions): number {
    return size.width / size.height;
  }

  public static heightToWidthRatio(size: IHasDimensions): number {
    return size.height / size.width;
  }

  public static scaleToFill(options: IScaleOptionsWithArea, result?: IHasDimensions): IHasDimensions {
    const {size, fitArea} = options;
    const scaleRatio = Math.max(fitArea.width / size.width, fitArea.height / size.height);
    return this.scaleByRatio(options, scaleRatio, result);
  }

  public static scaleToFit(options: IScaleOptionsWithArea, result?: IHasDimensions): IHasDimensions {
    const {size, fitArea} = options;
    const scaleRatio = Math.min(fitArea.width / size.width, fitArea.height / size.height);
    return this.scaleByRatio(options, scaleRatio, result);
  }

  private static scaleByRatio(options: IScaleOptionsWithArea, scaleRatio: number, result?: IHasDimensions) {
    const {size, snapToPixel = true, allowEnlarge = false} = options;
    if (result === undefined) { result = {...size}; }
    if (!allowEnlarge) { scaleRatio = Math.min(1, scaleRatio); }
    result.width *= scaleRatio;
    result.height *= scaleRatio;
    return snapToPixel ? RatioUtil.roundSize(result) : result;
  }

  private static roundSize(size: IHasDimensions): IHasDimensions {
    size.width = Math.round(size.width);
    size.height = Math.round(size.height);
    return size;
  }
}
