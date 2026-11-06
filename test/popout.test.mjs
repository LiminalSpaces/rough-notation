// Annotations on an element in another window (a popout opened with
// window.open, as Electron apps and dockview do): the SVG is made by the
// element's document, the keyframes go into that document's head so the draw
// animates, and the element's own window's ResizeObserver redraws it. Moved
// back to the opener and the popout closed, it listens in the opener again.
// Run: `yarn build && yarn test` (needs Playwright's Chromium).
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const lib = fileURLToPath(new URL('../lib/rough-notation.iife.js', import.meta.url));
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent('<!doctype html><html><head></head><body></body></html>');
  await page.addScriptTag({ path: lib });

  // The first path's outline, to see a redraw.
  const changed = (d) =>
    page.waitForFunction((was) => window.__el.previousElementSibling.querySelector('path')?.getAttribute('d') !== was, d, { timeout: 5000 });
  const shown = await page.evaluate(() => {
    const popup = window.open('', 'popout', 'width=600,height=400');
    popup.document.write('<!doctype html><html><head></head><body><span id="t" style="display:inline-block;width:120px">Clip text</span></body></html>');
    popup.document.close();
    const el = popup.document.getElementById('t');
    const a = RoughNotation.annotate(el, { type: 'highlight', color: 'yellow', animationDuration: 2000 });
    window.__a = a;
    window.__el = el;
    window.__popup = popup;
    a.show(); // draws synchronously; the promise is the animation's end
    const svg = el.previousElementSibling;
    return {
      popupKeyframes: !!popup.document.getElementById('rough-notation-keyframes'),
      mainKeyframes: !!document.getElementById('rough-notation-keyframes'),
      svgInPopup: svg.ownerDocument === popup.document && svg instanceof popup.SVGSVGElement,
      paths: svg.querySelectorAll('path').length,
      pathsInPopup: [...svg.querySelectorAll('path')].every((p) => p instanceof popup.SVGPathElement),
      runningAnimations: popup.document.getAnimations().length,
      d: svg.querySelector('path').getAttribute('d'),
    };
  });
  assert.equal(shown.popupKeyframes, true, 'keyframes in the popout document');
  assert.equal(shown.mainKeyframes, false, 'no keyframes in the opener');
  assert.equal(shown.svgInPopup, true, 'SVG made by the popout document');
  assert.ok(shown.paths > 0, 'drawn');
  assert.equal(shown.pathsInPopup, true, 'paths made by the popout document');
  assert.ok(shown.runningAnimations > 0, 'the draw animates in the popout');

  // Resized in the popout: its observer redraws it.
  await page.evaluate(() => { window.__el.style.width = '300px'; });
  await changed(shown.d);

  // Moved back to the opener and the popout closed, with no show(): it
  // listens in the opener now, so a resize there redraws it.
  const before = await page.evaluate(() => {
    const el = window.__el;
    const svg = el.previousElementSibling;
    document.body.append(svg, el);
    window.__popup.close();
    return svg.querySelector('path').getAttribute('d');
  });
  await page.waitForFunction(() => window.__popup.closed);
  await page.evaluate(() => { window.__el.style.width = '60px'; });
  await changed(before);

  // Shown again there: its keyframes follow it to the opener.
  const docked = await page.evaluate(() => {
    window.__a.hide();
    window.__a.show();
    return {
      mainKeyframes: !!document.getElementById('rough-notation-keyframes'),
      running: document.getAnimations().length,
    };
  });
  assert.equal(docked.mainKeyframes, true, 'keyframes follow the element back to the opener');
  assert.ok(docked.running > 0, 'the draw animates in the opener');
  console.log('popout: ok');
} finally {
  await browser.close();
}
