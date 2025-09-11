import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import Navbar from "../Components/Navbar";
import "../KitchenManagerDashboard.css";

export default function KitchenManagerDashboard() {
  const [menus, setMenus] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  // Update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editMenu, setEditMenu] = useState(null);

  // Orders + waiters
  const [orders, setOrders] = useState([]);
  const [waiters, setWaiters] = useState([]);

  // Sidebar toggle (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ===== Fetch menus =====
  const fetchMenus = async () => {
    try {
      const res = await axiosClient.get("/menus");
      if (Array.isArray(res.data)) setMenus(res.data);
      else if (res.data && Array.isArray(res.data.data)) setMenus(res.data.data);
      else setMenus([]);
    } catch (err) {
      console.error("Failed to fetch menus:", err);
      setMenus([]);
    }
  };

  // ===== Fetch orders =====
  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    }
  };

  // ===== Fetch waiters =====
  const fetchWaiters = async () => {
    try {
      const res = await axiosClient.get("/waiters");
      setWaiters(res.data || []);
    } catch (err) {
      console.error("Failed to fetch waiters:", err);
      setWaiters([]);
    }
  };

  useEffect(() => {
    if (activeView === "menu") fetchMenus();
    if (activeView === "orders") {
      fetchOrders();
      fetchWaiters();
    }
  }, [activeView]);

  // Close mobile sidebar when resizing to large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // ===== Create menu =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      await axiosClient.post("/menus", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName(""); setDescription(""); setPrice(""); setImage(null); setCategory("");
      fetchMenus();
    } catch (err) {
      console.error("Failed to create menu:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== Delete menu =====
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;
    try {
      await axiosClient.delete(`/menus/${id}`);
      fetchMenus();
    } catch (err) {
      console.error("Failed to delete menu:", err);
    }
  };

  // ===== Open update modal =====
  const handleUpdate = (menu) => {
    setEditMenu(menu);
    setName(menu.name);
    setDescription(menu.description);
    setPrice(menu.price);
    setCategory(menu.category);
    setImage(null);
    setShowUpdateModal(true);
  };

  // ===== Submit update =====
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editMenu) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      await axiosClient.post(`/menus/${editMenu.id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchMenus();
      setShowUpdateModal(false);
      setEditMenu(null);
      setName(""); setDescription(""); setPrice(""); setCategory(""); setImage(null);
    } catch (err) {
      console.error("Failed to update menu:", err);
    }
  };

  // ===== Assign waiter =====
  const assignWaiter = async (orderId, waiterId) => {
    try {
      await axiosClient.post(`/orders/${orderId}/assign-waiter`, { waiter_id: waiterId });
      fetchOrders();
    } catch (err) {
      console.error("error occured!Failed to assign waiter:", err);
    }
  };

  // Auto-close menu on mobile after clicking a nav link
  const handleNavClick = (view) => {
    setActiveView(view);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`km-sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Kitchen Manager</h2>
        <nav>
          <button onClick={() => handleNavClick("dashboard")} className={activeView === "dashboard" ? "active" : ""}>Dashboard</button>
          <button onClick={() => handleNavClick("menu")} className={activeView === "menu" ? "active" : ""}>Manage Menu</button>
          <button onClick={() => handleNavClick("orders")} className={activeView === "orders" ? "active" : ""}>Orders</button>
          <button onClick={() => handleNavClick("reports")} className={activeView === "reports" ? "active" : ""}>Reports</button>
        </nav>
      </aside>

      {/* overlay for mobile drawer */}
      {sidebarOpen && <div className="km-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Mobile Toggle Button */}
      <button
        className="km-sidebar-toggle"
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        onClick={() => setSidebarOpen((s) => !s)}
      >
        ☰
      </button>

      {/* Main Content */}
      <div className="km-main">
        <div className="km-top">
          <Navbar />
        </div>

        <div className="km-content">
          {activeView === "dashboard" && <h1 className="page-title">Welcome to the Kitchen Manager Dashboard</h1>}

          {/* === Manage Menu View === */}
          {activeView === "menu" && (
            <>
              <h1 className="page-title">Manage Menu</h1>

              <form className="km-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="Food Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Select Category</option>
                  <option value="drinks">Drinks</option>
                  <option value="beverages">Beverages</option>
                  <option value="foods">Foods</option>
                  <option value="snacks">Snacks</option>
                </select>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
                <button type="submit" disabled={loading}>{loading ? "Saving..." : "Add Menu"}</button>
              </form>

              <div className="km-table-container">
                <table className="km-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus.length > 0 ? (
                      menus.map((menu) => (
                        <tr key={menu.id}>
                          <td>{menu.id}</td>
                          <td>{menu.image ? <img src={menu.image} alt={menu.name} /> : "No Image"}</td>
                          <td>{menu.name}</td>
                          <td>{menu.category}</td>
                          <td>{menu.description}</td>
                          <td>Ksh {menu.price}</td>
                          <td>
                            <button onClick={() => handleUpdate(menu)}>Update</button>
                            <button onClick={() => handleDelete(menu.id)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">No menus available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* === Orders View === */}
          {activeView === "orders" && (
            <>
              <h1 className="page-title">Manage Orders</h1>

              <div className="km-table-container">
                <table className="km-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Booking</th>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                      <th>Status</th>
                      <th>Waiter</th>
                      <th>Assign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.booking_id}</td>
                          <td>{order.name}</td>
                          <td>{order.quantity}</td>
                          <td>Ksh {order.subtotal}</td>
                          <td className={`status ${order.status === "served" ? "served" : ""}`}>{order.status || "pending"}</td>
                          <td>{order.waiter?.name || "Not Assigned"}</td>
                          <td>
                            <select defaultValue={order.waiter?.id || ""} onChange={(e) => assignWaiter(order.id, e.target.value)}>
                              <option value="">Select</option>
                              {waiters.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">No orders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* === Update Modal === */}
          {showUpdateModal && (
            <div className="km-modal">
              <div className="km-modal-content">
                <h2>Update Menu</h2>
                <form onSubmit={handleUpdateSubmit}>
                  <input type="text" placeholder="Food Name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                  <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    <option value="drinks">Drinks</option>
                    <option value="beverages">Beverages</option>
                    <option value="foods">Foods</option>
                    <option value="snacks">Snacks</option>
                  </select>
                  <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
                  <div className="modal-actions">
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
