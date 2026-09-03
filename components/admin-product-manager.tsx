"use client";

import { ArrowUpDown, ImagePlus, LogOut, Megaphone, PackagePlus, Pencil, Phone, Ruler, Search, Star, Tags, Trash2, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminAdManager } from "@/components/admin-ad-manager";
import { AdminCategoryManager } from "@/components/admin-category-manager";
import { AdminContactManager } from "@/components/admin-contact-manager";
import { AdminCustomerManager } from "@/components/admin-customer-manager";
import { AdminSizeGuide } from "@/components/admin-size-guide";
import type { Ad } from "@/lib/ads";
import { slugifyProduct, type Category } from "@/lib/category";
import type { ContactChannel } from "@/lib/contacts";
import type { Customer } from "@/lib/customer";
import type { SizeGuideRow } from "@/lib/size-guide";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_IMAGE_MAX_COUNT, PRODUCT_IMAGE_TYPES, productImageList, uploadProductImages, validateProductImage } from "@/lib/product-images";
import { CATALOG_SIZES, formatPrice, parsePrice, parseSizes } from "@/lib/types";

export type AdminProduct = {
  id: string; slug: string; name: string; category: string; team: string;
  price: number | null; sizes: string[]; badge: string | null; image_url: string | null; image_urls?: string[] | null; active: boolean;
  featured?: boolean; featured_title?: string | null;
};

type PendingImage = { id: string; file: File; preview: string };

const emptyProduct: Omit<AdminProduct, "id"> = { slug:"", name:"", category:"Clubes", team:"", price:null, sizes:[...CATALOG_SIZES], badge:null, image_url:null, image_urls:[], active:true, featured:false, featured_title:null };
const imageAccept = PRODUCT_IMAGE_TYPES.join(",");

