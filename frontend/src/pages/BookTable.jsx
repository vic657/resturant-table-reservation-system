import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import "../index.css";
import Navbar from "../Components/Navbar";

export default function BookTable() {
  const navigate = useNavigate();
  const [area, setArea] = useState("indoor");
  const [selectedTables, setSelectedTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [checkingTables, setCheckingTables] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(false);
  const [bookedTables, setBookedTables] = useState([]); // ✅ store booked tables
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    date: "",
    time: "",
  });
  const [message, setMessage] = useState(null);

  const indoorTables = Array.from({ length: 10 }, (_, i) => i + 1);
  const outdoorTables = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    let active = true;
    setSelectedTables([]);
    setAvailabilityError(false);
    setBookedTables([]);
    if (!formData.date) { setCheckingTables(false); return; }
    setCheckingTables(true);
    axiosClient.post('/booked-tables', { date: formData.date })
      .then(res => { if (active) setBookedTables(res.data); })
      .catch(() => { if (active) { setAvailabilityError(true); setMessage({ type: 'error', text: 'Unable to check table availability. Please select the date again.' }); } })
      .finally(() => { if (active) setCheckingTables(false); });
    return () => { active = false; };
  }, [formData.date]);

  const toggleTable = (type, number) => {
    if (!formData.date) {
      setMessage({ type: "error", text: "Please select a date first." });
      return;
    }
    if (checkingTables || availabilityError) return;
    setMessage(null);
    const key = `${type}-${number}`;

    // Prevent selecting already booked tables
    if (bookedTables.includes(key)) {
      setMessage({ type: "error", text: `Table ${key} is already booked.` });
      return;
    }

    setSelectedTables((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const handleBookClick = () => {
    if (checkingTables || availabilityError || selectedTables.length === 0) {
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
    if (!selectedTables.length || checkingTables || availabilityError) {
      setShowForm(false); setMessage({ type: "error", text: "Please select your table for this date before continuing." }); return;
    }
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.guests ||
      !formData.date ||
      !formData.time
    ) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    const pendingBooking = {
      tables: selectedTables,
      customer: { ...formData },
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("pendingBooking", JSON.stringify(pendingBooking));
    } catch (err) {
      console.error("Failed to save pending booking:", err);
      setMessage({ type: "error", text: "Unable to proceed. Try again." });
      return;
    }

    setShowForm(false);
    setSelectedTables([]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      guests: "",
      date: "",
      time: "",
    });

    navigate("/menu");
  };

  return (
    <div className="book-table-page">
      <Navbar />
      <h2>
        Book <span>Your Table</span>
      </h2>

      {/* Step 1: Date & Time selection */}
      <div
        className="date-time-selection"
        style={{ marginBottom: "20px", textAlign: "center" }}
      >
        <input
          type="date"
          aria-label="Booking date" name="date"
          value={formData.date || ""}
          onChange={handleChange}
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="time"
          aria-label="Booking time" name="time"
          value={formData.time || ""}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {!formData.date && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
          Please select a date before choosing tables.
        </p>
      )}

      {checkingTables && <p role="status">Checking table availability…</p>}
      {/* Area selection */}
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
                const isBooked = bookedTables.includes(key);
                return (
                  <div
                    key={key}
                    className={`room-table 
                      ${isSelected ? "selected" : ""} 
                      ${isBooked ? "booked" : ""}`}
                    role="button" tabIndex={isBooked ? -1 : 0} aria-disabled={isBooked || checkingTables || availabilityError} aria-pressed={isSelected} aria-label={`indoor table ${num}`}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTable("indoor", num); } }}
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
                const isBooked = bookedTables.includes(key);
                return (
                  <div
                    key={key}
                    className={`garden-table table-${num} 
                      ${isSelected ? "selected" : ""} 
                      ${isBooked ? "booked" : ""}`}
                    role="button" tabIndex={isBooked ? -1 : 0} aria-disabled={isBooked || checkingTables || availabilityError} aria-pressed={isSelected} aria-label={`outdoor table ${num}`}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTable("outdoor", num); } }}
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
        <button className="confirm-btn" disabled={checkingTables || availabilityError} onClick={handleBookClick}>
          {selectedTables.length > 1
            ? "Book Tables"
            : selectedTables.length === 1
            ? "Book Table"
            : "Select Table(s) First"}
        </button>

        <div className="legend">
          <span className="legend-pill available" /> Available
          <span className="legend-pill selected" /> Selected
          <span className="legend-pill booked" /> Booked
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

      {/* Modal */}
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
              maxHeight: "calc(100dvh - 40px)",
              overflowY: "auto",
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
              aria-label="Booking name" name="name"
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
              aria-label="Booking email" name="email"
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
              aria-label="Booking phone" name="phone"
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
              aria-label="Booking guests" name="guests"
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
            <input
              type="date"
              aria-label="Booking date" name="date"
              placeholder="Booking Date"
              value={formData.date || ""}
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
              type="time"
              aria-label="Booking time" name="time"
              placeholder="Booking Time"
              value={formData.time || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: "15px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
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
                Make Your Orders
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
