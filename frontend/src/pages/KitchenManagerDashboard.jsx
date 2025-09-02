import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import Navbar from "../Components/Navbar";

export default function KitchenManagerDashboard() {
  const [menus, setMenus] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  // For update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editMenu, setEditMenu] = useState(null);

  // Fetch menus
  const fetchMenus = async () => {
    try {
      const res = await axiosClient.get("/menus");
      if (Array.isArray(res.data)) {
        setMenus(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setMenus(res.data.data);
      } else {
        setMenus([]);
      }
    } catch (err) {
      console.error("Failed to fetch menus:", err);
      setMenus([]);
    }
  };

  useEffect(() => {
    if (activeView === "menu") {
      fetchMenus();
    }
  }, [activeView]);

  // Handle create menu
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

      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setCategory("");
      fetchMenus();
    } catch (err) {
      console.error("Failed to create menu:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete menu
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;
    try {
      await axiosClient.delete(`/menus/${id}`);
      fetchMenus();
    } catch (err) {
      console.error("Failed to delete menu:", err);
    }
  };

  // Open update modal
  const handleUpdate = (menu) => {
    setEditMenu(menu);
    setName(menu.name);
    setDescription(menu.description);
    setPrice(menu.price);
    setCategory(menu.category);
    setImage(null);
    setShowUpdateModal(true);
  };

  // Submit update
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
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage(null);
    } catch (err) {
      console.error("Failed to update menu:", err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fff7ed" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          background: "linear-gradient(180deg, #b91c1c, #ea580c, #facc15)",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Kitchen Manager
        </h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => setActiveView("dashboard")}
            style={{
              textAlign: "left",
              background: "transparent",
              border: "none",
              color: activeView === "dashboard" ? "#facc15" : "white",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView("menu")}
            style={{
              textAlign: "left",
              background: "transparent",
              border: "none",
              color: activeView === "menu" ? "#facc15" : "white",
              cursor: "pointer",
            }}
          >
            Manage Menu
          </button>
          <button
            onClick={() => setActiveView("orders")}
            style={{
              textAlign: "left",
              background: "transparent",
              border: "none",
              color: activeView === "orders" ? "#facc15" : "white",
              cursor: "pointer",
            }}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveView("reports")}
            style={{
              textAlign: "left",
              background: "transparent",
              border: "none",
              color: activeView === "reports" ? "#facc15" : "white",
              cursor: "pointer",
            }}
          >
            Reports
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Navbar />

        {activeView === "dashboard" && (
          <h1
            style={{ fontSize: "24px", fontWeight: "bold", color: "#b91c1c" }}
          >
            Welcome to the Kitchen Manager Dashboard
          </h1>
        )}

        {activeView === "menu" && (
          <>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#b91c1c",
              }}
            >
              Manage Menu
            </h1>

            {/* Create Menu Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                marginBottom: "30px",
                padding: "20px",
                border: "1px solid #facc15",
                borderRadius: "8px",
                background: "#fffbe6",
              }}
            >
              <input
                type="text"
                placeholder="Food Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ea580c",
                  borderRadius: "6px",
                }}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ea580c",
                  borderRadius: "6px",
                }}
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ea580c",
                  borderRadius: "6px",
                }}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ea580c",
                  borderRadius: "6px",
                }}
              >
                <option value="">Select Category</option>
                <option value="drinks">Drinks</option>
                <option value="beverages">Beverages</option>
                <option value="foods">Foods</option>
                <option value="snacks">Snacks</option>
              </select>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ea580c",
                  borderRadius: "6px",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#ea580c",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {loading ? "Saving..." : "Add Menu"}
              </button>
            </form>

            {/* Scrollable Menu Table */}
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "2px solid #facc15",
                borderRadius: "6px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "white",
                }}
              >
                <thead
                  style={{
                    background: "#fef3c7",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th style={{ border: "1px solid #facc15", padding: "10px" }}>
                      ID
                    </th>
                    <th style={{ border: "1px solid #facc15", padding: "10px" }}>
                      Image
                    </th>
                    <th style={{ border: "1px solid #facc15", padding: "10px" }}>
                      Name
                    </th>
                    <th style={{ border: "1px solid #facc15", padding: "10px" }}>
                      Category
                    </th>
                    <th style={{ border: "1px solid #facc15", padding: "10px" }}>
                      Description
                    </th>
                    <th style={{ border: "1px solid #facc15", padding: "10px" }}>
                      Price
                    </th>
                    <th style={{ border: "1px solid #facc15", padding: "10px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menus.length > 0 ? (
                    menus.map((menu) => (
                      <tr key={menu.id} style={{ textAlign: "center" }}>
                        <td
                          style={{ border: "1px solid #facc15", padding: "10px" }}
                        >
                          {menu.id}
                        </td>
                        <td
                          style={{ border: "1px solid #facc15", padding: "10px" }}
                        >
                          {menu.image ? (
                            <img
                              src={menu.image}
                              alt={menu.name}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td
                          style={{ border: "1px solid #facc15", padding: "10px" }}
                        >
                          {menu.name}
                        </td>
                        <td
                          style={{ border: "1px solid #facc15", padding: "10px" }}
                        >
                          {menu.category}
                        </td>
                        <td
                          style={{ border: "1px solid #facc15", padding: "10px" }}
                        >
                          {menu.description}
                        </td>
                        <td
                          style={{
                            border: "1px solid #facc15",
                            padding: "10px",
                            fontWeight: "bold",
                            color: "#b91c1c",
                          }}
                        >
                          Ksh {menu.price}
                        </td>
                        <td
                          style={{ border: "1px solid #facc15", padding: "10px" }}
                        >
                          <button
                            onClick={() => handleUpdate(menu)}
                            style={{
                              background: "#facc15",
                              color: "#b91c1c",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "4px",
                              marginRight: "6px",
                              cursor: "pointer",
                            }}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(menu.id)}
                            style={{
                              background: "#b91c1c",
                              color: "white",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No menus available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

         {/* Update Modal */}
        {showUpdateModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
              }}
            >
              <h2 style={{ marginBottom: "15px", color: "#b91c1c" }}>
                Update Menu Item
              </h2>
              <form onSubmit={handleUpdateSubmit}>
                <input
                  type="text"
                  placeholder="Food Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ display: "block", marginBottom: "10px", width: "100%" }}
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  style={{ display: "block", marginBottom: "10px", width: "100%" }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  style={{ display: "block", marginBottom: "10px", width: "100%" }}
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={{ display: "block", marginBottom: "10px", width: "100%" }}
                >
                  <option value="">Select Category</option>
                  <option value="drinks">Drinks</option>
                  <option value="beverages">Beverages</option>
                  <option value="foods">Foods</option>
                  <option value="snacks">Snacks</option>
                </select>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  style={{ display: "block", marginBottom: "10px", width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    style={{
                      background: "#aaa",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "#ea580c",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
