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
});

test('built font URLs resolve within the GitHub Pages site', () => {
  const stylesheet = html.match(/<link[^>]+href="([^"]+\.css)"/)[1];
  const css = readFileSync(assertAsset(stylesheet), 'utf8');
  const fonts = [...css.matchAll(/url\(["']?([^\)"']+\.ttf)["']?\)/g)];
  assert.equal(fonts.length, 7, 'All seven local font faces must be present');
  fonts.forEach(match => assertAsset(match[1]));
});
