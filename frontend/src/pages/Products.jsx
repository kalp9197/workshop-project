import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api.js";

function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      window.history.replaceState({}, "", location.pathname);
    }
  }, [location.pathname, location.state]);

  const onDelete = async () => {
    if (!deleteTarget?._id) return;
    setError("");
    setMessage("");
    setDeleting(true);

    try {
      await api.delete(`/products/${deleteTarget._id}`);
      setMessage("Product deleted successfully");
      setDeleteTarget(null);
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            <p className="mt-1 text-sm text-slate-600">View and manage all products in your inventory.</p>
          </div>
          <Link to="/product-create" className="rounded-md bg-brand px-4 py-2 font-semibold text-white hover:opacity-90">
            Create Product
          </Link>
        </div>

        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No products found.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border border-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Name</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">SKU</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Price</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Qty</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="border-b border-slate-100 px-3 py-2">{product.name}</td>
                    <td className="border-b border-slate-100 px-3 py-2">{product.sku}</td>
                    <td className="border-b border-slate-100 px-3 py-2">${Number(product.price).toFixed(2)}</td>
                    <td className="border-b border-slate-100 px-3 py-2">{product.quantity}</td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 hover:bg-slate-200"
                        >
                          View
                        </Link>
                        <Link
                          to={`/products/${product._id}/edit`}
                          className="rounded-md bg-amber-100 px-2 py-1 text-xs text-amber-800 hover:bg-amber-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Delete Product</h2>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-800">{deleteTarget.name}</span>?
            </p>
            <p className="mt-1 text-xs text-slate-500">This action cannot be undone.</p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
