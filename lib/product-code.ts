export const PRODUCT_CODE_PREFIX = "IF-";

export function formatProductCode(n: number) {
  return `${PRODUCT_CODE_PREFIX}${String(n).padStart(4, "0")}`;
}

export function productCode(product: { id: string; code?: string | null }) {
  const stored = product.code?.trim();
  if (stored) return stored.toUpperCase();
  const tail = product.id.replace(/-/g, "").slice(-4).toUpperCase();
  return `${PRODUCT_CODE_PREFIX}${tail || "0000"}`;
}

export function productConsultLine(
  product: { id: string; name: string; code?: string | null },
  size?: string,
  quantity?: number,
) {
  const sizeBit = size ? `, talle ${size}` : "";
  const qtyBit = quantity && quantity > 1 ? `, cantidad ${quantity}` : "";
  return `${product.name} (código ${productCode(product)})${sizeBit}${qtyBit}`;
}

export function productConsultMessage(
  product: { id: string; name: string; code?: string | null },
  size?: string,
) {
  return `Hola, quiero consultar por ${productConsultLine(product, size)}.`;
}

export function cartConsultMessage(items: { id: string; name: string; size: string; quantity?: number; code?: string | null }[]) {
  if (!items.length) return "Hola, quiero consultar por camisetas";
  return `Hola, quiero consultar por:\n${items.map((item) => `• ${productConsultLine(item, item.size, item.quantity)}`).join("\n")}`;
}
