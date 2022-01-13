import { TextStyle } from '@pixi/text';

export class Theme {
  public defaultTextStyle: TextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: '14',
    fill: 0xffffff
  });
}

export const theme = new Theme();
