import { STORE_WHATSAPP, storeWhatsAppHref } from "@/lib/customer";

export default function ContactPage() {
  return <section className="page-shell narrow container"><span className="eyebrow dark">HABLEMOS</span><h1>Encontramos tu camiseta</h1><p>Escribinos con el equipo, temporada y talle que buscás. Respondemos por nuestros canales oficiales.</p>
    <div className="contact-card"><strong>WhatsApp</strong><span>{STORE_WHATSAPP}</span><a className="button gold" href={storeWhatsAppHref("Hola, quiero consultar por una camiseta")} target="_blank" rel="noreferrer">Escribir por WhatsApp</a></div>
    <div className="contact-card"><strong>Instagram</strong><span>@Importandofutbol.lp</span><a className="button gold" href="https://instagram.com/Importandofutbol.lp" target="_blank" rel="noreferrer">Abrir Instagram</a></div>
  </section>;
}
