import carte from "@/data/carte.json";

export type Tag = "spicy" | "fish" | "veggie" | "friday" | "party";
export type Illus = "chicken" | "grill" | "skewer" | "sausage" | "sandwich" | "fish" | "croquette" | "plate" | "fries" | "bowl" | "chili" | "nata" | "bottle";
export type Item = { pt: string | null; price: number | null; from: boolean; tags: Tag[]; photo: string[]; illus: Illus };
export type ItemId = keyof typeof carte.items;
export type CategoryId = "poulet" | "grillades" | "bacalhau" | "assiettes" | "accompagnements" | "desserts" | "boissons";

export const ITEMS = carte.items as unknown as Record<ItemId, Item>;
export const ITEM_IDS = Object.keys(ITEMS) as ItemId[];
export const isItem = (v: unknown): v is ItemId => typeof v === "string" && v in ITEMS;

/** Onglets de la carte, dans l'ordre de data/carte.json. */
export const categories = () => carte.categories as { id: CategoryId; items: ItemId[] }[];

/** Prix d'un plat ; null tant qu'il n'est pas renseigné (« prix à confirmer »). */
export const unitPrice = (id: ItemId) => ITEMS[id].price;

/** Date du dernier relevé des prix (vide tant que la carte n'est pas validée). */
export const checked = carte.checked;
