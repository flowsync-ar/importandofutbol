import { adHref, adTextParts, isVisibleAd, type Ad } from "@/lib/ads";

export function AdSpot({ ad }: { ad: Ad | null | undefined }) {
  if (!isVisibleAd(ad)) return null;
  const href = adHref(ad.href);
  if (!href) return null;
  return <a className="ad-spot" href={href} target="_blank" rel="noopener noreferrer">
    <span className="ad-spot-media"><img src={ad.image_url ?? ""} alt={ad.title || "Publicidad"}/></span>
    {(ad.title || ad.description) ? <span className="ad-spot-copy">{ad.title ? <strong>{ad.title}</strong> : null}{ad.description ? <p>{adTextParts(ad.description).map((part, index) => part.bold ? <strong key={index}>{part.text}</strong> : part.text)}</p> : null}</span> : null}
  </a>;
}

