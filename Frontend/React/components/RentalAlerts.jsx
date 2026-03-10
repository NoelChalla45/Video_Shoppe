// Customer rental alerts placeholder until alert rules are implemented.
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/alerts.css";
import { getStoredUser } from "../utils/auth";

export default function RentalAlerts() {
  const navigate = useNavigate();
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="alerts-page">
      <div className="alerts-inner">
        <header className="alerts-head">
          <div>
            <p className="alerts-eyebrow">Customer Alerts</p>
            <h1>Rental Alerts</h1>
          </div>
          <div className="alerts-head-actions">
            <button className="alerts-btn" onClick={() => navigate("/account")}>Back to Account</button>
            <button className="alerts-btn alerts-btn-primary" onClick={() => navigate("/catalog")}>Browse Catalog</button>
          </div>
        </header>
        <div className="alerts-empty-state">
          <p>No alerts to display.</p>
        </div>
      </div>
    </div>
  );
}
