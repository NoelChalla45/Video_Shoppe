// Employee view of customer details and purchase/rental activity.
import { useEffect, useMemo, useState } from "react";
import "../styles/employee.css";
import { apiFetchJson } from "../utils/api";
import { getToken } from "../utils/auth";
import { getAccountActivityFromOrders } from "../utils/orders";

export default function CustomerActivity() {
  const token = getToken();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerDetail, setCustomerDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [returningItemId, setReturningItemId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetchJson("/api/orders/customers", {
          token,
          errorMessage: "Failed to load customers.",
        });
        setCustomers(data);
        if (data[0]?.id) {
          setSelectedCustomerId(data[0].id);
        }
      } catch (err) {
        setError(err.message || "Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [token]);

  useEffect(() => {
    if (!selectedCustomerId) {
      setCustomerDetail(null);
      return;
    }

    const loadCustomerDetail = async () => {
      setDetailLoading(true);
      setError("");
      try {
        const data = await apiFetchJson(`/api/orders/customers/${selectedCustomerId}`, {
          token,
          errorMessage: "Failed to load customer details.",
        });
        setCustomerDetail(data);
      } catch (err) {
        setError(err.message || "Failed to load customer details.");
        setCustomerDetail(null);
      } finally {
        setDetailLoading(false);
      }
    };

    loadCustomerDetail();
  }, [selectedCustomerId, token]);

  const customerOrders = customerDetail?.orders || [];
  const customer = customerDetail?.customer || null;
  const customerActivity = useMemo(() => getAccountActivityFromOrders(customerOrders), [customerOrders]);
  const orderSummary = useMemo(() => {
    return customerOrders.reduce(
      (acc, order) => {
        acc.totalSpent += Number(order.totalAmount || 0);
        order.items.forEach((item) => {
          if (item.orderType === "PURCHASE") {
            acc.totalPurchases += Number(item.quantity || 0);
          } else {
            acc.totalRentals += Number(item.quantity || 0);
          }
        });
        return acc;
      },
      { totalSpent: 0, totalPurchases: 0, totalRentals: 0 }
    );
  }, [customerOrders]);

  const handleReturn = async (orderItemId) => {
    setReturningItemId(orderItemId);
    setError("");

    try {
      const data = await apiFetchJson(`/api/orders/items/${orderItemId}/return`, {
        method: "POST",
        token,
        errorMessage: "Failed to process DVD return.",
      });
      setCustomerDetail(data);
    } catch (err) {
      setError(err.message || "Failed to process DVD return.");
    } finally {
      setReturningItemId(null);
    }
  };

  return (
    <div className="employee-page">
      <div className="employee-inner">
        <header className="employee-head">
          <div>
            <p className="employee-eyebrow">Employee Operations</p>
            <h1>Customer Activity</h1>
          </div>
        </header>

        {error && <p className="employee-error">{error}</p>}

        <section className="employee-panel">
          <h2>Customers</h2>
          {loading ? (
            <p className="employee-empty">Loading customers...</p>
          ) : customers.length === 0 ? (
            <p className="employee-empty">No customers found yet.</p>
          ) : (
            <div className="employee-customers-layout">
              <div className="employee-customer-list">
                {customers.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={`employee-customer-btn ${selectedCustomerId === entry.id ? "active" : ""}`}
                    onClick={() => setSelectedCustomerId(entry.id)}
                  >
                    <strong>{entry.name || entry.email}</strong>
                    <span>{entry.email}</span>
                  </button>
                ))}
              </div>

              <aside className="employee-customer-detail">
                {!selectedCustomerId ? (
                  <p className="employee-empty">Select a customer to view details.</p>
                ) : detailLoading ? (
                  <p className="employee-empty">Loading customer details...</p>
                ) : !customer ? (
                  <p className="employee-empty">Customer details unavailable.</p>
                ) : (
                  <>
                    <div className="employee-customer-head">
                      <div>
                        <h3>{customer.name || "Customer"}</h3>
                        <p>{customer.email}</p>
                      </div>
                    </div>

                    <div className="employee-account-details">
                      <article>
                        <span>Phone</span>
                        <strong>{customer.phone || "N/A"}</strong>
                      </article>
                      <article>
                        <span>Address</span>
                        <strong>{customer.address || "N/A"}</strong>
                      </article>
                      <article>
                        <span>Member Since</span>
                        <strong>{new Date(customer.createdAt).toLocaleDateString()}</strong>
                      </article>
                      <article>
                        <span>Status</span>
                        <strong>{customer.isActive ? "Active" : "Inactive"}</strong>
                      </article>
                      <article>
                        <span>Total Rentals</span>
                        <strong>{orderSummary.totalRentals}</strong>
                      </article>
                      <article>
                        <span>Total Purchases</span>
                        <strong>{orderSummary.totalPurchases}</strong>
                      </article>
                      <article>
                        <span>Orders</span>
                        <strong>{customerOrders.length}</strong>
                      </article>
                      <article>
                        <span>Total Spent</span>
                        <strong>${orderSummary.totalSpent.toFixed(2)}</strong>
                      </article>
                    </div>

                    <div className="employee-customer-activity">
                      <h3>Active Rentals</h3>
                      {customerActivity.activeRentals.length === 0 ? (
                        <p className="employee-empty">No active rentals for this customer.</p>
                      ) : (
                        <div className="employee-orders">
                          {customerActivity.activeRentals.map((rental) => (
                            <article className="employee-order-card" key={rental.rentalId}>
                              <div className="employee-order-head">
                                <strong>{rental.name}</strong>
                                <span>Qty {rental.quantity}</span>
                              </div>
                              <p>Rented: {new Date(rental.rentedAt).toLocaleString()}</p>
                              <p>Due: {new Date(rental.dueDate).toLocaleString()}</p>
                              <button
                                type="button"
                                className="employee-return-btn"
                                disabled={returningItemId === rental.orderItemId}
                                onClick={() => handleReturn(rental.orderItemId)}
                              >
                                {returningItemId === rental.orderItemId ? "Processing..." : "Mark Returned"}
                              </button>
                            </article>
                          ))}
                        </div>
                      )}

                      <h3>Order Activity</h3>
                      {customerOrders.length === 0 ? (
                        <p className="employee-empty">This customer has no order history yet.</p>
                      ) : (
                        <div className="employee-orders">
                          {customerOrders.map((order) => (
                            <article className="employee-order-card" key={order.id}>
                              <div className="employee-order-head">
                                <strong>Order #{order.id.slice(-6).toUpperCase()}</strong>
                                <span>${Number(order.totalAmount).toFixed(2)}</span>
                              </div>
                              <p>{new Date(order.createdAt).toLocaleString()}</p>
                              <ul>
                                {order.items.map((item) => (
                                  <li key={item.id}>
                                    {item.title} x{item.quantity} ({item.orderType.toLowerCase()}
                                    {item.returnedAt ? `, returned ${new Date(item.returnedAt).toLocaleString()}` : item.orderType === "RENTAL" ? ", active" : ""}
                                    )
                                  </li>
                                ))}
                              </ul>
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </aside>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
