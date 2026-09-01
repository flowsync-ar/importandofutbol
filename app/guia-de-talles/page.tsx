import { getSizeGuideRows } from "@/lib/size-guide";

export const dynamic = "force-dynamic";

export default async function SizeGuidePage() {
  const rows = await getSizeGuideRows();
  return <section className="page-shell narrow container">
    <span className="eyebrow dark">GUÍA DE TALLES</span>
    <h1>Camisetas de fútbol</h1>
    <p>Estas medidas son de referencia para camisetas tipo réplica / hincha (corte cómodo, no player). Medí una camiseta que te quede bien, apoyada plana, y compará con la tabla. Las marcas varían un poco: si estás entre dos talles, consultanos por WhatsApp.</p>
    <div className="guide-grid">
      <div><strong>1</strong><h2>Ancho</h2><p>De axila a axila, sin estirar la tela. Esa medida es el pecho de la tabla.</p></div>
      <div><strong>2</strong><h2>Largo</h2><p>Desde el punto más alto del hombro hasta el borde inferior.</p></div>
      <div><strong>3</strong><h2>Versión</h2><p>La versión jugador suele ir más entallada: si usás M de hincha, en player a veces hace falta L.</p></div>
    </div>
    <div className="size-table-wrap">
      <table className="size-table">
        <thead><tr><th>Talle</th><th>Pecho (cm)</th><th>Largo (cm)</th><th>Altura aprox.</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.id}><td>{row.size}</td><td>{row.chest}</td><td>{row.length}</td><td>{row.height}</td></tr>)}</tbody>
      </table>
    </div>
    <p className="guide-note">Si pedís un modelo específico (Nike, Adidas, Puma, retro o niño), confirmamos el talle antes de cerrar el pedido.</p>
  </section>;
}
