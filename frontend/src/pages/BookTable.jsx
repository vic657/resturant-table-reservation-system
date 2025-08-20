import { useState, useEffect } from "react";
import "../index.css";
import Navbar from "../Components/Navbar";

export default function BookTable() {
  const [area, setArea] = useState("indoor"); // "indoor" | "outdoor"
  const [selectedTables, setSelectedTables] = useState([]);
  const [outdoorPositions, setOutdoorPositions] = useState({});

  const indoorTables = Array.from({ length: 10 }, (_, i) => i + 1);
  const outdoorTables = Array.from({ length: 10 }, (_, i) => i + 1);

  // Generate stable random positions once (on mount)
  useEffect(() => {
    const positions = {};
    outdoorTables.forEach((num) => {
      positions[`outdoor-${num}`] = {
        top: Math.floor(Math.random() * 70) + 10, // percent
        left: Math.floor(Math.random() * 75) + 10, // percent
      };
    });
    setOutdoorPositions(positions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTable = (type, number) => {
    const key = `${type}-${number}`;
    setSelectedTables((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const confirmBooking = () => {
    if (selectedTables.length === 0) {
      alert("Please select at least one table.");
      return;
    }
    alert(` Tables booked: ${selectedTables.join(", ")}`);
  };

  return (
    <div className="book-table-page">
        <Navbar /> 
      <h2> Book <span>Your Table</span></h2>

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

      {/* ===== INDOOR ===== */}
      {area === "indoor" && (
        <section className="indoor-room">
          <h3> Indoor Dining Room</h3>

          <div className="room">
            {/* Front Door (top) */}
            <div className="door front-door">Front Door</div>

            {/* Cashier (near front-left) */}
            <div className="label cashier" title="Cashier">
               Cashier
            </div>

            {/* Washroom (right side) */}
            <div className="label washroom" title="Washroom">
               Washroom
            </div>

            {/* Tables grid inside the room */}
            <div className="tables-grid" role="list" aria-label="Indoor tables">
              {indoorTables.map((num) => {
                const key = `indoor-${num}`;
                const isSelected = selectedTables.includes(key);
                return (
                  <div
                    key={key}
                    role="listitem"
                    className={`room-table ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleTable("indoor", num)}
                    aria-pressed={isSelected}
                    aria-label={`Indoor table ${num}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") toggleTable("indoor", num);
                    }}
                  >
                    {/* chairs */}
                    <span className="chair top" />
                    <span className="chair right" />
                    <span className="chair bottom" />
                    <span className="chair left" />
                    <div className="table-number">{num}</div>
                  </div>
                );
              })}
            </div>

            {/* Back Door (bottom) */}
            <div className="door back-door">Back Door</div>
          </div>
        </section>
      )}

      {/* ===== OUTDOOR ===== */}
{area === "outdoor" && (
  <section className="outdoor-garden">
    <h3> Outdoor Garden </h3>

    <div className="garden-wrapper">
      {/* Nairobi-shaped clipped container */}
      <div className="nairobi-container">
        {/* Pool */}
        <div className="pool" title="Swimming pool">swimming pool</div>

        {/* Dart area */}
        <div className="dart" title="Dart playground">Dart playground</div>

        {/* Kids area */}
        <div className="kids-area" title="Kids play area">
          <div> kids play &</div>
          <div> Water Slide</div>
        </div>

        {/* Outdoor tables */}
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
        <button className="confirm-btn" onClick={confirmBooking}>
          Confirm Booking
        </button>
        <div className="legend">
          <span className="legend-pill available" /> Available
          <span className="legend-pill selected" /> Selected
        </div>
      </div>
    </div>
  );
}
