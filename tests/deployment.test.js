import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const base = '/kilo-culture-new/';
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

function assertAsset(url) {
  assert.ok(url.startsWith(base), `Asset must use the Pages base path: ${url}`);
  const file = new URL(`../dist/${url.slice(base.length)}`, import.meta.url);
  assert.ok(existsSync(file), `Built asset must exist: ${url}`);
  return file;
}

test('built entry points and favicon resolve within the GitHub Pages site', () => {
  const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
  assert.ok(urls.some(url => url.endsWith('.js')), 'Page must load a built JavaScript entry');
  assert.ok(urls.some(url => url.endsWith('.css')), 'Page must load a built stylesheet');
  urls.forEach(assertAsset);
});

test('built JavaScript renders page content with working image paths', () => {
  const entry = html.match(/<script[^>]+src="([^"]+)"/)[1];
  const app = { innerHTML: '' };
  const element = { addEventListener() {} };
  const document = {
    createElement: () => ({ relList: { supports: () => true } }),
    querySelector: selector => selector === '#app' ? app : element,
    querySelectorAll: () => [],
    addEventListener() {},
  };
  runInNewContext(readFileSync(assertAsset(entry), 'utf8'), { document });
  assert.ok(app.innerHTML.includes('STRONGER.'), 'JavaScript must render the gym page');
  const images = [...app.innerHTML.matchAll(/<img[^>]+src="([^"]+)"/g)];
  assert.ok(images.length > 0, 'Page must render its images');
  images.forEach(match => assertAsset(match[1]));
  const heroImage = app.innerHTML.match(/<figure class="hero-photo"><img src="([^"]+)"/)[1];
  const trainingImage = app.innerHTML.match(/<img id="training-image" src="([^"]+)"/)[1];
  assert.notEqual(trainingImage, heroImage, 'Training photo must differ from the hero photo');
});

test('built font URLs resolve within the GitHub Pages site', () => {
  const stylesheet = html.match(/<link[^>]+href="([^"]+\.css)"/)[1];
  const css = readFileSync(assertAsset(stylesheet), 'utf8');
  const fonts = [...css.matchAll(/url\(["']?([^\)"']+\.ttf)["']?\)/g)];
  assert.equal(fonts.length, 7, 'All seven local font faces must be present');
  fonts.forEach(match => assertAsset(match[1]));
});

test('training panels collapse, reopen, and switch with matching controls', () => {
  const panels = Array.from({ length: 3 }, (_, index) => ({ hidden: index !== 0 }));
  const buttons = panels.map((panel, index) => {
    const attributes = { 'aria-expanded': String(!panel.hidden) };
    const symbol = { textContent: panel.hidden ? '+' : '−' };
    const option = { classList: { toggle() {} } };
    return {
      dataset: { training: String(index) },
      getAttribute: name => attributes[name],
      setAttribute: (name, value) => { attributes[name] = value; },
      querySelector: () => symbol,
      closest: () => option,
      addEventListener(name, handler) { this[name] = handler; },
    };
  });
  const image = {};
  const caption = {};
  const element = { addEventListener() {} };
  const document = {
    createElement: () => ({ relList: { supports: () => true } }),
    querySelector: selector => selector === '#training-image' ? image : selector === '#training-caption' ? caption : element,
    querySelectorAll: selector => selector === '.training-trigger' ? buttons : [],
    getElementById: id => panels[Number(id.replace('training-panel-', ''))],
    addEventListener() {},
  };
  const entry = html.match(/<script[^>]+src="([^"]+)"/)[1];
  runInNewContext(readFileSync(assertAsset(entry), 'utf8'), { document });

  function assertState(openIndex) {
    buttons.forEach((button, index) => {
      const expanded = index === openIndex;
      assert.equal(button.getAttribute('aria-expanded'), String(expanded));
      assert.equal(button.querySelector('span').textContent, expanded ? '−' : '+');
      assert.equal(panels[index].hidden, !expanded);
    });
  }

  buttons[0].click();
  assertState(-1);
  buttons[0].click();
  assertState(0);
  assert.ok(image.src.endsWith('/images/training.jpg'));
  buttons[1].click();
  assertState(1);
  assert.ok(image.src.endsWith('/images/community.jpg'));
  buttons[1].click();
  assertState(-1);
  assert.ok(image.src.endsWith('/images/community.jpg'), 'Collapsing keeps the last selected photo');
  buttons[2].click();
  assertState(2);
  assert.ok(image.src.endsWith('/images/team-results.jpg'));
});
