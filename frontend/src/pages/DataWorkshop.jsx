import { useEffect, useState } from "react";
import api from "../services/api";

function DataWorkshop() {
  const [collectionName, setCollectionName] = useState("workshop_raw_data");
  const [csvFile, setCsvFile] = useState(null);
  const [truncateCollection, setTruncateCollection] = useState(true);
  const [importResult, setImportResult] = useState(null);

  const [sourceCollection, setSourceCollection] = useState("workshop_raw_data");
  const [targetCollection, setTargetCollection] = useState("workshop_transformed_data");
  const [fromCity, setFromCity] = useState("Ahmedabad");
  const [toCity, setToCity] = useState("Vadodara");
  const [migrationResult, setMigrationResult] = useState(null);

  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(false);

  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");

  const fetchCollections = async () => {
    try {
      setLoadingCollections(true);
      const { data } = await api.get("/data/collections");
      setCollections(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load collections");
    } finally {
      setLoadingCollections(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleImportCsv = async (event) => {
    event.preventDefault();

    if (!csvFile) {
      setError("Please choose a CSV file first");
      return;
    }

    try {
      setError("");
      setBusyAction("import");

      const formData = new FormData();
      formData.append("csvFile", csvFile);
      formData.append("collectionName", collectionName);
      formData.append("truncateCollection", String(truncateCollection));

      const { data } = await api.post("/data/import-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImportResult(data);
      await fetchCollections();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to import CSV");
    } finally {
      setBusyAction("");
    }
  };

  const handleMigrate = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setBusyAction("migrate");

      const { data } = await api.post("/data/migrate-city", {
        sourceCollection,
        targetCollection,
        fromCity,
        toCity,
      });

      setMigrationResult(data);
      await fetchCollections();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to run migration");
    } finally {
      setBusyAction("");
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Big Data Workshop Lab</h1>
        <p className="mt-2 text-sm text-slate-600">
          Task 1: Upload/import CSV data. Task 2: Migrate data with aggregation pipeline and city
          transformation.
        </p>
      </header>

      {error && <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Task 1: Import CSV to MongoDB</h2>
        <form className="mt-4 space-y-3" onSubmit={handleImportCsv}>
          <label className="block text-sm">
            <span className="mb-1 block text-slate-700">Target collection name</span>
            <input
              value={collectionName}
              onChange={(event) => setCollectionName(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-700">CSV file</span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => setCsvFile(event.target.files?.[0] || null)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={truncateCollection}
              onChange={(event) => setTruncateCollection(event.target.checked)}
            />
            Replace existing data in collection before import
          </label>

          <button
            type="submit"
            disabled={busyAction === "import"}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {busyAction === "import" ? "Importing..." : "Import CSV"}
          </button>
        </form>

        {importResult && (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p>Imported file: {importResult.fileName}</p>
            <p>Collection: {importResult.collectionName}</p>
            <p>Inserted rows: {importResult.totalInserted}</p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Task 2: Aggregation Migration (City Transform)</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleMigrate}>
          <label className="text-sm">
            <span className="mb-1 block text-slate-700">Source collection</span>
            <input
              value={sourceCollection}
              onChange={(event) => setSourceCollection(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-700">Target collection</span>
            <input
              value={targetCollection}
              onChange={(event) => setTargetCollection(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-700">From city</span>
            <input
              value={fromCity}
              onChange={(event) => setFromCity(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-700">To city</span>
            <input
              value={toCity}
              onChange={(event) => setToCity(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <button
            type="submit"
            disabled={busyAction === "migrate"}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 md:col-span-2"
          >
            {busyAction === "migrate" ? "Migrating..." : "Run Aggregation Migration"}
          </button>
        </form>

        {migrationResult && (
          <div className="mt-4 space-y-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p>
              Migrated <strong>{migrationResult.sourceCollection}</strong> to <strong>{migrationResult.targetCollection}</strong>
            </p>
            <p>
              Replaced city "{migrationResult.fromCity}" with "{migrationResult.toCity}" for {migrationResult.affectedBefore} matching
              records.
            </p>
            <details>
              <summary className="cursor-pointer">View pipeline used</summary>
              <pre className="mt-2 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
                {JSON.stringify(migrationResult.pipeline, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Collection Overview</h2>
          <button
            onClick={fetchCollections}
            disabled={loadingCollections}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            {loadingCollections ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Collection</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Count</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Sample</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {collections.map((collection) => (
                <tr key={collection.name}>
                  <td className="px-3 py-2 font-medium text-slate-800">{collection.name}</td>
                  <td className="px-3 py-2 text-slate-700">{collection.count}</td>
                  <td className="px-3 py-2 text-slate-600">
                    {collection.sample
                      ? `${collection.sample.recordId || "N/A"} | ${collection.sample.fullName || "N/A"} | ${collection.sample.city || "N/A"}`
                      : "No sample"}
                  </td>
                </tr>
              ))}
              {!loadingCollections && collections.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-slate-500">
                    No collections found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default DataWorkshop;
