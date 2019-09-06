import {TextStyle} from "pixi.js";

export class Theme {
  public defaultTextStyle: TextStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: "14",
    fill: 0xFFFFFF,
  });
}

export const theme = new Theme();
