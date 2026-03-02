import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Catalog from "./components/Catalog";
import DVDDetail from "./components/DVDDetail";
import Account from "./components/Account";
import LandingPage from "./components/LandingPage";

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

function Layout() {
  const location = useLocation();
  const isPublicLanding = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const hideSharedChrome = isPublicLanding || isLoginPage;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!hideSharedChrome && <Navbar />}

      <main style={{ flex: "1" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Hero /></PrivateRoute>} />
          <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
          <Route path="/catalog/:id" element={<PrivateRoute><DVDDetail /></PrivateRoute>} />
          <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
          <Route path="/alerts" element={<PrivateRoute><ComingSoon title="Rental Alerts" /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><ComingSoon title="Cart" /></PrivateRoute>} />
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
