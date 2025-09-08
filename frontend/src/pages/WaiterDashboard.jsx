import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";

export default function WaiterDashboard() {
  const [activePage, setActivePage] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [receiptCode, setReceiptCode] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  // ===== Get logged-in waiter dynamically =====
  const user = JSON.parse(localStorage.getItem("user"));
  const waiterId = user?.id;

  useEffect(() => {
    if (waiterId) fetchOrders();
  }, [waiterId]);

  // ===== Fetch orders assigned to this waiter =====
  const fetchOrders = async () => {
    if (!waiterId) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/waiters/${waiterId}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchBookingByCode = async () => {
    if (!receiptCode) return;
    setLoadingBooking(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/bookings/receipt/${receiptCode}`);
      setBookingDetails(res.data);
    } catch (err) {
      console.error("Invalid receipt code", err);
      setBookingDetails(null);
      alert("Receipt code not found!");
    } finally {
      setLoadingBooking(false);
    }
  };

  const serveOrder = async (orderId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/orders/${orderId}/served`, {
        waiter_id: waiterId,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "served", waiter_id: waiterId } : order
        )
      );
      alert("Order marked as served!");
    } catch (err) {
      console.error("Failed to serve order", err);
      alert("Failed to mark as served.");
    }
  };

  // ===== Common styles =====
  const buttonStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.2s",
  };

  const sidebarButton = (active) => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    textAlign: "left",
    cursor: "pointer",
    marginBottom: "4px",
    backgroundColor: active ? "#f97316" : "#fff",
    color: active ? "#fff" : "#4b5563",
  });

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f3f4f6" }}>
      {/* Sidebar */}
      <aside style={{ width: "250px", background: "#fff", display: "flex", flexDirection: "column", boxShadow: "2px 0 5px rgba(0,0,0,0.1)" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>Waiter Panel</h2>
        </div>
        <nav style={{ flex: 1, padding: "20px 10px", display: "flex", flexDirection: "column" }}>
          <div style={sidebarButton(activePage === "orders")} onClick={() => setActivePage("orders")}>
            Orders
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {activePage === "orders" && (
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#1f2937", marginBottom: "20px" }}>Orders to Attend</h1>

              {/* Receipt code input */}
              <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  value={receiptCode}
                  onChange={(e) => setReceiptCode(e.target.value)}
                  placeholder="Enter Receipt Code"
                  style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", width: "250px" }}
                />
                <button
                  onClick={fetchBookingByCode}
                  style={{ ...buttonStyle, background: "#3b82f6", color: "#fff" }}
                >
                  Fetch Booking
                </button>
              </div>

              {/* Booking details */}
              {loadingBooking && <p>Loading booking details...</p>}
              {bookingDetails && (
                <div style={{ marginBottom: "20px", padding: "15px", background: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
                  <h2 style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px" }}>
                    Booking: {bookingDetails.booking.receipt_code}
                  </h2>
                  <p><strong>Name:</strong> {bookingDetails.booking.name}</p>
                  {bookingDetails.booking.email && <p><strong>Email:</strong> {bookingDetails.booking.email}</p>}
                  <p><strong>Phone:</strong> {bookingDetails.booking.phone}</p>
                  <p><strong>Tables:</strong> {bookingDetails.booking.tables.join(", ")}</p>
                  <p><strong>Date & Time:</strong> {bookingDetails.booking.date} {bookingDetails.booking.time}</p>

                  <h3 style={{ fontWeight: "bold", marginTop: "10px" }}>Orders:</h3>
                  <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                    {bookingDetails.orders.map((order) => (
                      <li key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
                        <span>{order.quantity}x {order.name} (Ksh {order.price})</span>
                        {order.status !== "served" && (
                          <button
                            onClick={() => serveOrder(order.id)}
                            style={{ ...buttonStyle, background: "#22c55e", color: "#fff" }}
                          >
                            Serve
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Assigned orders */}
              <div>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      style={{ padding: "15px", background: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}
                    >
                      <div>
                        <h3 style={{ fontWeight: "bold" }}>Table {order.booking?.table_number || "N/A"}</h3>
                        <p>{order.quantity}x {order.name}</p>
                        <p style={{ marginTop: "5px", color: order.status === "served" ? "#16a34a" : "#facc15" }}>
                          Status: {order.status}
                        </p>
                      </div>
                      {order.status !== "served" && (
                        <button
                          onClick={() => serveOrder(order.id)}
                          style={{ ...buttonStyle, background: "#22c55e", color: "#fff" }}
                        >
                          Mark as Served
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No orders assigned yet.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
