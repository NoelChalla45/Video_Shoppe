import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Catalog from "./components/Catalog";
import DVDDetail from "./components/DVDDetail";
import Account from "./components/Account";

// Redirect to login if no token in localStorage
function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />

        <main style={{ flex: "1" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<PrivateRoute><Hero /></PrivateRoute>} />
            <Route path="/catalog" element={<PrivateRoute><Catalog /></PrivateRoute>} />
            <Route path="/catalog/:id" element={<PrivateRoute><DVDDetail /></PrivateRoute>} />
            <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
