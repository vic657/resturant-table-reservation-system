import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function Receipt() {
  const { receiptCode } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null); // booking + orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch receipt details
  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await axiosClient.get(`/bookings/receipt/${receiptCode}`);
        setReceipt(res.data);
      } catch (err) {
        console.error("Failed to load receipt:", err);
        setError("Receipt not found or expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [receiptCode]);

  const handleDownload = () => {
    window.print();
    setMessage("Thank you! Your booking has been confirmed.");
    setTimeout(() => navigate("/"), 3000);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading receipt...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  const booking = receipt?.booking;
  const orders = receipt?.orders || [];

  // Dynamically calculate subtotal and total
  const totalAmount = orders.reduce((sum, order) => {
    const price = Number(order.price) || 0;
    const qty = Number(order.quantity) || 0;
    return sum + price * qty;
  }, 0);

  return (
    <div style={{ padding: "20px", background: "#fff7ed", minHeight: "100vh" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#b91c1c",
          marginBottom: "20px",
        }}
      >
        Booking Receipt
      </h1>

      {message && (
        <div
          style={{
            textAlign: "center",
            margin: "20px 0",
            padding: "10px",
            background: "rgba(22,163,74,0.1)",
            color: "#16a34a",
            borderRadius: "6px",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}

      {booking && (
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          {/* Booking Header */}
          <h2 style={{ color: "#ea580c" }}>Receipt Code: {booking.receipt_code}</h2>
          <p><strong>Name:</strong> {booking.name}</p>
          {booking.email && <p><strong>Email:</strong> {booking.email}</p>}
          <p><strong>Phone:</strong> {booking.phone}</p>
          <p><strong>Table(s):</strong> {booking.tables.join(", ")}</p>
          <p><strong>Date & Time:</strong> {booking.date} {booking.time}</p>

          <hr style={{ margin: "15px 0" }} />

          {/* Orders Table */}
          <h3 style={{ marginBottom: "10px", color: "#b91c1c" }}>Ordered Items</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fef3c7" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Item</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Qty</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const price = Number(order.price) || 0;
                const qty = Number(order.quantity) || 0;
                const subtotal = price * qty;
                return (
                  <tr key={order.id}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{order.name}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{qty}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>Ksh {price}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>Ksh {subtotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h2 style={{ marginTop: "20px", color: "#16a34a" }}>
            Total: Ksh {totalAmount}
          </h2>

          {/* Download Button */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={handleDownload}
              style={{
                background: "#ea580c",
                color: "white",
                padding: "12px 25px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
