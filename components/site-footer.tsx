import { contactHref, isWhatsAppContact, type ContactChannel } from "@/lib/contacts";
import { WhatsAppConsult } from "./whatsapp-consult";

export function FlowSyncCredit() {
  return <a className="flowsync-credit" href="https://www.flowsync.com.ar" target="_blank" rel="noopener noreferrer">Desarrollado por FlowSync</a>;
}

export function SiteFooter({ contacts }: { contacts: ContactChannel[] }) {
  return <footer>
    <nav className="container footer-bar" aria-label="Contacto">
      {contacts.map((contact) => isWhatsAppContact(contact)
        ? <WhatsAppConsult key={contact.id} className="footer-wa" storePhone={contact.value} message="Hola, quiero consultar por una camiseta">{contact.name}</WhatsAppConsult>
        : <a key={contact.id} href={contactHref(contact)} target="_blank" rel="noopener noreferrer">{contact.name}</a>)}
    </nav>
    <div className="container copyright"><span>© {new Date().getFullYear()} Importando Fútbol LP</span><FlowSyncCredit/></div>
  </footer>;
}
