// Import unique des photos (16/11/2026) : vraies photos de la fiche Google du restaurant (assets/raw/gmaps)
// et photos libres Unsplash pour les plats sans photo réelle. Sources et licences : PHOTOS-SOURCES.md.
//   node scripts/import-photos.mjs   puis   npm run media
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const RAW = path.join(ROOT, "assets/raw/gmaps");

// [fichier Google, destination, recadrage éventuel]
const REAL = [
  ["g12", "hero/hero"],
  ["g42", "grill/poulet-braise", { left: 0, top: 0, width: 1280, height: 600 }],
  ["g21", "grill/grillades"],
  ["g25", "plats/poulet-entier"],
  ["g03", "plats/demi-poulet"],
  ["g38", "plats/cuisses"],
  ["g13", "plats/entremeada"],
  ["g11", "plats/chourico"],
  ["g53", "plats/bifana"],
  ["g19", "plats/bacalhau-bras"],
  ["g30", "plats/bacalhau-grelhado"],
  ["g37", "plats/pasteis-bacalhau"],
  ["g22", "plats/assiette-piri"],
  ["g40", "plats/assiette-mixte"],
  ["g48", "plats/prato-do-dia"],
  ["g16", "plats/frites"],
  ["g31", "plats/pastel-nata"],
  ["g33", "plats/sumol"],
  ["g17", "plats/fetes"],
  ["g35", "facade/facade"],
  ["g20", "facade/interieur"],
];

// [id Unsplash (images.unsplash.com/photo-…), destination]
const STOCK = [
  ["1654876203651-64761cbcc5cc", "plats/espetada"],
  ["1612871689527-2a6145cc9e86", "plats/febras"],
  ["1666190092689-e3968aa0c32c", "plats/arroz"],
  ["1615802546508-f992bc087b9c", "plats/salade"],
  ["1612192666307-8dbd0c8a535a", "plats/sauce-piri"],
  ["1694320220739-bb46cfc118e4", "plats/bola-berlim"],
  ["1515544645059-de313dd20a58", "plats/arroz-doce"],
  ["1655505384900-60b94b56252d", "plats/compal"],
  ["1644085159285-5fd924740cb3", "plats/super-bock"],
  ["1696739696220-8d2e27465662", "plats/soft"],
];

for (const [f, dest, crop] of REAL) {
  const out = path.join(ROOT, "assets", `${dest}.jpg`);
  await mkdir(path.dirname(out), { recursive: true });
  let img = sharp(path.join(RAW, `${f}.jpg`)).rotate();
  if (crop) img = img.extract(crop);
  await img.jpeg({ quality: 92 }).toFile(out);
}
for (const [id, dest] of STOCK) {
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=1600&q=85&fm=jpg`);
  if (!res.ok) throw new Error(`Unsplash ${id}: ${res.status}`);
  await writeFile(path.join(ROOT, "assets", `${dest}.jpg`), Buffer.from(await res.arrayBuffer()));
}
console.log(`${REAL.length} photos réelles, ${STOCK.length} photos Unsplash`);
