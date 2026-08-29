import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return <footer><div className="container footer-grid"><div><div className="brand"><Image src="/logo.png" width={58} height={58} alt=""/><strong>IMPORTANDO FÚTBOL LP</strong></div><p>Tu pasión, tu camiseta. Clubes, selecciones y modelos retro.</p></div><div><strong>Comprar</strong><Link href="/camisetas">Camisetas</Link><Link href="/selecciones">Selecciones</Link><Link href="/clubes">Clubes</Link><Link href="/retro">Retro</Link></div><div><strong>Ayuda</strong><Link href="/guia-de-talles">Guía de talles</Link><Link href="/contacto">Contacto</Link><span>@Importandofutbol.lp</span></div></div><div className="container copyright">© {new Date().getFullYear()} Importando Fútbol LP</div></footer>;
}
