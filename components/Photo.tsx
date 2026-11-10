import Image from "next/image";
import { firstImg } from "@/lib/media";
import { Illus, type IllusName } from "@/components/Illus";

const TINTS = {
  azul: "azulejo-soft text-azul",
  warm: "azulejo-warm text-braise/70",
  dark: "azulejo-dark text-paper",
} as const;
export type Tint = keyof typeof TINTS;

/**
 * Photo d'un emplacement (plat, braise, façade, salle, équipe…). Tant que la vraie photo n'existe pas dans public/media,
 * un emplacement sobre la remplace : motif d'azulejo au trait et petite illustration, sans fausse photo.
 * Pour la remplir : déposez la photo dans assets/<dossier>/ sous le nom attendu (data-photo-slot), puis npm run media.
 */
export function Photo({
  paths,
  alt,
  illus,
  tint = "azul",
  sizes,
  className = "",
  imgClassName = "",
  priority = false,
  illusClassName = "h-1/3 w-1/3 max-h-32 max-w-32",
}: {
  paths: readonly string[];
  alt: string;
  illus: IllusName;
  tint?: Tint;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  illusClassName?: string;
}) {
  const p = firstImg(paths);
  if (p)
    return (
      <div className={`zoom bg-paper-deep ${className}`}>
        <Image src={p.src} alt={alt} width={p.width} height={p.height} sizes={sizes} quality={75} priority={priority} fetchPriority={priority ? "high" : undefined} className={`h-full w-full object-cover ${imgClassName}`} />
      </div>
    );
  return (
    <div className={`flex items-center justify-center ${TINTS[tint]} ${className}`} data-photo-slot={paths[0]} role={alt ? "img" : undefined} aria-label={alt || undefined}>
      <Illus name={illus} className={illusClassName} strokeWidth={2.4} />
    </div>
  );
}
