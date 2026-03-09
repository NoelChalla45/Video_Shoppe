import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Catalog from "./components/Catalog";
import DVDDetail from "./components/DVDDetail";
import Account from "./components/Account";
import Cart from "./components/Cart";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Inventory from "./components/Inventory";
import CustomerActivity from "./components/CustomerActivity";
import OwnerDashboard from "./components/OwnerDashboard";
import OwnerStock from "./components/OwnerStock";
import OwnerInventory from "./components/OwnerInventory";
import OwnerEmployees from "./components/OwnerEmployees";
import LandingPage from "./components/LandingPage";
import CatalogPreview from "./components/CatalogPreview";

function ComingSoon({ title }) {
  return (
    <div className="coming-soon">
      <div className="coming-soon-card">
        <h2>{title}</h2>
        <p>This section is on deck and will be available soon.</p>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ allowedRoles, children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "OWNER" ? "/owner" : user.role === "EMPLOYEE" ? "/employee" : "/home"} replace />;
  }
  return children;
}

function Layout() {
  const location = useLocation();
  const isPublicLanding = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isCatalogPreviewPage = location.pathname === "/catalog-preview";
  const hideSharedChrome = isPublicLanding || isLoginPage || isCatalogPreviewPage;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!hideSharedChrome && <Navbar />}

      <main style={{ flex: "1" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalog-preview" element={<CatalogPreview />} />
          <Route
            path="/home"
            element={
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <Hero />
              </RoleRoute>
            }
          />
          <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
          <Route path="/catalog/:id" element={<PrivateRoute><DVDDetail /></PrivateRoute>} />
          <Route
            path="/account"
            element={
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <Account />
              </RoleRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <ComingSoon title="Rental Alerts" />
              </RoleRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <Cart />
              </RoleRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <RoleRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <RoleRoute allowedRoles={["EMPLOYEE"]}>
                <Inventory />
              </RoleRoute>
            }
          />
          <Route
            path="/customer-activity"
            element={
              <RoleRoute allowedRoles={["EMPLOYEE"]}>
                <CustomerActivity />
              </RoleRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <RoleRoute allowedRoles={["OWNER"]}>
                <OwnerDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/owner/stock"
            element={
              <RoleRoute allowedRoles={["OWNER"]}>
                <OwnerStock />
              </RoleRoute>
            }
          />
          <Route
            path="/owner/inventory"
            element={
              <RoleRoute allowedRoles={["OWNER"]}>
                <OwnerInventory />
              </RoleRoute>
            }
          />
          <Route
            path="/owner/employees"
            element={
              <RoleRoute allowedRoles={["OWNER"]}>
                <OwnerEmployees />
              </RoleRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!hideSharedChrome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
