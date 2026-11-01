import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [message, setMessage] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch menus from API (public endpoint)
  const fetchMenus = async () => {
    setLoading(true); setLoadError(false);
    try {
      const res = await axiosClient.get("/menu-show");
      if (Array.isArray(res.data)) {
        setMenus(res.data);
        setFilteredMenus(res.data);
      } else {
        setMenus([]);
        setFilteredMenus([]);
      }
    } catch (err) {
      setLoadError(true);
      setMenus([]);
      setFilteredMenus([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = menus;
    if (category !== "all") {
      filtered = filtered.filter((menu) => menu.category === category);
    }
    if (search.trim() !== "") {
      filtered = filtered.filter((menu) =>
        menu.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredMenus(filtered);
  }, [category, search, menus]);

  // Handle quantity change
  const handleQuantityChange = (menuId, value) => {
    setSelectedItems((prev) => {
      if (value <= 0) {
        const updated = { ...prev };
        delete updated[menuId];
        return updated;
      }
      return {
        ...prev,
        [menuId]: { ...(prev[menuId] || {}), quantity: value },
      };
    });
  };

  // Calculate total
  const calculateTotal = () => {
    return Object.keys(selectedItems).reduce((sum, id) => {
      const menu = menus.find((m) => m.id === parseInt(id));
      return menu ? sum + menu.price * selectedItems[id].quantity : sum;
    }, 0);
  };

  // Handle confirm order
  const handleConfirmOrder = async () => {
    if (submitting) return;
    let pendingBooking;
    try { pendingBooking = JSON.parse(localStorage.getItem("pendingBooking")); } catch { localStorage.removeItem("pendingBooking"); }

    if (!pendingBooking) {
      setMessage({
        type: "error",
        text: "No booking found. Please book a table first.",
      });
      navigate("/book-table");
      return;
    }

    const orderItems = Object.keys(selectedItems)
      .map((id) => {
        const menu = menus.find((m) => m.id === parseInt(id));
        return menu && selectedItems[id].quantity > 0
          ? {
              menu_id: menu.id,
              name: menu.name,
              price: menu.price,
              quantity: selectedItems[id].quantity,
            }
          : null;
      })
      .filter(Boolean);

    if (orderItems.length === 0) {
      setMessage({ type: "error", text: "Please select at least one item." });
      return;
    }

    try {
      setSubmitting(true);
      const res = await axiosClient.post("/bookings", {
        name: pendingBooking.customer.name,
        email: pendingBooking.customer.email,
        phone: pendingBooking.customer.phone,
        guests: pendingBooking.customer.guests,
        date: pendingBooking.customer.date,
        time: pendingBooking.customer.time,
        tables: pendingBooking.tables,
        orders: orderItems,
      });

      const { receipt_code } = res.data;
      localStorage.removeItem("pendingBooking");
      navigate(`/receipt/${receipt_code}`);
    } catch (err) {
      console.error("Failed to confirm order:", err.response?.data || err.message);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to place order. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Navbar />

      <div className="public-menu-content" style={{ padding: "20px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "var(--ink)",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Our Menu
        </h1>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <select
            aria-label="Menu category" value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
            }}
          >
            <option value="all">All Categories</option>
            <option value="drinks">Drinks</option>
            <option value="beverages">Beverages</option>
            <option value="foods">Foods</option>
            <option value="snacks">Snacks</option>
          </select>

          <input
            type="text"
            aria-label="Search menu" placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              width: "250px",
            }}
          />
        </div>

        {/* Menu Grid */}
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {filteredMenus.length > 0 ? (
            filteredMenus.map((menu) => (
              <div
                key={menu.id}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "10px",
                  background: "white",
                  padding: "15px",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
              >
                {menu.image ? (
                  <img
                    src={menu.image}
                    alt={menu.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "180px",
                      background: "#fef3c7",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--ink)",
                      fontWeight: "bold",
                    }}
                  >
                    No Image
                  </div>
                )}

                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "var(--ink)" }}>
                  {menu.name}
                </h3>
                <p style={{ fontSize: "14px", margin: "8px 0", color: "#555" }}>
                  {menu.description}
                </p>
                <p style={{ fontWeight: "bold", color: "var(--ink)", fontSize: "16px" }}>
                  Ksh {menu.price}
                </p>

                <div style={{ marginTop: "10px" }}>
                  <input
                    type="number"
                    min="0"
                    aria-label={`Quantity for ${menu.name}`} placeholder="Qty"
                    value={selectedItems[menu.id]?.quantity || ""}
                    onChange={(e) =>
                      handleQuantityChange(menu.id, parseInt(e.target.value) || 0)
                    }
                    style={{
                      width: "70px",
                      padding: "5px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#555", gridColumn: "1 / -1" }}>
              {loading ? "Loading our menu…" : loadError ? "The menu could not be loaded. Please try again." : "No menu items match your search."}
              {loadError && <button onClick={fetchMenus}>Try again</button>}
            </p>
          )}
        </div>

        {/* Floating Cart Toggle */}
        {Object.keys(selectedItems).length > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              width: cartOpen ? "min(360px, calc(100vw - 40px))" : "auto",
              maxHeight: "calc(100dvh - 120px)",
              overflowY: "auto",
              zIndex: 999,
            }}
          >
            <button
              onClick={() => setCartOpen(!cartOpen)}
              style={{
                background: "var(--accent)",
                color: "white",
                padding: "8px 15px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {cartOpen ? "Hide Cart" : `Cart (${Object.keys(selectedItems).length})`}
            </button>

            {cartOpen && (
              <div style={{ marginTop: "15px" }}>
                {Object.keys(selectedItems).map((id) => {
                  const menu = menus.find((m) => m.id === parseInt(id));
                  return (
                    <div
                      key={id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <div>
                        <strong>{menu?.name}</strong> x {selectedItems[id].quantity}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>Ksh {menu?.price * selectedItems[id].quantity}</span>
                        <button
                          onClick={() => {
                            setSelectedItems((prev) => {
                              const updated = { ...prev };
                              delete updated[id];
                              return updated;
                            });
                          }}
                          style={{
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
                <hr />
                <h3 style={{ marginTop: "10px" }}>Total: Ksh {calculateTotal()}</h3>
                <button
                  onClick={handleConfirmOrder} disabled={submitting}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    background: "#16a34a",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {submitting ? "Placing order…" : "Confirm Order"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "6px",
              textAlign: "center",
              color: message.type === "success" ? "green" : "red",
              background: message.type === "success" ? "rgba(0,128,0,0.1)" : "rgba(255,0,0,0.1)",
            }}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