export function AdminProductManager({ initialProducts, initialCategories, initialCustomers, initialSizeGuide, initialContacts, initialAds, email }: { initialProducts: AdminProduct[]; initialCategories: Category[]; initialCustomers: Customer[]; initialSizeGuide: SizeGuideRow[]; initialContacts: ContactChannel[]; initialAds: Ad[]; email: string }) {
  const router = useRouter();
  const [section, setSection] = useState<"products" | "categories" | "customers" | "sizes" | "contacts" | "ads">("products");
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [customers, setCustomers] = useState(initialCustomers);
  const [sizeGuide, setSizeGuide] = useState(initialSizeGuide);
  const [contacts, setContacts] = useState(initialContacts);
  const [ads, setAds] = useState(initialAds);
  const [query, setQuery] = useState("");
  const [categorySort, setCategorySort] = useState<"az" | "za" | null>(null);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const filtered = useMemo(() => {
    const rows = products.filter((product) => `${product.name} ${product.team}`.toLowerCase().includes(query.toLowerCase()));
    if (!categorySort) return rows;
    const dir = categorySort === "az" ? 1 : -1;
    return [...rows].sort((a, b) => a.category.localeCompare(b.category, "es") * dir || a.name.localeCompare(b.name, "es"));
  }, [products, query, categorySort]);
  const blankProduct = { ...emptyProduct, category: categories[0]?.name ?? "" };

  async function signOut() { const supabase = createClient(); await supabase.auth.signOut(); router.replace("/admin/login"); router.refresh(); }
  async function remove(product: AdminProduct) {
    if (!window.confirm(`¿Eliminar ${product.name}?`)) return;
    const { error } = await createClient().from("products").delete().eq("id", product.id);
    if (error) { setMessage(`No se pudo eliminar: ${error.message}`); return; }
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setMessage("Producto eliminado.");
  }
  function saved(product: AdminProduct) {
    setProducts((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? product : item) : [product, ...current]);
    setEditing(null); setCreating(false); setMessage("Cambios guardados.");
  }

  return <div className="admin-shell"><aside className="admin-sidebar"><div><strong>IMPORTANDO FÚTBOL</strong><span>Administración</span></div><nav><button type="button" className={section === "products" ? "active" : ""} onClick={() => setSection("products")}><PackagePlus/> Productos</button><button type="button" className={section === "categories" ? "active" : ""} onClick={() => setSection("categories")}><Tags/> Categorías</button><button type="button" className={section === "sizes" ? "active" : ""} onClick={() => setSection("sizes")}><Ruler/> Talles</button><button type="button" className={section === "contacts" ? "active" : ""} onClick={() => setSection("contacts")}><Phone/> Contactos</button><button type="button" className={section === "ads" ? "active" : ""} onClick={() => setSection("ads")}><Megaphone/> Publicidad</button><button type="button" className={section === "customers" ? "active" : ""} onClick={() => setSection("customers")}><Users/> Clientes</button></nav><button onClick={signOut}><LogOut/> Cerrar sesión</button></aside><main className="admin-main">{section === "categories" ? <AdminCategoryManager categories={categories} usedNames={products.map((product) => product.category)} onChange={setCategories} onRename={(from, to) => setProducts((current) => current.map((product) => product.category === from ? { ...product, category: to } : product))}/> : section === "sizes" ? <AdminSizeGuide rows={sizeGuide} onChange={setSizeGuide}/> : section === "contacts" ? <AdminContactManager contacts={contacts} onChange={setContacts}/> : section === "ads" ? <AdminAdManager ads={ads} onChange={setAds}/> : section === "customers" ? <AdminCustomerManager customers={customers} onChange={setCustomers}/> : <><header><div><span>CATÁLOGO</span><h1>Productos</h1><p>Sesión iniciada como {email}</p></div><button className="button gold" onClick={() => setCreating(true)}><PackagePlus/> Nuevo producto</button></header>{message && <div className="admin-message">{message}<button onClick={() => setMessage("")}><X/></button></div>}<div className="admin-toolbar"><Search/><input aria-label="Buscar productos" placeholder="Buscar por nombre o equipo" value={query} onChange={(event) => setQuery(event.target.value)}/><strong>{filtered.length} productos</strong></div><div className="admin-table-wrap"><table><thead><tr><th className="star-col" title="Carrusel del inicio"><Star/></th><th>Producto</th><th><button type="button" className="sort-th" onClick={() => setCategorySort((current) => current === "az" ? "za" : "az")}>Categoría <ArrowUpDown/>{categorySort === "az" ? " A-Z" : categorySort === "za" ? " Z-A" : ""}</button></th><th>Talles</th><th>Precio</th><th>Estado</th><th/></tr></thead><tbody>{filtered.map((product) => { const images = productImageList(product); const cover = images[0]; return <tr key={product.id}><td className="star-col">{product.featured ? <Star className="carousel-star" fill="currentColor" aria-label="En el carrusel"/> : null}</td><td><div className="product-cell">{cover ? <img src={cover} alt="" className="admin-thumb"/> : <span className="admin-thumb empty"/>}<div className="product-copy"><strong>{product.name}</strong>{product.team && product.team.toLowerCase() !== product.name.toLowerCase() ? <span>{product.team}</span> : null}{images.length > 1 ? <span>{images.length} fotos</span> : null}</div></div></td><td>{product.category}</td><td>{(product.sizes ?? []).join(", ")}</td><td>{product.price === null ? "A consultar" : formatPrice(product.price)}</td><td><i className={product.active ? "status active" : "status"}>{product.active ? "Publicado" : "Oculto"}</i></td><td><div className="row-actions"><button onClick={() => setEditing(product)} aria-label={`Editar ${product.name}`}><Pencil/></button><button className="danger" onClick={() => remove(product)} aria-label={`Eliminar ${product.name}`}><Trash2/></button></div></td></tr>; })}</tbody></table>{!filtered.length && <div className="admin-empty">No hay productos para mostrar.</div>}</div>
        </>}</main>{(editing || creating) && <ProductEditor product={editing ?? blankProduct} categories={categories} onClose={() => { setEditing(null); setCreating(false); }} onSaved={saved}/>}</div>;
}

