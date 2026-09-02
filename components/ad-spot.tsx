import { adHref, isVisibleAd, type Ad } from "@/lib/ads";

export function AdSpot({ ad }: { ad: Ad | null | undefined }) {
  if (!isVisibleAd(ad)) return null;
  const href = adHref(ad.href);
  if (!href) return null;
  return <aside className="ad-spot">
    <a href={href} target="_blank" rel="noopener noreferrer">
      <img src={ad.image_url ?? ""} alt={ad.title || "Publicidad"}/>
    </a>
    {(ad.title || ad.description) ? <div>{ad.title ? <strong>{ad.title}</strong> : null}{ad.description ? <p>{ad.description}</p> : null}</div> : null}
  </aside>;
}
