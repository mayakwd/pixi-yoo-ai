import { Container } from '@pixi/display';
import { InteractionEvent } from '@pixi/interaction';
import { Point } from '@pixi/math';
import { invalidate, Pane } from '../..';
import { InteractiveState } from './InteractiveState';

export class InteractiveComponent extends Pane {
  public get disabledSkin(): Container | undefined {
    return this._disabledSkin;
  }

  public set disabledSkin(value: Container | undefined) {
    if (this._disabledSkin === value) {
      return;
    }
    this._disabledSkin = value;
    if (!this._enabled) {
      this.invalidate('skin');
    }
  }

  public get selectedUpSkin(): Container | undefined {
    return this._selectedUpSkin;
  }

  public set selectedUpSkin(value: Container | undefined) {
    if (this._selectedUpSkin === value) {
      return;
    }
    this._selectedUpSkin = value;
    if (this._enabled && this._state === 'up') {
      this.invalidate('skin');
    }
  }

  public get selectedOverSkin(): Container | undefined {
    return this._selectedOverSkin;
  }

  public set selectedOverSkin(value: Container | undefined) {
    if (this._selectedOverSkin === value) {
      return;
    }
    this._selectedOverSkin = value;
    if (this._enabled && this._state === 'over') {
      this.invalidate('skin');
    }
  }

  public get selectedDownSkin(): Container | undefined {
    return this._selectedDownSkin;
  }

  public set selectedDownSkin(value: Container | undefined) {
    if (this._selectedDownSkin === value) {
      return;
    }
    this._selectedDownSkin = value;
    if (this._enabled && this._state === 'down') {
      this.invalidate('skin');
    }
  }

  public get downSkin(): Container | undefined {
    return this._downSkin;
  }

  public set downSkin(value: Container | undefined) {
    if (this._downSkin === value) {
      return;
    }
    this._downSkin = value;
    if (this._enabled && this._state === 'down') {
      this.invalidate('skin');
    }
  }

  public get overSkin(): Container | undefined {
    return this._overSkin;
  }

  public set overSkin(value: Container | undefined) {
    if (this._overSkin === value) {
      return;
    }
    this._overSkin = value;
    if (this._enabled && this._state === 'over') {
      this.invalidate('skin');
    }
  }

  public get upSkin(): Container | undefined {
    return this._upSkin;
  }

  public set upSkin(value: Container | undefined) {
    if (this._upSkin === value) {
      return;
    }
    this._upSkin = value;
    if (this._enabled && this._state === 'up') {
      this.invalidate('skin');
    }
  }

  public get selectable(): boolean {
    return this._selectable;
  }

  public set selectable(value: boolean) {
    this._selectable = value;
  }

  protected get state(): InteractiveState {
    return this._state;
  }

  @invalidate('state')
  protected set state(value: InteractiveState) {
    this._state = value;
  }

  public get selected(): boolean {
    return this._selected;
  }

  @invalidate('state')
  public set selected(value: boolean) {
    this._selected = value;
  }

  protected _state: InteractiveState = 'up';
  protected _selected: boolean = false;
  protected _selectable: boolean = false;

  protected _upSkin?: Container;
  protected _overSkin?: Container;
  protected _downSkin?: Container;
  protected _selectedUpSkin?: Container;
  protected _selectedOverSkin?: Container;
  protected _selectedDownSkin?: Container;
  protected _disabledSkin?: Container;

  public setSkins(options: IInteractiveSkinOptions) {
    ({
      upSkin: this.upSkin,
      overSkin: this.overSkin,
      downSkin: this.downSkin,
      disabledSkin: this.disabledSkin,
      selectedUpSkin: this.selectedUpSkin,
      selectedOverSkin: this.selectedOverSkin,
      selectedDownSkin: this.selectedDownSkin
    } = options);
  }

  public updateSkins(options: IInteractiveSkinOptions) {
    Object.assign(this, options);
  }

  protected configure() {
    this.interactiveChildren = true;
    this.interactive = true;

    this.on('pointerover', this.pointerHandler, this);
    this.on('pointerout', this.pointerHandler, this);
    this.on('pointerdown', this.pointerHandler, this);
    this.on('pointerup', this.pointerHandler, this);
    this.on('pointerupoutside', this.pointerHandler, this);
    this.on('pointertap', this.onTap, this);
  }

  protected pointerHandler(event: InteractionEvent) {
    switch (event.type) {
      case 'pointerover':
        this.state = 'over';
        break;
      case 'pointerout' || 'pointerupoutside':
        this.state = 'up';
        break;
      case 'pointerdown':
        this.state = 'down';
        break;
      case 'pointerup': {
        const local = event.data.getLocalPosition(this, HELPER_POINT, event.data.global);
        if (this._hitArea.contains(local.x, local.y)) {
          this.state = 'over';
        } else {
          this.state = 'up';
        }
        break;
      }
    }
  }

  protected draw(): void {
    if (this.isInvalid('state')) {
      this.invalidate('skin');
      this.interactive = this._enabled;
    }
    super.draw();
  }

  protected drawBackground() {
    const oldValue = this._background;
    this._background = this.updateSkin(this._background, this.getSkinForCurrentState(), 0);
    if (oldValue !== this._background) {
      this.invalidate('size');
    }
  }

  protected getSkinForCurrentState() {
    const skin = this.getCurrentStateSkin();
    if (!skin) {
      if (this._selected && this._selectedUpSkin) {
        return this._selectedUpSkin;
      }
      if (this._upSkin) {
        return this._upSkin;
      }
    }
    return skin || this._skin;
  }

  protected getCurrentStateSkin() {
    let result;
    if (!this._enabled) {
      result = this.disabledSkin;
    } else if (this.selected) {
      switch (this.state) {
        case 'up':
          result = this.selectedUpSkin;
          break;
        case 'down':
          result = this.selectedDownSkin;
          break;
        case 'over':
          result = this.selectedOverSkin;
          break;
      }
    } else {
      switch (this.state) {
        case 'up':
          result = this.upSkin;
          break;
        case 'down':
          result = this.downSkin;
          break;
        case 'over':
          result = this.overSkin;
          break;
      }
    }
    return result;
  }

  protected onTap() {
    if (!this._selectable) {
      return;
    }
    this.selected = !this.selected;
  }
}

interface IInteractiveSkinOptions {
  upSkin?: Container;
  downSkin?: Container;
  overSkin?: Container;
  selectedUpSkin?: Container;
  selectedOverSkin?: Container;
  selectedDownSkin?: Container;
  disabledSkin?: Container;
}

const HELPER_POINT = new Point();
