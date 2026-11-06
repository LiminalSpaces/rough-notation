# @slidev/rough-notation

Fork of [rough-notation](https://github.com/rough-stuff/rough-notation)

Changes in this fork:

- Expose types
- Support custom `class` option
- Support custom `opacity` option for strokes
- Support passing through all options to RoughJS for full customization
- Support `getConfig` and `setConfig` methods
- Improved build assets with `.cjs` and `.mjs`
- `annotation.show()` returns a promise that resolves when the animation is done
- Popout-safe: an annotation on an element in another window (`window.open`)
  uses the element's `ownerDocument` and its `defaultView` for the SVG, the
  keyframes `<style>` (once per document), `getComputedStyle`, `resize` and
  `ResizeObserver`, and follows the element when it moves between windows
  (on the next `show()`, or when the old window closes)
  (`yarn build && yarn test`; the test needs Playwright's Chromium)