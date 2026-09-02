export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export const RESERVED_CATEGORY_SLUGS = new Set([
  "camisetas",
  "contacto",
  "guia-de-talles",
  "admin",
  "login",
  "",
]);

export function slugifyCategory(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function slugifyProduct(name: string, team = "") {
  return slugifyCategory(name) || slugifyCategory(team) || "producto";
}

export function storeNavLinks(_categories: Pick<Category, "name" | "slug">[] = []) {
  return [
    { label: "Inicio", href: "/" },
    { label: "Camisetas", href: "/camisetas" },
    { label: "Contacto", href: "/contacto" },
  ];
}

export function storeCategoryLinks(categories: Pick<Category, "name" | "slug">[]) {
  return categories.map((category) => ({ label: category.name, href: `/${category.slug}` }));
}

export function storeShopLinks(categories: Pick<Category, "name" | "slug">[]) {
  return [
    { label: "Camisetas", href: "/camisetas" },
    ...categories.map((category) => ({ label: category.name, href: `/${category.slug}` })),
  ];
}
