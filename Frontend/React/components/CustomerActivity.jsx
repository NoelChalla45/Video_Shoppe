import { useEffect, useState } from "react";
import "../styles/employee.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CustomerActivity() {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API}/api/orders/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load customer activity.");
        }
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to load customer activity.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  return (
    <div className="employee-page">
      <div className="employee-inner">
        <header className="employee-head">
          <div>
            <p className="employee-eyebrow">Employee Operations</p>
            <h1>Recent Customer Purchases/Rentals</h1>
          </div>
        </header>

        {error && <p className="employee-error">{error}</p>}

        <section className="employee-panel">
          <h2>Customer Activity</h2>
          {loading ? (
            <p className="employee-empty">Loading activity...</p>
          ) : orders.length === 0 ? (
            <p className="employee-empty">No customer orders yet.</p>
          ) : (
            <div className="employee-orders">
              {orders.map((order) => (
                <article className="employee-order-card" key={order.id}>
                  <div className="employee-order-head">
                    <strong>{order.user?.name || order.user?.email || "Customer"}</strong>
                    <span>${Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.title} x{item.quantity} ({item.orderType.toLowerCase()})
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
