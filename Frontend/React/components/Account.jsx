import { useNavigate } from "react-router-dom";
import "../styles/account.css";

export default function Account() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
        navigate("/login");
        return null;
    }

    const getInitials = (user) => {
        if (user.name) {
            return user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
        }
        return user.email[0].toUpperCase();
    };

    const displayName = user.name || "Member";
    const memberSince = "February 2026"; // placeholder until we store createdAt on frontend

    return (
        <div className="account-page">
            <div className="account-inner">

                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-avatar">{getInitials(user)}</div>
                    <div className="profile-info">
                        <h1 className="profile-name">{displayName}</h1>
                        <p className="profile-email">{user.email}</p>
                        <span className="member-badge">🎬 Member since {memberSince}</span>
                    </div>
                    <button className="edit-btn">Edit Profile</button>
                </div>

                {/* Stats Row */}
                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-num">0</span>
                        <span className="stat-label">Active Rentals</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-num">3</span>
                        <span className="stat-label">Max Rentals Allowed</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-num">0</span>
                        <span className="stat-label">Total Rented</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-num">0</span>
                        <span className="stat-label">Overdue</span>
                    </div>
                </div>

                <div className="account-grid">
                    {/* Current Rentals */}
                    <section className="account-section">
                        <h2 className="section-heading">Current Rentals</h2>
                        <div className="empty-state">
                            <span className="empty-icon">📀</span>
                            <p>No active rentals right now.</p>
                            <button className="browse-btn" onClick={() => navigate("/catalog")}>
                                Browse Catalog
                            </button>
                        </div>
                    </section>

                    {/* Rental History */}
                    <section className="account-section">
                        <h2 className="section-heading">Rental History</h2>
                        <div className="empty-state">
                            <span className="empty-icon">🎞️</span>
                            <p>No rental history yet.</p>
                        </div>
                    </section>
                </div>

                {/* Account Settings */}
                <section className="account-section settings-section">
                    <h2 className="section-heading">Account Settings</h2>
                    <div className="settings-list">
                        <div className="settings-row">
                            <div>
                                <p className="settings-label">Email Address</p>
                                <p className="settings-value">{user.email}</p>
                            </div>
                            <button className="settings-btn">Change</button>
                        </div>
                        <div className="settings-row">
                            <div>
                                <p className="settings-label">Password</p>
                                <p className="settings-value">••••••••••••</p>
                            </div>
                            <button className="settings-btn">Change</button>
                        </div>
                        <div className="settings-row">
                            <div>
                                <p className="settings-label">Rental Alerts</p>
                                <p className="settings-value">Email notifications for due dates & availability</p>
                            </div>
                            <button className="settings-btn" onClick={() => navigate("/alerts")}>Manage</button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
