import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import BookTable from "./pages/BookTable.jsx"; // 👈 import the new page

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Book a Table Page */}
        <Route path="/book-table" element={<BookTable />} />

        {/* Other routes (e.g. login, dashboard, etc.) */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
