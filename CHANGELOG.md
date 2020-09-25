# Changelog
All notable changes to this project will be documented in this file.

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
