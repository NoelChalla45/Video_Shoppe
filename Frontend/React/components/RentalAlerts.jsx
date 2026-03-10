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

        <div className="alerts-summary">
          <article className="alerts-stat-card">
            <span className="alerts-stat-num">0</span>
            <span className="alerts-stat-label">ALERTS ACTIVE</span>
          </article>
          <article className="alerts-stat-card alerts-stat-card-warning">
            <span className="alerts-stat-num">0</span>
            <span className="alerts-stat-label">AUTO FLAGS</span>
          </article>
        </div>

        <div className="alerts-grid">
          <section className="alerts-section">
            <h2>Rental Alerts</h2>
            <p className="alerts-helper">Automatic due-date and overdue alerts are currently disabled.</p>
            <div className="alerts-empty-state">
              <p>This tab is being reserved for the alert workflow your teammates will implement.</p>
            </div>
          </section>

          <section className="alerts-section alerts-section-overdue">
            <h2>Status</h2>
            <p className="alerts-helper">No rentals are being classified by urgency on this page.</p>
            <div className="alerts-empty-state">
              <p>Due-soon and overdue calculations have been removed from the current UI.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
