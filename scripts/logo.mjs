// Le vrai logo du Piri Piri (enseigne « Le Piri Piri · Churrasqueira · Rotisserie - Barbecue », coq dans une flamme),
// redessiné en vectoriel à partir de l'image publiée sur la fiche Google (assets/raw/gmaps/g46.jpg, 1600 × 1600).
//   npm run logo   →   public/logo.svg (badge complet), public/logo-mark.svg (flamme et coq dans le disque noir),
//                       app/icon.svg (favicon), app/apple-icon.png
// Deux calques tracés au contour (potrace) : le noir (cercle, disque, lettrage, coq) et la flamme, remplie du dégradé
// d'origine (rouge orangé en haut, jaune en bas). Pour un fichier fourni par le restaurant : remplacez public/logo.svg.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import potrace from "potrace";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "assets/raw/gmaps/g46.jpg");
const S = 2; // tracé sur une image agrandie 2× : contours plus lisses

const { data, info } = await sharp(SRC).resize(1600 * S, 1600 * S, { kernel: "lanczos3" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;

/** Masque noir sur blanc (pour potrace) selon une règle par pixel. */
async function mask(test) {
  const out = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) {
    const c = info.channels; const r = data[i * c], g = data[i * c + 1], b = data[i * c + 2];
    out[i] = test(r, g, b) ? 0 : 255;
  }
  return sharp(out, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
}

const trace = (buf) =>
  new Promise((ok, ko) =>
    potrace.trace(buf, { turdSize: 8 * S, optTolerance: 0.3, alphaMax: 1, threshold: 128 }, (err, svg) => (err ? ko(err) : ok(svg.match(/ d="([^"]+)"/)[1].replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))))),
  );

// Noir : sombre et peu saturé. Flamme : rouge fort, bleu faible (orange → jaune).
const black = await trace(await mask((r, g, b) => r + g + b < 3 * 110 && Math.max(r, g, b) - Math.min(r, g, b) < 60));
const flame = await trace(await mask((r, g, b) => r > 200 && b < 120 && r - b > 110));

const scale = `transform="scale(${1 / S})"`;
const grad = `<linearGradient id="pp-flame" x1="0" y1="${180 * S}" x2="0" y2="${1380 * S}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FF4527"/><stop offset=".5" stop-color="#FF8F16"/><stop offset="1" stop-color="#FFEA00"/></linearGradient>`;
const layers = `<circle cx="800" cy="800" r="790" fill="#fff"/><path ${scale} fill="#000" fill-rule="evenodd" d="${black}"/><path ${scale} fill="url(#pp-flame)" fill-rule="evenodd" d="${flame}"/>`;

const badge = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1600" width="512" height="512"><title>Le Piri Piri · Churrasqueira · Rotisserie - Barbecue</title><defs>${grad}</defs>${layers}</svg>\n`;
// Le disque noir seul (flamme et coq), pour le favicon et les petites tailles : on rogne le badge sur le disque.
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="250 250 1100 1100" width="512" height="512"><defs>${grad}<clipPath id="pp-disc"><circle cx="800" cy="800" r="545"/></clipPath></defs><g clip-path="url(#pp-disc)"><rect x="0" y="0" width="1600" height="1600" fill="#000"/><path ${scale} fill="url(#pp-flame)" fill-rule="evenodd" d="${flame}"/></g></svg>\n`;

await writeFile(path.join(ROOT, "public/logo.svg"), badge);
await writeFile(path.join(ROOT, "public/logo-mark.svg"), mark);
await writeFile(path.join(ROOT, "app/icon.svg"), mark.replace(' width="512" height="512"', ""));
await sharp(Buffer.from(badge), { density: 72 }).resize(180, 180).png().toFile(path.join(ROOT, "app/apple-icon.png"));
await sharp(Buffer.from(badge), { density: 72 }).resize(800, 800).png().toFile(path.join(ROOT, "print/apercu-logo.png"));
const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(0)} Ko`;
await sharp(Buffer.from(badge), { density: 72 }).resize(256, 256).webp({ quality: 90 }).toFile(path.join(ROOT, "public/logo-badge.webp"));
console.log(`logo.svg ${kb(badge)}, logo-mark.svg ${kb(mark)}`);
void readFile;
