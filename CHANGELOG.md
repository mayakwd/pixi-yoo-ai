# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic versioning](https://semver.org/spec/v2.0.0.html).

[0.0.30] - 2020-09-19
- Reworked invalidation and rendering: replaced with requestAnimationFrame
- onChildrenChange must not be validated if AbstractBox is destroyed
- Components now will be validated before alignment via alignChild
- Fixed label size measurement in the Button
- Fixed renderers reusing in the List.
- Added hasItem method to DataProvider

[0.0.29] - 2020-08-29
### Disappointment
- Tests were disabled due to lack of sense and problems with CI

[0.0.28] - 2020-08-29
### Added
- Added global `getWidth` and `getHeight` helpers, that will help you to get dimensions of any DisplayObject,  
for Components it will be `componentWidth` and `componentHeight` respectively. For DisplayObjects - `width` and `height`.

### Fixed
- All components are now depends on `componentWidth` and `componentHeight`

[0.0.27] - 2020-08-20
### Breaking changes
- width and height for components renamed to componentWidth, componentHeight accordingly

### Fixed
- Support of Pixi.JS 5.3.3 changes
- Support of Typescript 4.0.2 changes

[0.0.26] - 2020-08-20
### Added
- Updated Typescript version to 4.0.2
- Updated all relevant dependencies

### Fixed
- Added support for Pixi.JS 5.3.3

[0.0.25] - 2020-04-09
### Added
- Added modal wrapper color and alpha properties for `PopupManager#show` params.

[0.0.24] - 2020-03-02
### Fixed
- Fixed evaluation of skins for current state

[0.0.23] - 2020-03-02
### Fixed
- Removed unnecessary condition for displaying selected skin in case if component is enabled.

[0.0.22] - 2020-02-16
### Added
- Added `enabledPredicate` property for Lists, which helps to define whether renderer should be enabled.

### Changed
- Interactivity for `InteractiveComponent` and derived classes is controlled by `enabled` property now.

[0.0.21] - 2020-02-16
### Fixed
- Modal popups aren't pushing out active popup now.

[0.0.20] - 2020-02-15
### Fixed
- Fixed destroying on `hide` for `PopupManager` for case when Popup haven't been added to PopupManager root yet.

[0.0.19] - 2020-02-12
### Added
- Tweaked animations smoothness for popups.

### Fixed
- Now image loaded via `Image.imageUrl` will be removed from cache right after loading complete.
- Workaround for calculating bounds of progress bar. Original issue appears when `NineSlicePane` `width` or `height` equals zero.

[0.0.18] - 2020-01-27
### Fixed
- Fixed word-wrapping layout style applying

[0.0.17] - 2020-01-08
### Added
- Support of word-wrap for `Label`

### Fixed
- Added handling of releasing pointer outside for `InteractiveComponent`

[0.0.16] - 2019-12-18
### Fixed
- Fixed manual selection for not selectable lists. 

[0.0.15] - 2019-12-06
### Fixed
- Fixed (via dirty hack) `getBounds` issue during draw phase. 

[0.0.14] - 2019-12-05
### Fixed
- Fixed list re-rendering after "selected index" change.

[0.0.13] - 2019-12-05
### Fixed
- Added entries stack inside PopupManager. Now active popups will be hidden if new popup is opened, and reopened after the last one will be closed.
- Now events `PopupEvent.FOCUS_IN` and `PopupEvent.FOCUS` will be dispatched by every popup, which will be shown via PopupManager.

[0.0.12] - 2019-12-04
### Added
- Added support of maximum selected items for lists via `List.maxSelectedItemsCount`
- Parameter `animated` was removed from all scroll methods, and moved as a property to `List` class.

### Fixed
- Tweener `fatina` replaced with `gsap`
- Fixed [item deselection bug](https://github.com/mayakwd/pixi-yoo-ai/issues/3) for `List`
- Fixed [multiple selection implementation](https://github.com/mayakwd/pixi-yoo-ai/issues/2) for `List`
- Fixed [scroll position bug](https://github.com/mayakwd/pixi-yoo-ai/issues/8). After removing an item, scroll position could become invalid if it was near the max scroll position.

[0.0.11] - 2019-11-25
### Fixed
- Fixed layout for VBox, HBox
- `pixi.js` moved to peerDependencies

[0.0.10] - 2019-11-24
### Fixed
- Tweener `anime.js` replaced with `fatina`
- Fixed TileList content size calculations after data change.

[0.0.9] - 2019-11-24
### Added
- Added capability to set filters for disabled state of `Component`.

### Fixed
- Now `ListEvent.ITEM_CLICK` will not be fired if `List` disabled 

[0.0.8] - 2019-11-23
### Added
Added `ListEvent.SELECTION_CHANGE` for lists
Added `rendererEvents` for lists. Now it's possible to listen custom events for `ItemRenderer`

### Fixed
- Fixed `selectable` behavior for lists 

[0.0.7-rc1] - 2019-11-10
### Added 
- Added `List`, `TileList`
- Added button mode to `Button`
- Upgraded TypeScript to version 3.7.2
- Added `Direction` with values `'horizontal'` and `'vertical'`
 
### Fixed
- Fixed selection toggling for interactive components
- `Direction` renamed to `ForwardDirection`

[0.0.6] - 2019-10-01
### Fixed
- Fixed interaction events, removed hitArea setup for components

[0.0.5] - 2019-09-28
### Added
- Added `anime.js` as default tweener for UI
- Added abstraction `DisplayObjectWithSize`
- Added `PopupManager`
- Added `ProgressBar.setValues` method 

### Fixed
- Fixed `ProgressBar.percentComplete` result, now it bounded to min..max range
- `ImageView` renamed to `Image`
- Fixed `Label.contentWidth` and `Label.contentHeight` results. Now they returning `0` when text is empty
- Fixed `Button.contentOffsetX` and `Button.contentOffsetY` usage (previously it was ignored)
- Fixed usage of `Label.contentWidth` and `Label.contentHeight` for positioning content (previously it was `Label.width` and `Label.height`)

[0.0.4] - 2019-09-24
### Added
- Added `Component.moveTo` method

### Fixed
- Fixed direction of `ProgressBar` 

[0.0.3] - 2019-09-20
### Added
- Added `Component.updateSkin` method, to reduce boilerplate for replacing skins
- Added `ProgressBar` component
- Added decorator for invalidation properties to decrease boilerplate
- Added tests configuration
- `invalidate` moved to separate file
- Added layout-helper `alignChild`
- Added new component `ImageView`
  Added class `RatioUtil` with utility methods for scaling with aspect ratio 
- Added protected `Component.alignChild`
- Label margins replaced with `labelOffsetX` and `labelOffsetY`
- ItemRenderer margins replaced with `labelOffsetX` and `labelOffsetY`
- Button margins replaced with `contentOffsetX` and `contentOffsetY`
- Added `Component#vAlignChild` and `Component#hAlignChild`
- Added `Button.setContentOffset` and `Label.setOffset`

### Fixed
- Parameter `parent` for `Label` constructor is optional now, as expected
- Reworked `draw` flow for Button
- Fixed `isInvalid` check for invalidationType 'all', not it returns true for any kind of invalidationType if `all` is set to invalidate.
- `Component.updateSkin` now takes any instance which extends DisplayObject
- Alignments now is optional for `alignChild`

## [0.0.2] - 2019-09-06
### Fixed
- Fixed exports

## [0.0.1] - 2019-09-06
### Added
- Initial release
