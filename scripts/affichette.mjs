// Affichette A5 imprimable (PDF vectoriel) avec QR code vers le site, et image de partage Open Graph (1200 × 630).
//   npm run affichette   →   print/affichette-le-piri-piri-a5.pdf (+ aperçu PNG) et public/og.jpg
// Rendu par Chrome (playwright-core + Chrome installé sur le poste) pour garder les vraies polices du site.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import QRCode from "qrcode";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const site = JSON.parse(await readFile(path.join(ROOT, "data/site.json"), "utf8"));
const url = `${site.url}/fr`;
const CHROME = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome"].find((p) => p && existsSync(p));

const font = (f) => pathToFileURL(path.join(ROOT, "public/fonts", f)).href;
const logo = (await readFile(path.join(ROOT, "public/logo.svg"), "utf8")).replace(/width="512" height="512"/, "");
const qr = await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#3A241A", light: "#FFFFFF" } });
const tile = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' fill='none' stroke='%23fbf8f2' stroke-opacity='.16' stroke-width='1.5'%3E%3Cpath d='M0 0h96v96H0z'/%3E%3Cpath d='M0 22A22 22 0 0 0 22 0M74 0a22 22 0 0 0 22 22M96 74a22 22 0 0 0-22 22M22 96A22 22 0 0 0 0 74'/%3E%3Cpath d='M48 20c9 9 9 19 0 28-9-9-9-19 0-28zM76 48c-9 9-19 9-28 0 9-9 19-9 28 0zM48 76c-9-9-9-19 0-28 9 9 9 19 0 28zM20 48c9-9 19-9 28 0-9 9-19 9-28 0z'/%3E%3Ccircle cx='48' cy='48' r='4'/%3E%3C/svg%3E")`;

const base = `
@font-face{font-family:F;src:url(${font("fraunces-latin-wght-normal.woff2")});font-weight:100 900}
@font-face{font-family:F;src:url(${font("fraunces-latin-wght-italic.woff2")});font-weight:100 900;font-style:italic}
@font-face{font-family:J;src:url(${font("jost-latin-wght-normal.woff2")});font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:J;color:#3A241A;background:#FBF8F2}
.f{font-family:F}.blue{background:#1F4E8C ${tile};color:#FBF8F2}
.word{font-family:F;font-weight:680;letter-spacing:.04em}`;

