/* 把 7 個單元檔合併成一份可單獨分享的 dist/emmaenglishclass.html
   用法： node build.mjs                                    */
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const UNITS = [
  '01-cover.html', '02-mindset.html', '03-goals.html', '04-ai3p.html',
  '05-review.html', '06-habit.html', '07-close.html',
];

const RE_SECTION  = /<section class="slide[^"]*"[\s\S]*?\n<\/section>/g;
const RE_TEMPLATE = /^<template id="[\s\S]*?^<\/template>/gm;

const templates = new Map();
const sections = [];
const unitIndex = new Map();

for (const file of UNITS) {
  const src = readFileSync(join(ROOT, file), 'utf8');

  for (const t of src.match(RE_TEMPLATE) || []) {
    const id = (t.match(/id="([^"]+)"/) || [])[1];
    if (id && !templates.has(id)) templates.set(id, t);
  }

  const found = src.match(RE_SECTION) || [];
  if (!found.length) throw new Error(`${file} 找不到任何 <section class="slide">`);
  unitIndex.set(file, sections.length + 1);   // +1：目錄會插在最前面
  sections.push(...found);
  console.log(`  ${file.padEnd(20)} ${String(found.length).padStart(2)} 張`);
}

/* 目錄放在最前面當第 1 張。單檔版不能跳 index.html（dist 底下沒有那個檔，
   而且換頁會讓全螢幕被瀏覽器結束），所以把 <a href> 改成同頁跳轉的 data-goto。 */
const tocSection = (readFileSync(join(ROOT, 'index.html'), 'utf8').match(RE_SECTION) || [])[0];
if (!tocSection) throw new Error('index.html 找不到目錄 <section class="slide">');
const toc = tocSection
  .replace('<section class="slide', '<section id="toc" class="slide')
  .replace(/<a href="([^"]+\.html)">/g, (m, f) =>
    unitIndex.has(f) ? `<a href="#" data-goto="${unitIndex.get(f)}">` : m);
sections.unshift(toc);
console.log(`  ${'index.html（目錄）'.padEnd(18)}  1 張`);

/* 圖片保持原本的相對路徑，改成把檔案一起複製到 dist/，
   這樣 dist/ 整個資料夾可以直接丟上靜態空間。 */
const missing = [];
const assets = new Set();

function collectAssets(html) {
  for (const m of html.matchAll(/<(?:img|video|source)\b[^>]*?\bsrc="([^"]+)"/g)) {
    const src = m[1];
    if (/^(https?:|data:|\/\/|#)/.test(src)) continue;
    if (existsSync(join(ROOT, src))) assets.add(src);
    else missing.push(src);
  }
}

const css = readFileSync(join(ROOT, 'assets/deck.css'), 'utf8')
  .replace(/^@import url\([^)]*\);\s*/m, '');   // 字體改用 <link> 載入
const js = readFileSync(join(ROOT, 'assets/deck.js'), 'utf8');

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>在 AI 時代如何學英文｜Emma’s English Class</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap">
<style>
${css}</style>
</head>
<body data-unit-name="在 AI 時代如何學英文" data-home="#toc">
<div id="viewport"><div id="stage">
${[...templates.values()].join('\n')}
${sections.join('\n\n')}
</div></div>
<script>
${js}</script>
</body>
</html>
`;

mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist/emmaenglishclass.html'), html, 'utf8');

collectAssets(sections.join('\n'));
for (const src of assets) {
  const dest = join(ROOT, 'dist', src);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(join(ROOT, src), dest);
}
console.log(`\n✔ dist/emmaenglishclass.html — 共 ${sections.length} 張投影片`);
console.log(`  複製 ${assets.size} 個媒體檔到 dist/：${[...assets].join('、')}`);
for (const f of [...new Set(missing)]) console.warn(`  ⚠ 找不到檔案：${f}`);
