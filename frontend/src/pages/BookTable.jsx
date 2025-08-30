import { useState } from "react";
import "../index.css";
import Navbar from "../Components/Navbar";

export default function BookTable() {
  const [area, setArea] = useState("indoor"); 
  const [selectedTables, setSelectedTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
  });
  const [message, setMessage] = useState(null);

  const indoorTables = Array.from({ length: 10 }, (_, i) => i + 1);
  const outdoorTables = Array.from({ length: 10 }, (_, i) => i + 1);

  const toggleTable = (type, number) => {
    const key = `${type}-${number}`;
    setSelectedTables((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const handleBookClick = () => {
    if (selectedTables.length === 0) {
      setMessage({ type: "error", text: "Please select at least one table." });
      return;
    }
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const confirmBooking = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.guests) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setMessage({
      type: "success",
      text: `Booking confirmed for tables: ${selectedTables.join(", ")}`,
    });

    setSelectedTables([]);
    setFormData({ name: "", email: "", phone: "", guests: "" });
    setShowForm(false);

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="book-table-page">
      <Navbar />
      <h2>
        Book <span>Your Table</span>
      </h2>

      {/* area selection */}
      <div className="area-selection">
        <button
          className={area === "indoor" ? "active" : ""}
          onClick={() => setArea("indoor")}
        >
          Indoor
        </button>
        <button
          className={area === "outdoor" ? "active" : ""}
          onClick={() => setArea("outdoor")}
        >
          Outdoor Garden
        </button>
      </div>

      {/* Indoor section */}
      {area === "indoor" && (
        <section className="indoor-room">
          <h3> Indoor Dining Room</h3>
          <div className="room">
            <div className="door front-door">Front Door</div>
            <div className="label cashier">Cashier</div>
            <div className="label washroom">Washroom</div>

            <div className="tables-grid">
              {indoorTables.map((num) => {
                const key = `indoor-${num}`;
                const isSelected = selectedTables.includes(key);
                return (
                  <div
                    key={key}
                    className={`room-table ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleTable("indoor", num)}
                  >
                    <span className="chair top" />
                    <span className="chair right" />
                    <span className="chair bottom" />
                    <span className="chair left" />
                    <div className="table-number">{num}</div>
                  </div>
                );
              })}
            </div>

            <div className="door back-door">Back Door</div>
          </div>
        </section>
      )}

      {/* Outdoor section */}
      {area === "outdoor" && (
        <section className="outdoor-garden">
          <h3> Outdoor Garden </h3>
          <div className="garden-wrapper">
            <div className="nairobi-container">
              <div className="pool">swimming pool</div>
              <div className="dart">Dart playground</div>
              <div className="kids-area">
                <div> kids play &</div>
                <div> Water Slide</div>
              </div>

              {outdoorTables.map((num) => {
                const key = `outdoor-${num}`;
                const isSelected = selectedTables.includes(key);
                return (
                  <div
                    key={key}
                    className={`garden-table table-${num} ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => toggleTable("outdoor", num)}
                  >
                    <span className="chair top" />
                    <span className="chair right" />
                    <span className="chair bottom" />
                    <span className="chair left" />
                    <div className="table-number">{num}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="controls">
        <button className="confirm-btn" onClick={handleBookClick}>
          {selectedTables.length > 1
            ? "Book Tables"
            : selectedTables.length === 1
            ? "Book Table"
            : "Select Table(s) First"}
        </button>

        <div className="legend">
          <span className="legend-pill available" /> Available
          <span className="legend-pill selected" /> Selected
        </div>
      </div>

      {message && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            borderRadius: "6px",
            textAlign: "center",
            color: message.type === "success" ? "green" : "red",
            background:
              message.type === "success"
                ? "rgba(0,128,0,0.1)"
                : "rgba(255,0,0,0.1)",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Modal for booking form */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              width: "400px",
              maxWidth: "90%",
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: "#333" }}>
              Enter Your Details
            </h3>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              name="guests"
              placeholder="Number of Guests"
              value={formData.guests}
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: "15px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button
                onClick={confirmBooking}
                style={{
                  background: "orange",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "#ccc",
                  color: "black",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
