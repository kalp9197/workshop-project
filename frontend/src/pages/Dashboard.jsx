import { useEffect, useState } from "react";
import api from "../services/api.js";

const MAX_ROWS = 200;

function Dashboard() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  const fetchRecords = async () => {
    setLoadingRecords(true);
    setError("");

    try {
      const { data } = await api.get(`/stats/records?limit=${MAX_ROWS}`);
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch records");
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/data/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`${data.message}. Inserted records: ${data.insertedCount}`);
      await fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-US");
  };

  const formatNumber = (value) => {
    if (value === undefined || value === null || value === "") return "-";
    return value;
  };

  const formatText = (value) => {
    if (value === undefined || value === null || value === "") return "-";
    return value;
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Upload Large CSV Dataset</h2>
        <p className="mt-1 text-sm text-slate-600">
          Stream and import massive files using backend batch processing.
        </p>

        <form className="mt-4 flex flex-col gap-3 md:flex-row md:items-center" onSubmit={onUpload}>
          <input
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            type="submit"
            disabled={!file || uploading}
            className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {uploading ? "Processing..." : "Upload CSV"}
          </button>
        </form>

        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">CSV Records</h3>
        </div>

        {loadingRecords ? (
          <p className="text-sm text-slate-500">Loading records...</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-slate-500">No records found. Upload a CSV to populate this table.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Index</th>
                  <th className="px-3 py-2">Customer Id</th>
                  <th className="px-3 py-2">First Name</th>
                  <th className="px-3 py-2">Last Name</th>
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">City</th>
                  <th className="px-3 py-2">Country</th>
                  <th className="px-3 py-2">Phone 1</th>
                  <th className="px-3 py-2">Phone 2</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Subscription Date</th>
                  <th className="px-3 py-2">Website</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id} className="border-t border-slate-200 text-slate-700">
                    <td className="px-3 py-2">{formatNumber(record.Index)}</td>
                    <td className="px-3 py-2">{formatText(record.CustomerId)}</td>
                    <td className="px-3 py-2">{formatText(record.FirstName)}</td>
                    <td className="px-3 py-2">{formatText(record.LastName)}</td>
                    <td className="px-3 py-2">{formatText(record.Company)}</td>
                    <td className="px-3 py-2">{formatText(record.City)}</td>
                    <td className="px-3 py-2">{formatText(record.Country)}</td>
                    <td className="px-3 py-2">{formatText(record.Phone1)}</td>
                    <td className="px-3 py-2">{formatText(record.Phone2)}</td>
                    <td className="px-3 py-2">{formatText(record.Email)}</td>
                    <td className="px-3 py-2">{formatDate(record.SubscriptionDate)}</td>
                    <td className="px-3 py-2">{formatText(record.Website)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
