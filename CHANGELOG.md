# Changelog
All notable changes to this project will be documented in this file.

# 1.0.4 - 2022-05-10
- Feature: Added loader middleware support
- Fix: PopupManager now calls onComplete even if the animation was interrupted.

# 1.0.3 - 2022-01-22
- Fix: `PopupManager` will no longer destroy popups after hiding if they do not belong to its root (when the destroy parameter is set to false)

# 1.0.2 - 2022-01-14
- Feature: Added possibility to name update request and cancel it
- Feature: Added possibility to cancel all pending update requests

# 1.0.1 - 2022-01-14
- Feature: Milliseconds passed since update request now passed to action

# 1.0.0 - 2022-01-13
- Feature: Codebase migrated to Pixi.JS v6
- Fix: Fixed `addChild` method signature compatibility

# 0.0.43 - 2021-09-21
- Feature: Added allow deselection for single-selection mode 

# 0.0.42 - 2020-12-23
- Fixed: Content offset manipulation now not throws error if trying to access it in the configure method
- Fixed: Button`s icon is now changing on button state change

# 0.0.41 - 2020-12-21
- Feature: Added pageIndex for the lists
- Feature: Added scrollToItem method for the lists
- Feature: Added ListScrollOptions for the most scrolling methods, which specifies whether scrolling should be animated or not and should the position be aligned to the page size.   

# 0.0.40 - 2020-12-20
- Fixed: CI build produces empty package

# 0.0.39 - 2020-12-20
- Fixed: All scroll methods of the lists now works with the `animated` flag as expected. 

# 0.0.38 - 2020-12-06
- Feature: Added setters for `centerX` and `centerY`

# 0.0.37 - 2020-11-30
- Fixed: Layouts behavior
- Feature: Added `resizeToContent` method for `Label`

# 0.0.36 - 2020-11-20
- Fixed: Added support for legacy canvas renderer

# 0.0.35 - 2020-09-29
- Fixed: Exposed LayoutBuilder and LayoutBuilderConfig

# 0.0.34 - 2020-09-25
- Fixed: Layout validation on margin/padding/alignment change for AbstractBox
- Fixed: Invalidation decorator became more strict and now always require existing of getter and setter. Also, @invalidate now can be applied to methods, invalidation will be triggered after method completion.
- Fixed: Changing Component`s size via componentWidth and componentHeight setter will now emit 'resize' event.
- Fixed: Layout and content validation for List, TileList is fully reworked and now works as expected. Added columnsCount and rowsCount setters that will resize component to required dimensions.
- Feature: Added layout validation on children resize for AbstractBox
- Feature: HBox and VBox now will be automatically resized to fit their content
- Feature: Added very handy LayoutBuilder
- Feature: Added a helper that detects whether item is AbstractComponent

# 0.0.33 - 2020-09-20
- Fixed: Changing data in the ItemRenderer now validates its layout.

# 0.0.32 - 2020-09-20
- Fixed: Before returning the value of contentWidth and contentHeight Label will now always be validated, in order to obtain the actual values.
- Fixed: Removed redundant validation of the label after label resize.
- Fixed: Size invalidation will not be triggered if skin wasn't changed.
- Fixed: Invalidation now based on pixi.js render approach, without redundant requesting of animation frame.
- Feature: Added possibility to trigger invalidation of activeRenderers for any List

# 0.0.31 - 2020-09-19
- Added getter 'items' to DataProvider, which returns list of items

# 0.0.30 - 2020-09-19
- Reworked invalidation and rendering: replaced with requestAnimationFrame
- onChildrenChange must not be validated if AbstractBox is destroyed
- Components now will be validated before alignment via alignChild
- Fixed label size measurement in the Button
- Fixed renderers reusing in the List.
- Added hasItem method to DataProvider
