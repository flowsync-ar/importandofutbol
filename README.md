# Importando Fútbol LP

Ecommerce frontend responsive construido con Next.js, TypeScript y Tailwind CSS.

## Desarrollo

```bash
npm install
npm run dev
```

Luego abrí la dirección local indicada por Next.js.

## Verificación

```bash
npm test
npm run build
```

## Funcionalidad incluida

- Home, catálogo, categorías, detalle, contacto y guía de talles.
- Búsqueda, filtros y ordenamiento.
- Favoritos y carrito de consulta persistidos en el navegador.
- Mensajes de WhatsApp preparados con producto y talle.
- Navegación y layouts responsive para mobile y desktop.
- Panel administrador protegido en `/admin/login`.
- Alta, edición, publicación y eliminación de productos mediante Supabase.

## Configurar el panel administrador

1. Ejecutá `supabase/schema.sql` en **Supabase Dashboard → SQL Editor**.
2. Creá el usuario administrador en **Authentication → Users**.
3. En el mismo SQL Editor, ejecutá la consulta comentada al final de `schema.sql`, reemplazando el correo de ejemplo.
4. Cerrá y volvé a iniciar sesión para que el JWT reciba el rol `admin`.

La aplicación usa únicamente la URL del proyecto y la publishable key. No necesita exponer una secret key ni `service_role`.

Los precios, el número de WhatsApp y las políticas comerciales permanecen editables hasta que el negocio los confirme.
