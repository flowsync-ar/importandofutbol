import { MessageCircle } from "lucide-react";
import { WhatsAppConsult } from "@/components/whatsapp-consult";
import { contactHref, getContactChannels, isWhatsAppContact } from "@/lib/contacts";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contacts = await getContactChannels();
  return <section className="page-shell narrow container"><span className="eyebrow dark">HABLEMOS</span><h1>Encontramos tu camiseta</h1><p>Escribinos con el equipo, temporada y talle que buscás. Respondemos por nuestros canales oficiales.</p>
    {contacts.map((contact) => <div className="contact-card" key={contact.id}>
      <strong>{contact.name}</strong>
      <span>{contact.value}</span>
      {isWhatsAppContact(contact)
        ? <WhatsAppConsult className="button gold" storePhone={contact.value} message="Hola, quiero consultar por una camiseta"><MessageCircle/> {contact.button_label}</WhatsAppConsult>
        : <a className="button gold" href={contactHref(contact)} target="_blank" rel="noreferrer">{contact.button_label}</a>}
    </div>)}
  </section>;
}
