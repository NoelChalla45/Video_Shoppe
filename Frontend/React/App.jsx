import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


// Also make sure to add some customization to the login page, make it look nice. 
// (Not required now)
function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        
        {/* This spacer pushes everything below the Navbar */}
        <div style={{ height: "80px" }}></div> 

        <main style={{ flex: "1" }}>
          <Routes>
            {/* Default route redirects to Login */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Login Page Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Home/Hero Page Route */}
            <Route path="/home" element={<Hero />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
