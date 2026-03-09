import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";
import { clearCartItems, getCartItems, removeCartItem } from "../utils/cart";
import { recordCheckout } from "../utils/accountActivity";
import { canCheckoutRentals } from "../utils/rentalRules";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState(getCartItems());
  const [checkoutError, setCheckoutError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const lineTotal = item.unitPrice * item.quantity;
        acc.subtotal += lineTotal;
        if (item.mode === "rent") acc.rentals += lineTotal;
        if (item.mode === "buy") acc.purchases += lineTotal;
        return acc;
      },
      { rentals: 0, purchases: 0, subtotal: 0 }
    );
  }, [items]);

  const handleRemove = (itemKey) => {
    const next = removeCartItem(itemKey);
    setItems(next);
  };

  const handleClear = () => {
    clearCartItems();
    setItems([]);
  };

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || items.length === 0 || isCheckingOut) return;

    setCheckoutError("");
    setIsCheckingOut(true);

    try {
      const limitCheck = canCheckoutRentals(user);
      if (!limitCheck.allowed) {
        setCheckoutError(`You can only rent up to ${limitCheck.maxAllowed} DVDs at a time.`);
        setIsCheckingOut(false);
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({ id: item.id, quantity: item.quantity, mode: item.mode })),
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setCheckoutError(payload.error || "Checkout failed. Please try again.");
        setIsCheckingOut(false);
        return;
      }

      recordCheckout(user, items);
      clearCartItems();
      setItems([]);
      navigate("/account");
    } catch {
      setCheckoutError("Could not reach server to complete checkout.");
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-inner">
        <header className="cart-head">
          <div>
            <p className="cart-eyebrow">Checkout Prep</p>
            <h1>Your Cart</h1>
          </div>
          <button className="cart-secondary-btn" onClick={() => navigate("/catalog")}>
            Keep Browsing
          </button>
        </header>

        {items.length === 0 ? (
          <section className="cart-empty">
            <p>Your cart is empty.</p>
            <button className="cart-primary-btn" onClick={() => navigate("/catalog")}>
              Browse Catalog
            </button>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.itemKey}>
                  <img src={item.image || "/placeholder-dvd.png"} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h2>{item.name}</h2>
                    <p className="cart-item-mode">{item.mode === "rent" ? "Rental" : "Purchase"}</p>
                    <p className="cart-item-price">
                      ${item.unitPrice.toFixed(2)}
                      {item.mode === "rent" ? " / day" : ""}
                    </p>
                    <p className="cart-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <div className="cart-item-actions">
                    <strong>${(item.unitPrice * item.quantity).toFixed(2)}</strong>
                    <button className="cart-remove-btn" onClick={() => handleRemove(item.itemKey)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Rentals</span>
                <span>${totals.rentals.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Purchases</span>
                <span>${totals.purchases.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <button className="cart-primary-btn" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? "Processing..." : "Checkout"}
              </button>
              <button className="cart-secondary-btn full" onClick={handleClear}>
                Clear Cart
              </button>
              {checkoutError && <p className="cart-error">{checkoutError}</p>}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
