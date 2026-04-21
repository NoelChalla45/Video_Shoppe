// Shopping cart page for rentals and purchases before checkout.
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";
import { clearCartItems, getCartItems, removeCartItem } from "../utils/cart";
import { apiFetchJson } from "../utils/api";
import { getStoredUser, getToken } from "../utils/auth";
import { getActiveRentalQuantityFromOrders } from "../utils/orders";
import { canCheckoutRentals } from "../utils/rentalRules";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PHONE_DIGIT_COUNT = 10;

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "").slice(0, PHONE_DIGIT_COUNT);
}

function formatPhone(value) {
  const digits = normalizePhone(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidPhone(value) {
  return normalizePhone(value).length === PHONE_DIGIT_COUNT;
}

function isValidAddress(value) {
  const normalized = String(value || "").trim().replace(/\s+/g, " ");
  return normalized.length >= 5 && /[A-Za-z]/.test(normalized) && /\d/.test(normalized);
}


function StripeCheckoutForm({
  items,
  total,
  phone,
  address,
  onSuccess,
  setIsCheckingOut,
  isCheckingOut,
  onCancel
}) {
  const stripe = useStripe();
  const elements = useElements();
  const token = getToken();

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsCheckingOut(true);

    try {
      const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const intentRes = await fetch(`${API}/api/orders/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": authHeader },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });

      const { clientSecret, error: intentErr } = await intentRes.json();
      if (!intentRes.ok) throw new Error(intentErr || "Server error.");

      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (stripeErr) throw new Error(stripeErr.message);

      if (paymentIntent.status === "succeeded") {
        const orderRes = await fetch(`${API}/api/orders/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": authHeader },
          body: JSON.stringify({
            items: items.map(i => ({ id: i.id, quantity: i.quantity, mode: i.mode })),
            contact: { phone, address }
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.error || "Order failed to save.");

        onSuccess();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="stripe-form">
      <div className="card-input-container" style={{ padding: '12px', background: '#1a1a1a', borderRadius: '4px', marginBottom: '15px', border: '1px solid #333' }}>
        <CardElement options={{
          hidePostalCode: true,
          style: { base: { fontSize: "16px", color: "#fff", "::placeholder": { color: "#666" } } }
        }} />
      </div>
      <button className="cart-primary-btn" type="submit" disabled={isCheckingOut || !stripe}>
        {isCheckingOut ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
      <button className="cart-secondary-btn full" type="button" onClick={onCancel} disabled={isCheckingOut} style={{ marginTop: '10px' }}>
        Back to Details
      </button>
    </form>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const userId = user?.id || "";
  const token = getToken();

  const [items, setItems] = useState([]);
  const [checkoutForm, setCheckoutForm] = useState({
    phone: formatPhone(user?.phone || ""),
    address: user?.address || "",
  });
  const [checkoutError, setCheckoutError] = useState("");
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeRentalQty, setActiveRentalQty] = useState(0);
  const [isLoadingRentalState, setIsLoadingRentalState] = useState(true);
  const [showStripe, setShowStripe] = useState(false);

  // Build the order summary values shown in the sidebar.
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

  useEffect(() => {
    const loadOrders = async () => {
      if (!token || !user) {
        setItems([]);
        setActiveRentalQty(0);
        setIsLoadingCart(false);
        setIsLoadingRentalState(false);
        return;
      }

      setIsLoadingCart(true);
      setIsLoadingRentalState(true);

      try {
        const [profileResponse, orders, cartItems] = await Promise.all([
          apiFetchJson("/api/auth/me", {
            token,
            errorMessage: "Failed to load checkout details.",
          }),
          apiFetchJson("/api/orders/mine", {
            token,
            errorMessage: "Failed to load active rentals.",
          }),
          getCartItems(token),
        ]);

        setItems(Array.isArray(cartItems) ? cartItems : []);
        setCheckoutForm({
          phone: formatPhone(profileResponse.user?.phone || user?.phone || ""),
          address: profileResponse.user?.address || user?.address || "",
        });
        setActiveRentalQty(getActiveRentalQuantityFromOrders(orders));
      } catch (err) {
        setCheckoutError(err.message || "Failed to load checkout details.");
      } finally {
        setIsLoadingCart(false);
        setIsLoadingRentalState(false);
      }
    };

    loadOrders();
  }, [token, userId]);

  const handleRemove = async (item) => {
    try {
      const next = await removeCartItem(item.id, item.mode, token);
      setItems(Array.isArray(next) ? next : []);
    } catch (err) {
      setCheckoutError(err.message || "Failed to remove item from cart.");
    }
  };

  const handleClear = async () => {
    try {
      const next = await clearCartItems(token);
      setItems(Array.isArray(next) ? next : []);
    } catch (err) {
      setCheckoutError(err.message || "Failed to clear cart.");
    }
  };

  const handleProceedToPayment = () => {
    setCheckoutError("");
    
    if (!isValidPhone(checkoutForm.phone)) {
      setCheckoutError("Enter a valid 10-digit phone number before checkout.");
      return;
    }

    if (!isValidAddress(checkoutForm.address)) {
      setCheckoutError("Enter a valid street address with both letters and numbers before checkout.");
      return;
    }

    const limitCheck = canCheckoutRentals(activeRentalQty, items);
    if (!limitCheck.allowed) {
      setCheckoutError(`You can only rent up to ${limitCheck.maxAllowed} DVDs at a time.`);
      return;
    }

    setShowStripe(true);
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

        {isLoadingCart ? (
          <section className="cart-empty">
            <p>Loading your cart...</p>
          </section>
        ) : items.length === 0 ? (
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
                    <button className="cart-remove-btn" onClick={() => handleRemove(item)}>
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

              {!showStripe ? (
                <div className="cart-checkout-fields">
                  <div className="cart-field">
                    <label htmlFor="checkout-phone">Phone Number</label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                      placeholder="(555) 123-4567"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="cart-field">
                    <label htmlFor="checkout-address">Address</label>
                    <textarea
                      id="checkout-address"
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Main St, City, State ZIP"
                      rows="3"
                    />
                  </div>
                  <button className="cart-primary-btn" onClick={handleProceedToPayment} disabled={isLoadingRentalState}>
                    {isLoadingRentalState ? "Loading..." : "Proceed to Payment"}
                  </button>
                </div>
              ) : (
                <div className="stripe-checkout-section">
                  <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '10px' }}>Secure Stripe Payment</p>
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm
                      items={items}
                      total={totals.subtotal}
                      phone={checkoutForm.phone}
                      address={checkoutForm.address}
                      isCheckingOut={isCheckingOut}
                      setIsCheckingOut={setIsCheckingOut}
                      onCancel={() => setShowStripe(false)}
                      onSuccess={() => { 
                        handleClear(); 
                        navigate("/account"); 
                      }}
                    />
                  </Elements>
                </div>
              )}

              <button className="cart-secondary-btn full" onClick={handleClear} disabled={isCheckingOut}>
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
