import { Texture } from '@pixi/core';
import { ILoaderMiddleware } from '@pixi/loaders';
import { TextStyle } from '@pixi/text';
import { DisplayObjectWithSize } from '../display/DisplayObjectWithSize';

export class Theme {
  public defaultTextStyle: TextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: '14',
    fill: 0xffffff
  });

  public loaderPreMiddleware?: ILoaderMiddleware = undefined;
  public loaderMiddleware?: ILoaderMiddleware = undefined;
  public cacheProvider?: (url: string) => Texture | undefined = undefined;
  public defaultPreloaderFactory?: () => DisplayObjectWithSize;
  public defaultPreloaderUpdater?: (preloader: DisplayObjectWithSize, progress: number) => void;
}

export const theme = new Theme();
