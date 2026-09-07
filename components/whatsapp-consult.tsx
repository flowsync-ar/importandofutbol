"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { consultLeadPayload, consultMessage, openStoreWhatsApp, readStoredLead, STORE_WHATSAPP, writeStoredLead } from "@/lib/customer";
import { withConsultMedia, type ConsultMedia } from "@/lib/product-code";
import { createClient } from "@/lib/supabase/client";
import { supabasePublicEnv } from "@/lib/supabase/env";

async function saveLead(name: string, phone: string, notes: string) {
  if (!supabasePublicEnv()) return;
  const lead = consultLeadPayload(name, phone, notes);
  if (!lead) return;
  const supabase = createClient();
  await supabase.from("customers").insert({ name: lead.name, phone: lead.phone, email: null, notes: lead.notes || null });
}

function openChat(name: string, message: string, storePhone: string, media?: ConsultMedia | ConsultMedia[]) {
  const body = withConsultMedia(message, media, window.location.origin);
  openStoreWhatsApp(consultMessage(name, body), storePhone);
}

export function WhatsAppConsult({
  message,
  consultMedia,
  storePhone,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  message: string;
  consultMedia?: ConsultMedia | ConsultMedia[];
  storePhone?: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const chatPhone = storePhone || STORE_WHATSAPP;

  function start() {
    const lead = readStoredLead();
    if (lead) {
      openChat(lead.name, message, chatPhone, consultMedia);
      void saveLead(lead.name, lead.phone, message);
      return;
    }
    setOpen(true);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const lead = consultLeadPayload(name, phone, message);
    if (lead) {
      writeStoredLead(lead.name, lead.phone);
      void saveLead(lead.name, lead.phone, lead.notes);
    }
    openChat(lead?.name ?? name, message, chatPhone, consultMedia);
    setOpen(false);
  }

  return <>
    <button type="button" className={className} aria-label={ariaLabel} onClick={start}>{children}</button>
    {open && <div className="drawer-backdrop" onClick={() => setOpen(false)}>
      <form className="product-editor lead-editor" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
        <header><div><span>WHATSAPP</span><h2>Tu consulta</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar"><X/></button></header>
        <p>Dejar tus datos es <strong>opcional</strong>. Si querés colaborar con nosotros, anotamos tu nombre y WhatsApp. Si no, seguí al chat igual.</p>
        <div className="editor-grid">
          <label className="wide">Nombre (opcional)<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Tu nombre"/></label>
          <label className="wide">WhatsApp (opcional)<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="299 123-4567"/></label>
        </div>
        <button className="button gold full"><MessageCircle/> Continuar a WhatsApp</button>
      </form>
    </div>}
  </>;
}
