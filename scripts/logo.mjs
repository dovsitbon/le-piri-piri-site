// Logo, favicon et icône Apple, à partir du tracé de components/Logo.tsx (carreau d'azulejo + piment).
//   npm run logo   →   public/logo.svg, app/icon.svg, app/apple-icon.png
// Pour un vrai logo : remplacez public/logo.svg et app/icon.svg, puis supprimez ce script de package.json.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const src = await readFile(path.join(ROOT, "components/Logo.tsx"), "utf8");
const grab = (name) => {
  const block = src.match(new RegExp(`export const ${name} = \\{([\\s\\S]*?)\\n\\};`))[1];
  return Object.fromEntries([...block.matchAll(/(\w+): (\[[^\]]*\]|"[^"]*")/g)].map(([, k, v]) => [k, JSON.parse(v)]));
};
const TILE = grab("TILE");
const CHILI = grab("CHILI");

const mark = (stroke = "#1F4E8C", sw = 2.6) => `<g fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
<path d="${TILE.frame}"/>${TILE.corners.map((d) => `<path d="${d}"/>`).join("")}${TILE.petals.map((d) => `<path d="${d}"/>`).join("")}</g>
<path d="${CHILI.body}" fill="#C8322B" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>
<path d="${CHILI.shine}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.4" stroke-linecap="round"/>
<path d="${CHILI.cap}" fill="#3F6B2A"/>
<path d="${CHILI.stem}" fill="none" stroke="#3F6B2A" stroke-width="2.6" stroke-linecap="round"/>`;

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">${mark()}</svg>\n`;
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 72 72"><rect x="-4" y="-4" width="72" height="72" rx="14" fill="#FBF8F2"/>${mark("#1F4E8C", 3.4)}</svg>\n`;

await writeFile(path.join(ROOT, "public/logo.svg"), logo);
await writeFile(path.join(ROOT, "app/icon.svg"), icon);
await sharp(Buffer.from(icon), { density: 600 }).resize(180, 180).png().toFile(path.join(ROOT, "app/apple-icon.png"));
console.log("logo, favicon et icône Apple prêts");
