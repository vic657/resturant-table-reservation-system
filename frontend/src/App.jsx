import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import BookTable from "./pages/BookTable.jsx"; 
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Waiters from "./pages/Waiters";
import Security from "./pages/Security";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Waiters Page (accessible via both URLs) */}
        <Route path="/waiters" element={<Waiters />} />
        <Route path="/admin/support/waiters" element={<Waiters />} />
        <Route path="/admin/security" element={<Security />} />

        {/* Book a Table Page */}
        <Route path="/book-table" element={<BookTable />} />
      </Routes>
    </Router>
  );
}

export default App;
