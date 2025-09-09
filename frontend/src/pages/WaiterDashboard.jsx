import { useState, useEffect } from "react";
import axiosClient from "../axiosClient"; // ✅ use configured client
import Navbar from "../Components/Navbar";
import "../WaiterDashboard.css";

export default function WaiterDashboard() {
  const [activePage, setActivePage] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [receiptCode, setReceiptCode] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      const res = await axiosClient.get(`/waiters/${waiterId}/orders`); // ✅ baseURL handled
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchBookingByCode = async () => {
    if (!receiptCode) return;
    setLoadingBooking(true);
    try {
      const res = await axiosClient.get(`/bookings/receipt/${receiptCode}`); // ✅ baseURL handled
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
      await axiosClient.put(`/orders/${orderId}/served`, { waiter_id: waiterId }); // ✅ baseURL handled
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: "served", waiter_id: waiterId }
            : order
        )
      );
      alert("Order marked as served!");
    } catch (err) {
      console.error("Failed to serve order", err);
      alert("Failed to mark as served.");
    }
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <div className="waiter-wrapper">
      {/* Sidebar */}
      <aside className={`waiter-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Waiter Panel</h2>
        </div>
        <nav>
          <button
            className={activePage === "orders" ? "active" : ""}
            onClick={() => handleNavClick("orders")}
          >
            Orders
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="waiter-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar toggle */}
      <button
        className="waiter-sidebar-toggle"
        onClick={() => setSidebarOpen((s) => !s)}
      >
        ☰
      </button>

      {/* Main */}
      <div className="waiter-main">
        <div className="waiter-top">
          <Navbar />
        </div>
        <div className="waiter-content">
          {activePage === "orders" && (
            <>
              <h1 className="page-title">Orders to Attend</h1>

              {/* Receipt Code */}
              <div className="receipt-search">
                <input
                  type="text"
                  value={receiptCode}
                  onChange={(e) => setReceiptCode(e.target.value)}
                  placeholder="Enter Receipt Code"
                />
                <button onClick={fetchBookingByCode}>Fetch Booking</button>
              </div>

              {/* Booking Details */}
              {loadingBooking && <p>Loading booking details...</p>}
              {bookingDetails && (
                <div className="booking-card">
                  <h2>Booking: {bookingDetails.booking.receipt_code}</h2>
                  <p>
                    <strong>Name:</strong> {bookingDetails.booking.name}
                  </p>
                  {bookingDetails.booking.email && (
                    <p>
                      <strong>Email:</strong> {bookingDetails.booking.email}
                    </p>
                  )}
                  <p>
                    <strong>Phone:</strong> {bookingDetails.booking.phone}
                  </p>
                  <p>
                    <strong>Tables:</strong>{" "}
                    {bookingDetails.booking.tables.join(", ")}
                  </p>
                  <p>
                    <strong>Date & Time:</strong>{" "}
                    {bookingDetails.booking.date} {bookingDetails.booking.time}
                  </p>

                  <h3>Orders:</h3>
                  <ul>
                    {bookingDetails.orders.map((order) => (
                      <li key={order.id}>
                        <span>
                          {order.quantity}x {order.name} (Ksh {order.price})
                        </span>
                        {order.status !== "served" && (
                          <button onClick={() => serveOrder(order.id)}>
                            Serve
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Assigned Orders */}
              <div className="orders-list">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div className="order-card" key={order.id}>
                      <div>
                        <h3>
                          Table {order.booking?.table_number || "N/A"}
                        </h3>
                        <p>
                          {order.quantity}x {order.name}
                        </p>
                        <p
                          className={`status ${
                            order.status === "served" ? "served" : ""
                          }`}
                        >
                          Status: {order.status}
                        </p>
                      </div>
                      {order.status !== "served" && (
                        <button onClick={() => serveOrder(order.id)}>
                          Mark as Served
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No orders assigned yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
