import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-200">Product Profile</p>
              <h1 className="mt-1 text-2xl font-bold">Product Details</h1>
            </div>
            <Link
              to="/products"
              className="rounded-md border border-slate-400/60 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
            >
              Back to Products
            </Link>
          </div>
        </div>

        <div className="p-6">
          {loading && <p className="text-sm text-slate-500">Loading product...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && product && (
            <div className="space-y-6">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Name</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{product.name}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">SKU</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{product.sku}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Price</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">${Number(product.price).toFixed(2)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Quantity</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{product.quantity}</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-900">Description</h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">{product.description || "No description"}</p>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-900">Specifications</h2>
                {product.specifications?.length ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={`${product._id}-${spec.key}-${index}`}
                        className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                      >
                        <span className="font-semibold text-slate-900">{spec.key}:</span> {spec.value}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">No specifications</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductView;
