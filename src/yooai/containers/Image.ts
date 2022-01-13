import { Texture } from '@pixi/core';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Loader, LoaderResource } from '@pixi/loaders';
import { Rectangle } from '@pixi/math';
import { Sprite } from '@pixi/sprite';
import { HorizontalAlign, IHasDimensions, invalidate, IPoint, RatioUtil, ScaleMode, VerticalAlign } from '../..';
import { Pane } from './Pane';
import LOAD_TYPE = LoaderResource.LOAD_TYPE;

export class Image extends Pane {
  public get imageOffset(): IPoint | undefined {
    return this._imageOffset;
  }

  @invalidate('size')
  public set imageOffset(value: IPoint | undefined) {
    this._imageOffset = value;
  }

  public get imageMaskHAlign(): HorizontalAlign {
    return this._imageMaskHAlign;
  }

  @invalidate('size')
  public set imageMaskHAlign(value: HorizontalAlign) {
    this._imageMaskHAlign = value;
  }

  public get imageMaskVAlign(): VerticalAlign {
    return this._imageMaskVAlign;
  }

  @invalidate('size')
  public set imageMaskVAlign(value: VerticalAlign) {
    this._imageMaskVAlign = value;
  }

  public get imageMaskOffset(): IPoint | undefined {
    return this._imageMaskOffset;
  }

  @invalidate('size')
  public set imageMaskOffset(value: IPoint | undefined) {
    this._imageMaskOffset = value;
  }

  public get imageMask(): Graphics | Sprite | undefined {
    return this._imageMask;
  }

  @invalidate('state')
  public set imageMask(value: Graphics | Sprite | undefined) {
    this._imageMask = value;
  }

  public get imageMaskRect(): IHasDimensions | undefined {
    return this._imageMaskRect;
  }

  @invalidate('state')
  public set imageMaskRect(value: IHasDimensions | undefined) {
    this._imageMaskRect = value;
  }

  public get image(): Container | undefined {
    return this._image;
  }

  @invalidate('data')
  public set image(value: Container | undefined) {
    this.destroyImageLoader();
    this.destroyLoadedImage();
    this._image = value;
  }

  public get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  @invalidate('data')
  public set imageUrl(value: string | undefined) {
    this.destroyImageLoader();
    this.destroyLoadedImage();
    this._imageUrl = value;
  }

  public get placeHolder(): Graphics | Sprite | undefined {
    return this._placeHolder;
  }

  @invalidate('data')
  public set placeHolder(value: Graphics | Sprite | undefined) {
    this._placeHolder = value;
  }

  public get hAlign(): HorizontalAlign {
    return this._hAlign;
  }

  @invalidate('size')
  public set hAlign(value: HorizontalAlign) {
    this._hAlign = value;
  }

  public get vAlign(): VerticalAlign {
    return this._vAlign;
  }

  @invalidate('size')
  public set vAlign(value: VerticalAlign) {
    this._vAlign = value;
  }

  public get scaleMode(): ScaleMode {
    return this._scaleMode;
  }

  @invalidate('size')
  public set scaleMode(value: ScaleMode) {
    this._scaleMode = value;
  }

  protected _scaleMode: ScaleMode = ScaleMode.FILL;
  protected _vAlign: VerticalAlign = 'center';
  protected _hAlign: HorizontalAlign = 'center';
  protected _placeHolder?: Graphics | Sprite;
  protected _imageUrl?: string;
  protected _image?: Container;
  protected _imageOffset?: IPoint;

  protected _imageMaskRect?: IHasDimensions;
  protected _imageMask?: Graphics | Sprite;
  protected _imageMaskOffset?: IPoint;
  protected _imageMaskVAlign: VerticalAlign = 'center';
  protected _imageMaskHAlign: HorizontalAlign = 'center';

  protected _currentImage?: Container;
  protected _currentMask?: Graphics | Sprite;
  protected _rectMask?: Graphics;

  protected _loader?: Loader;
  protected _loadedImage?: Sprite;

  protected _sizeRect = new Rectangle();
  protected _imageSizeRect = new Rectangle();

  public constructor(parent?: Container, x: number = 0, y: number = 0, width: number = 100, height: number = 100) {
    super(parent, x, y, width, height);
  }

