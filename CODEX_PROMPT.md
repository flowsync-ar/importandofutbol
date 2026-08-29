# Prompt para Codex

Desarrollá un ecommerce frontend para **Importando Fútbol LP** usando **Next.js (App Router) + TypeScript + Tailwind CSS**.

Tomá como fuente visual obligatoria `DESIGN_SPEC.md`, `index.html` y `assets/logo.png`. El HTML es un prototipo visual, no código final. Recrealo con componentes React/Tailwind bien estructurados y responsive.

Requisitos:
- Next.js App Router.
- TypeScript estricto.
- Tailwind CSS.
- Diseño mobile-first y totalmente responsive.
- Componentes reutilizables.
- Usar `next/image`.
- Metadata/SEO básico por página.
- Accesibilidad: labels, focus states, contraste y navegación por teclado.
- No hardcodear todo en componentes: usar objetos/arrays de datos mock separados.
- Preparar la arquitectura para conectar luego Supabase o una API.

Rutas:
- `/` Home.
- `/camisetas` catálogo.
- `/camisetas/[slug]` detalle.
- `/selecciones`.
- `/clubes`.
- `/retro`.
- `/contacto`.
- `/guia-de-talles`.

Componentes mínimos:
- `TopBar`
- `Header`
- `MobileMenu`
- `Hero`
- `CategoryCard`
- `ProductCard`
- `ProductGrid`
- `ProductFilters`
- `SizeSelector`
- `ProductGallery`
- `WhatsAppCTA`
- `Benefits`
- `Footer`

Funcionalidad frontend:
- Buscador visual.
- Filtros por categoría/equipo/talle/tipo.
- Ordenamiento.
- Favoritos en localStorage.
- Carrito simple en localStorage, aunque el checkout final pueda derivar a WhatsApp.
- Generar mensaje de WhatsApp con producto, talle y cantidad.
- Drawer de filtros en mobile.
- Galería de imágenes.
- Skeletons y estados vacíos.

Estilo:
- Fondo oscuro `#050505` para hero/footer.
- Fondo general `#F7F7F4`.
- Dorado CTA `#F2B72A`, secundario `#D69A1B`.
- Cards blancas con bordes suaves.
- Bordes redondeados 16–24px.
- Evitar sombras exageradas.
- Look premium/deportivo/urbano.

Datos:
Usar `data/products.json` como mock inicial. No inventar datos comerciales sensibles ni políticas; dejarlas como contenido editable.

Importante:
- Mantener el logo circular original sin redibujarlo.
- La cuenta de Instagram indicada por el cliente es `@Importandofutbol.lp`, pero no asumir bio, teléfono, precios, envíos ni políticas hasta que el cliente los confirme.
