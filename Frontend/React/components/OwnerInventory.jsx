// Owner-only inventory management page.
import { useEffect, useMemo, useState } from "react";
import "../styles/owner.css";
import { apiFetchJson } from "../utils/api";
import { getToken } from "../utils/auth";

export default function OwnerInventory() {
  const token = getToken();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stockDrafts, setStockDrafts] = useState({});
  const [availabilityDrafts, setAvailabilityDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [success, setSuccess] = useState("");

  const loadInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchJson("/api/inventory", {
        errorMessage: "Failed to load inventory.",
      });
      setInventory(data);
    } catch (err) {
      setError(err.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return inventory.filter((item) => item.name.toLowerCase().includes(q) || (item.category || "").toLowerCase().includes(q));
  }, [inventory, searchTerm]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUpdateStock = async (dvdId, currentStock) => {
    const parsed = Number.parseInt(stockDrafts[dvdId] ?? String(currentStock), 10);
    const availability = availabilityDrafts[dvdId] || {};
    if (!Number.isInteger(parsed) || parsed < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    setSavingId(dvdId);
    setError("");
    setSuccess("");
    try {
      const data = await apiFetchJson(`/api/inventory/${dvdId}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          stock: parsed,
          canRent: availability.canRent,
          canBuy: availability.canBuy,
        }),
        errorMessage: "Failed to update stock.",
      });

      setInventory((prev) => prev.map((item) => (item.id === dvdId ? data : item)));
      setStockDrafts((prev) => ({ ...prev, [dvdId]: String(data.stock) }));
      setAvailabilityDrafts((prev) => ({
        ...prev,
        [dvdId]: { canRent: data.canRent, canBuy: data.canBuy },
      }));
      setSuccess(`Updated "${data.name}" settings.`);
    } catch (err) {
      setError(err.message || "Failed to update stock.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="owner-page">
      <div className="owner-inner">
        <header className="owner-head">
          <div>
            <p className="owner-eyebrow">Owner Console</p>
            <h1>DVD Inventory</h1>
          </div>
        </header>

        {error && <p className="owner-error">{error}</p>}
        {success && <p className="owner-success">{success}</p>}

        <section className="owner-panel">
          <input
            className="owner-search"
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          {loading ? (
            <p className="owner-empty">Loading inventory...</p>
          ) : (
            <>
              <div className="owner-list">
                {pageItems.map((dvd) => (
                  <article className="owner-list-row" key={dvd.id}>
                    <strong>{dvd.name}</strong>
                    <span>{dvd.category}</span>
                    <div className="owner-stock-editor">
                      <input
                        type="number"
                        min="0"
                        value={stockDrafts[dvd.id] ?? String(dvd.stock)}
                        onChange={(e) => setStockDrafts((prev) => ({ ...prev, [dvd.id]: e.target.value }))}
                      />
                      <button
                        disabled={savingId === dvd.id}
                        onClick={() => handleUpdateStock(dvd.id, dvd.stock)}
                      >
                        {savingId === dvd.id ? "Saving..." : "Update Stock"}
                      </button>
                    </div>
                    <label className="owner-toggle-option">
                      <input
                        type="checkbox"
                        checked={(availabilityDrafts[dvd.id]?.canRent ?? dvd.canRent) !== false}
                        onChange={(e) =>
                          setAvailabilityDrafts((prev) => ({
                            ...prev,
                            [dvd.id]: {
                              canRent: e.target.checked,
                              canBuy: prev[dvd.id]?.canBuy ?? dvd.canBuy,
                            },
                          }))
                        }
                      />
                      Rent enabled
                    </label>
                    <label className="owner-toggle-option">
                      <input
                        type="checkbox"
                        checked={(availabilityDrafts[dvd.id]?.canBuy ?? dvd.canBuy) !== false}
                        onChange={(e) =>
                          setAvailabilityDrafts((prev) => ({
                            ...prev,
                            [dvd.id]: {
                              canRent: prev[dvd.id]?.canRent ?? dvd.canRent,
                              canBuy: e.target.checked,
                            },
                          }))
                        }
                      />
                      Buy enabled
                    </label>
                  </article>
                ))}
              </div>
              <div className="owner-pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Prev</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
