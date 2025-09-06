import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function Receipt() {
  const { receiptCode } = useParams(); // ✅ comes from /receipt/:receiptCode route
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // ✅ For thank you message

  // Fetch booking details
  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await axiosClient.get(`/bookings/receipt/${receiptCode}`);
        setBooking(res.data);
      } catch (err) {
        console.error("Failed to load receipt:", err);
        setError("Receipt not found or expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [receiptCode]);

  // Download receipt (print to PDF) and show thank you
  const handleDownload = () => {
    window.print(); // ✅ lets user download or print

    setMessage("Thank you! Your booking has been confirmed.");

    // Redirect back home after 3 seconds
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading receipt...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

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
          {/* Receipt Header */}
          <h2 style={{ color: "#ea580c" }}>Receipt Code: {booking.receipt_code}</h2>
          <p><strong>Name:</strong> {booking.name}</p>
          <p><strong>Email:</strong> {booking.email}</p>
          <p><strong>Phone:</strong> {booking.phone}</p>
          <p><strong>Date:</strong> {new Date(booking.created_at).toLocaleString()}</p>

          <hr style={{ margin: "15px 0" }} />

          {/* Orders Table */}
          <h3 style={{ marginBottom: "10px", color: "#b91c1c" }}>Ordered Items</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fef3c7" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Item</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Qty</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {booking.orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{order.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{order.quantity}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>Ksh {order.price}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Ksh {order.price * order.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: "20px", color: "#16a34a" }}>
            Total: Ksh {booking.total}
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
