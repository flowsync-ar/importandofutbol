import { MessageCircle } from "lucide-react";

export function WhatsAppCTA({ message = "Hola, quiero consultar por una camiseta" }: { message?: string }) {
  return <a className="whatsapp" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" aria-label="Consultar por WhatsApp"><MessageCircle/> <span>Consultar</span></a>;
}