const flyer = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${base}
@page{size:148mm 210mm;margin:0}
html,body{width:148mm;height:210mm}
.top{height:88mm;padding:12mm 11mm 0;position:relative}
.brand{display:flex;align-items:center;gap:3.5mm}.brand svg{width:17mm;height:17mm;border-radius:50%}
.brand .word{font-size:20pt}
h1{font-family:F;font-weight:620;font-size:35pt;line-height:.98;letter-spacing:-.02em;margin-top:9mm}
.sub{margin-top:4mm;font-size:12pt;opacity:.9}
.mid{display:flex;gap:8mm;align-items:center;padding:10mm 11mm 0}
.qr{width:42mm;height:42mm;padding:3mm;background:#fff;border:1.5px solid #1F4E8C;flex:none}.qr svg{width:100%;height:100%}
.cta{font-family:F;font-weight:620;font-size:21pt;line-height:1.05}
.cta-sub{margin-top:2.5mm;font-size:10.5pt;color:#5F4B40;line-height:1.4}
.url{margin-top:3mm;font-weight:560;color:#1F4E8C;font-size:10pt}
.frieze{height:4mm;margin:9mm 11mm 0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='14' fill='none' stroke='%231f4e8c' stroke-width='1.5'%3E%3Cpath d='M0 .75h28M0 13.25h28M14 1.5 20.5 7 14 12.5 7.5 7z'/%3E%3C/svg%3E") repeat-x center/8mm 4mm}
.menu{padding:6mm 11mm 0;display:grid;grid-template-columns:1fr 1fr;gap:2mm 6mm;font-size:10.5pt}
.menu b{font-family:F;font-weight:600;font-size:12pt}
.foot{position:absolute;bottom:0;left:0;right:0;padding:6mm 11mm 8mm;border-top:1px solid #E2D8C8;font-size:9.5pt;line-height:1.5}
.foot b{font-weight:600}
.red{color:#C8322B}
</style></head><body>
<section class="top blue">
  <div class="brand">${logo}<span class="word">LE PIRI PIRI</span></div>
  <h1>Le Portugal,<br>grillé à la braise.</h1>
  <p class="sub">Poulet piri piri, grillades et bacalhau.</p>
</section>
<section class="mid">
  <div class="qr">${qr}</div>
  <div>
    <p class="cta">Commandez<br>à emporter.</p>
    <p class="cta-sub">Scannez, choisissez vos plats et l'heure. On lance la braise.</p>
    <p class="url">${url.replace(/^https?:\/\//, "")}</p>
  </div>
</section>
<div class="frieze"></div>
<section class="menu">
  <p><b>Poulet piri piri</b><br>entier, demi, en assiette</p>
  <p><b>Grillades</b><br>febras, espetada, chouriço</p>
  <p><b>Bacalhau</b><br>à Brás, grillé, pastéis</p>
  <p><b>Fêtes et groupes</b><br>poulets entiers sur devis</p>
</section>
<footer class="foot">
  <b>2 ter rue de l'Eau, 80480 Pont-de-Metz</b> · à 10 min d'Amiens<br>
  <b class="red">03 22 44 76 51</b> · À emporter ou sur place · Paiement au retrait
</footer>
</body></html>`;

const og = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${base}
html,body{width:1200px;height:630px;overflow:hidden}
.wrap{display:grid;grid-template-columns:1fr 470px;height:630px}
.l{padding:70px 64px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:18px}.brand svg{width:92px;height:92px;border-radius:50%}.brand .word{font-size:34px}
h1{font-family:F;font-weight:620;font-size:78px;line-height:.98;letter-spacing:-.02em}
.meta{font-size:26px;opacity:.92}
.r{background:#FBF8F2;display:flex;flex-direction:column;justify-content:center;padding:56px;gap:22px}
.r p{font-family:F;font-size:32px;font-weight:560;border-bottom:1.5px solid #E2D8C8;padding-bottom:18px}
.r p:last-child{border:0;color:#C8322B}
.r i{display:block;font-style:italic;font-size:22px;color:#1F4E8C;font-weight:400;margin-top:4px}
</style></head><body><div class="wrap">
<div class="l blue"><div class="brand">${logo}<span class="word">LE PIRI PIRI</span></div>
<h1>Le Portugal,<br>grillé à la braise.</h1>
<p class="meta">Pont-de-Metz · à 10 min d'Amiens</p></div>
<div class="r"><p>Poulet piri piri<i>frango piri piri</i></p><p>Grillades<i>febras, espetada</i></p><p>Bacalhau<i>à Brás</i></p><p>À emporter</p></div>
</div></body></html>`;

if (!CHROME) throw new Error("Chrome introuvable : définissez CHROME_PATH");
const browser = await chromium.launch({ executablePath: CHROME, args: ["--allow-file-access-from-files"] });
const tmp = path.join(ROOT, "print");
await mkdir(tmp, { recursive: true });

const page = await browser.newPage();
await writeFile(path.join(tmp, ".flyer.html"), flyer);
await page.goto(pathToFileURL(path.join(tmp, ".flyer.html")).href);
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: path.join(tmp, "affichette-le-piri-piri-a5.pdf"), width: "148mm", height: "210mm", printBackground: true });
await page.setViewportSize({ width: 560, height: 794 });
await page.screenshot({ path: path.join(tmp, "apercu-affichette.png") });

const p2 = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await writeFile(path.join(tmp, ".og.html"), og);
await p2.goto(pathToFileURL(path.join(tmp, ".og.html")).href);
await p2.evaluate(() => document.fonts.ready);
const png = await p2.screenshot();
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(ROOT, "public/og.jpg"));
await browser.close();
console.log("affichette et image de partage prêtes :", url);
