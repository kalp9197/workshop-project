export const createEmptyProductForm = () => ({
  name: "",
  sku: "",
  price: "",
  quantity: "",
  description: "",
  specifications: [{ key: "", value: "" }],
});

export const normalizeProductPayload = (form) => ({
  name: form.name.trim(),
  sku: form.sku.trim(),
  price: Number(form.price),
  quantity: Number(form.quantity),
  description: form.description.trim(),
  specifications: form.specifications
    .map((spec) => ({ key: spec.key.trim(), value: spec.value.trim() }))
    .filter((spec) => spec.key && spec.value),
});

export const mapProductToForm = (product) => ({
  name: product?.name || "",
  sku: product?.sku || "",
  price: String(product?.price ?? ""),
  quantity: String(product?.quantity ?? ""),
  description: product?.description || "",
  specifications:
    product?.specifications?.length > 0
      ? product.specifications.map((spec) => ({ key: spec.key, value: spec.value }))
      : [{ key: "", value: "" }],
});