  protected draw(): void {
    if (this.isInvalid('size')) {
      this.updateSizeRect();
      if (this._rectMask !== undefined && this._currentMask === this._rectMask) {
        this.invalidate('state');
      }
    }
    if (this.isInvalid('data')) {
      this.drawImage();
      this.invalidate('state');
    }
    if (this.isInvalid('state')) {
      this.drawMask();
      this.invalidate('size');
    }
    super.draw();
  }

  protected drawImage() {
    let newImage: Container | undefined;
    if (this._loadedImage !== undefined) {
      newImage = this._loadedImage;
    } else if (this._image !== undefined) {
      newImage = this._image;
    } else if (this._imageUrl !== undefined) {
      newImage = this._placeHolder;
      this.loadImage();
    } else {
      newImage = this._placeHolder;
    }
    this._currentImage = this.updateSkin(this._currentImage, newImage);
  }

  protected drawMask() {
    this._currentMask = this.updateSkin(this._currentMask, this.getExistingOrDrawMask());
    if (this._currentMask !== undefined) {
      if (this._currentImage !== undefined) {
        this._currentImage.mask = this._currentMask;
        this._currentMask.visible = true;
      } else {
        this._currentMask.visible = false;
      }
    }
  }

  protected drawLayout() {
    this.drawImageLayout();
    this.drawMaskLayout();
    super.drawLayout();
  }

  protected drawImageLayout() {
    if (this._currentImage === undefined) {
      return;
    }

    this.scaleImage();
    this.alignChild(this._currentImage, this._vAlign, this._hAlign);
  }

  protected drawMaskLayout() {
    if (this._currentMask === undefined || !this._currentMask.visible) {
      return;
    }

    this.alignChild(this._currentMask, this._imageMaskVAlign, this._imageMaskHAlign, this._imageMaskOffset);
  }

  protected drawRectMask() {
    if (this._rectMask === undefined) {
      this._rectMask = new Graphics();
    }

    const rect = this._imageMaskRect || this._sizeRect;
    this._rectMask.clear();
    this._rectMask.beginFill(0xff0000, 1);
    this._rectMask.drawRect(rect.x || 0, rect.y || 0, rect.width, rect.height);
    this._rectMask.endFill();
  }

  protected scaleImage() {
    if (this._currentImage === undefined) {
      return;
    }

    this._imageSizeRect.width = this._currentImage.width;
    this._imageSizeRect.height = this._currentImage.height;

    RatioUtil.scale(
      {
        size: this._imageSizeRect,
        fitArea: this._sizeRect,
        scaleMode: this._scaleMode
      },
      this._imageSizeRect
    );
    this._currentImage.width = this._imageSizeRect.width;
    this._currentImage.height = this._imageSizeRect.height;
  }

  protected updateSizeRect() {
    this._sizeRect.x = 0;
    this._sizeRect.y = 0;
    this._sizeRect.width = this._componentWidth;
    this._sizeRect.height = this._componentHeight;
  }

  protected loadImage() {
    if (this._imageUrl !== undefined) {
      this._loader = new Loader();
      this._loader.add('image', this._imageUrl, { loadType: LOAD_TYPE.IMAGE });
      this._loader.load(this.onImageLoaded.bind(this));
    }
  }

  protected onImageLoaded(loader: Loader, resources: Partial<Record<string, LoaderResource>>) {
    if (resources.image !== undefined && resources.image.texture !== undefined) {
      const texture = resources.image.texture;
      Texture.removeFromCache(texture);
      this._loadedImage = new Sprite(texture);
      this.emit('imageLoaded', this._loadedImage);
      this.invalidate('data');
    } else {
      this.emit('imageLoaded', undefined);
    }
  }

  protected destroyLoadedImage() {
    if (this._loadedImage !== undefined) {
      this._loadedImage.destroy({ texture: true, baseTexture: true });
      this._loadedImage = undefined;
    }
  }

  protected destroyImageLoader() {
    if (this._loader !== undefined) {
      this._loader.destroy();
      this._loader = undefined;
    }
  }

  private getExistingOrDrawMask() {
    let mask: Graphics | Sprite | undefined;
    if (this._imageMask !== undefined) {
      mask = this._imageMask;
    } else {
      this.drawRectMask();
      mask = this._rectMask;
    }
    return mask;
  }
}
