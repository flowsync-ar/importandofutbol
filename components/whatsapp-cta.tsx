import { MessageCircle } from "lucide-react";
import { storeWhatsAppHref } from "@/lib/customer";

export function WhatsAppCTA({ message = "Hola, quiero consultar por una camiseta" }: { message?: string }) {
  return <a className="whatsapp" href={storeWhatsAppHref(message)} target="_blank" rel="noreferrer" aria-label="Consultar por WhatsApp"><MessageCircle/> <span>Consultar</span></a>;
}
