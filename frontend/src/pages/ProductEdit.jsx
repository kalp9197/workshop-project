import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import { createEmptyProductForm, mapProductToForm, normalizeProductPayload } from "./productFormUtils.js";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(createEmptyProductForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(`/products/${id}`);
        setForm(mapProductToForm(data));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleMainFieldChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSpecChange = (index, field, value) => {
    setForm((prev) => {
      const specifications = [...prev.specifications];
      specifications[index] = { ...specifications[index], [field]: value };
      return { ...prev, specifications };
    });
  };

  const addSpecField = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const removeSpecField = (index) => {
    setForm((prev) => {
      const filtered = prev.specifications.filter((_, i) => i !== index);
      return {
        ...prev,
        specifications: filtered.length ? filtered : [{ key: "", value: "" }],
      };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.put(`/products/${id}`, normalizeProductPayload(form));
      navigate("/products", { replace: true, state: { message: "Product updated successfully" } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
          <Link to="/products" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Back to Products
          </Link>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading product...</p>
        ) : (
          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="name"
                value={form.name}
                onChange={handleMainFieldChange}
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="Product name"
                required
              />
              <input
                name="sku"
                value={form.sku}
                onChange={handleMainFieldChange}
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="SKU (unique)"
                required
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleMainFieldChange}
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="Price"
                min="0"
                step="0.01"
                required
              />
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleMainFieldChange}
                className="rounded-md border border-slate-300 px-3 py-2"
                placeholder="Quantity"
                min="0"
                required
              />
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleMainFieldChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              rows={4}
              placeholder="Description"
            />

            <div className="space-y-2 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Specifications</h3>
                <button
                  type="button"
                  onClick={addSpecField}
                  className="rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
                >
                  Add spec
                </button>
              </div>

              {form.specifications.map((spec, index) => (
                <div key={`edit-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2"
                    placeholder="Key (e.g. RAM)"
                  />
                  <input
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2"
                    placeholder="Value (e.g. 16GB)"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecField(index)}
                    className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-amber-600 px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Updating..." : "Update Product"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default ProductEdit;