function ProductEditor({ product, categories, onClose, onSaved }: { product: AdminProduct | Omit<AdminProduct,"id">; categories: Category[]; onClose:()=>void; onSaved:(product:AdminProduct)=>void }) {
  const [form, setForm] = useState(product);
  const [savedImages, setSavedImages] = useState(() => productImageList(product));
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const pendingRef = useRef(pendingImages);
  pendingRef.current = pendingImages;
  const update = (key: string, value: unknown) => setForm((current) => ({ ...current, [key]: value }));
  function toggleSize(size: string) {
    setForm((current) => {
      const selected = new Set(parseSizes(current.sizes).map((item) => item.toUpperCase()));
      if (selected.has(size)) selected.delete(size);
      else selected.add(size);
      return { ...current, sizes: CATALOG_SIZES.filter((item) => selected.has(item)) };
    });
  }
  const selectedSizes = new Set(parseSizes(form.sizes).map((item) => item.toUpperCase()));
  const imageCount = savedImages.length + pendingImages.length;

  useEffect(() => () => {
    pendingRef.current.forEach((image) => URL.revokeObjectURL(image.preview));
  }, []);

  function chooseImages(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;
    if (imageCount + files.length > PRODUCT_IMAGE_MAX_COUNT) {
      setError(`Podés cargar hasta ${PRODUCT_IMAGE_MAX_COUNT} imágenes.`);
      return;
    }
    for (const file of files) {
      const validationError = validateProductImage(file);
      if (validationError) { setError(validationError); return; }
    }
    setError("");
    setPendingImages((current) => [...current, ...files.map((file) => ({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) }))]);
    if (fileInput.current) fileInput.current.value = "";
  }

  function removeSaved(url: string) {
    setSavedImages((current) => current.filter((image) => image !== url));
  }

  function removePending(id: string) {
    setPendingImages((current) => {
      const selected = current.find((image) => image.id === id);
      if (selected) URL.revokeObjectURL(selected.preview);
      return current.filter((image) => image.id !== id);
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    if (!form.category) { setError("Elegí una categoría."); setSaving(false); return; }
    const sizes = CATALOG_SIZES.filter((size) => selectedSizes.has(size));
    if (!sizes.length) { setError("Marcá al menos un talle."); setSaving(false); return; }
    const supabase = createClient();
    const slug = "id" in product ? (form.slug || slugifyProduct(form.name, form.team)) : slugifyProduct(form.name, form.team);
    const uploaded = pendingImages.length
      ? await uploadProductImages(supabase, pendingImages.map((image) => image.file), slug || "producto")
      : { urls: [] as string[], error: null };
    if (uploaded.error) { setError(uploaded.error); setSaving(false); return; }
    const imageUrls = [...savedImages, ...uploaded.urls];
    const rawPrice = String(form.price ?? "").trim();
    const price = parsePrice(rawPrice);
    if (rawPrice && price === null) { setError("El precio no es válido. Escribí 70000, sin puntos."); setSaving(false); return; }
    const payload = {
      slug, name: form.name, category: form.category, team: form.team,
      price, sizes,
      badge: form.badge || null, image_url: imageUrls[0] ?? null, image_urls: imageUrls, active: form.active,
      featured: Boolean(form.featured), featured_title: String(form.featured_title ?? "").trim() || null,
    };
    const query = "id" in product ? supabase.from("products").update(payload).eq("id",product.id).select().single() : supabase.from("products").insert(payload).select().single();
    const { data, error: saveError } = await query;
    if (saveError) { setError(saveError.message); setSaving(false); return; }
    onSaved({ ...data, price: parsePrice((data as AdminProduct).price) } as AdminProduct);
  }

  return <div className="drawer-backdrop" onClick={onClose}><form className="product-editor" onSubmit={submit} onClick={(event)=>event.stopPropagation()}>
    <header><div><span>{"id" in product ? "EDITAR" : "NUEVO"}</span><h2>Producto</h2></div><button type="button" onClick={onClose}><X/></button></header>
    <div className="editor-grid">
      <label className="wide">Nombre<input value={form.name} onChange={(event)=>update("name",event.target.value)} required/></label>
      <label>Equipo<input value={form.team} onChange={(event)=>update("team",event.target.value)} required/></label>
      <label>Categoría{categories.length ? <select value={form.category} onChange={(event)=>update("category",event.target.value)} required>{categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}{form.category && !categories.some((category) => category.name === form.category) ? <option value={form.category}>{form.category}</option> : null}</select> : <small>Creá una categoría en el menú Categorías antes de cargar un producto.</small>}</label>
      <label>Precio<input inputMode="numeric" value={form.price ?? ""} onChange={(event)=>update("price",event.target.value)} placeholder="70000"/></label>
      <label className="wide">Talles
        <div className="detail-sizes editor-sizes">{CATALOG_SIZES.map((size) => <button type="button" className={selectedSizes.has(size) ? "selected" : ""} key={size} onClick={() => toggleSize(size)}>{size}</button>)}</div>
        <small>Tocá todos los talles que tengas. Podés marcar varios.</small>
      </label>
      <label>Etiqueta en la ficha (opcional)<input value={form.badge ?? ""} onChange={(event)=>update("badge",event.target.value)} placeholder="Nueva, Oferta…"/><small>Texto chico sobre la foto en el catálogo. Vacío = no se muestra.</small></label>
      <label className="checkbox"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event)=>update("featured",event.target.checked)}/><Star/> Mostrar en el carrusel del inicio</label>
      {form.featured ? <label className="wide">Texto del carrusel (opcional)<input value={form.featured_title ?? ""} onChange={(event)=>update("featured_title",event.target.value)} placeholder="Mundial, Nuevo ingreso…"/><small>Va sobre la foto grande del inicio. Vacío = usa el nombre del producto.</small></label> : null}
      <div className="wide image-field">
        <span>Imágenes del producto</span>
        <div className="image-picker">
          {imageCount ? <div className="image-gallery">{savedImages.map((url) => <div className="image-tile" key={url}><img src={url} alt=""/><button type="button" aria-label="Quitar imagen" onClick={() => removeSaved(url)}><X/></button></div>)}{pendingImages.map((image) => <div className="image-tile" key={image.id}><img src={image.preview} alt=""/><button type="button" aria-label="Quitar imagen" onClick={() => removePending(image.id)}><X/></button></div>)}</div> : <div className="image-placeholder"><ImagePlus/><small>JPG, PNG, WEBP o AVIF · máx. 5 MB · hasta {PRODUCT_IMAGE_MAX_COUNT} fotos</small></div>}
          <div className="image-actions">
            <input ref={fileInput} type="file" accept={imageAccept} multiple aria-label="Archivos de imagen" onChange={(event)=>chooseImages(event.target.files)}/>
            <button type="button" className="button gold" onClick={() => fileInput.current?.click()} disabled={imageCount >= PRODUCT_IMAGE_MAX_COUNT}>Agregar imágenes</button>
            <strong>{imageCount}/{PRODUCT_IMAGE_MAX_COUNT}</strong>
          </div>
        </div>
      </div>
      <label className="checkbox"><input type="checkbox" checked={form.active} onChange={(event)=>update("active",event.target.checked)}/> Producto publicado</label>
    </div>
    {error && <div className="form-error">{error}</div>}
    <button className="button gold full" disabled={saving}>{saving ? "Guardando…" : "Guardar producto"}</button>
  </form></div>;
}
