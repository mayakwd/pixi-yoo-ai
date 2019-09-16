import {RatioUtil} from "../../src/yooai/layout/RatioUtil";
import {ScaleMode} from "../../src/yooai/layout/ScaleMode";

describe("RatioUtil", () => {
  it("Ratio width to height", () => {
    const ratio = RatioUtil.widthToHeightRatio({width: 100, height: 50});
    expect(ratio).toBe(2);
  });

  it("Ratio height to width", () => {
    const ratio = RatioUtil.heightToWidthRatio({width: 100, height: 50});
    expect(ratio).toBe(0.5);
  });

  it("Scale to fit", () => {
    const fitArea = {width: 100, height: 100};
    const size = {width: 200, height: 120};
    const result = RatioUtil.scale({size, fitArea: fitArea, scaleMode: ScaleMode.FIT});
    expect(result.width).toBe(100);
    expect(result.height).toBe(60);
  });

  it("Scale to fit should not enlarge size", () => {
    const fitArea = {width: 100, height: 100};
    const size = {width: 50, height: 50};
    const result = RatioUtil.scaleToFit({size, fitArea: fitArea});
    expect(result.width).toBe(50);
    expect(result.height).toBe(50);
  });

  it("Scale to fit should enlarge size", () => {
    const fitArea = {width: 100, height: 100};
    const size = {width: 50, height: 50};
    const result = RatioUtil.scaleToFit({size, fitArea: fitArea, allowEnlarge: true});
    expect(result.width).toBe(100);
    expect(result.height).toBe(100);
  });

  it("Scale to fill", () => {
    const fitArea = {width: 100, height: 100};
    const size = {width: 200, height: 175};
    const result = RatioUtil.scale({size, fitArea: fitArea, scaleMode: ScaleMode.FILL});
    expect(result.width).toBe(114);
    expect(result.height).toBe(100);
  });

  it("Scale to fill should not enlarge size", () => {
    const fitArea = {width: 100, height: 100};
    const size = {width: 50, height: 50};
    const result = RatioUtil.scaleToFill({size, fitArea: fitArea});
    expect(result.width).toBe(50);
    expect(result.height).toBe(50);
  });

  it("Scale to fill should enlarge size", () => {
    const fitArea = {width: 100, height: 100};
    const size = {width: 50, height: 50};
    const result = RatioUtil.scaleToFill({size, fitArea: fitArea, allowEnlarge: true});
    expect(result.width).toBe(100);
    expect(result.height).toBe(100);
  });
});
