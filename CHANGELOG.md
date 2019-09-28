# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
