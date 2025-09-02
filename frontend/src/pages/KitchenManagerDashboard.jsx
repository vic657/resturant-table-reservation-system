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
    fetchMenus();
  }, []);

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

  const handleUpdate = (menu) => {
    alert(`Update clicked for: ${menu.name}`);
    // later you can open a modal form here
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
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Kitchen Manager</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <a href="#" style={{ textDecoration: "none", color: "white" }}>
            Dashboard
          </a>
          <a href="#" style={{ textDecoration: "none", color: "white" }}>
            Manage Menu
          </a>
          <a href="#" style={{ textDecoration: "none", color: "white" }}>
            Orders
          </a>
          <a href="#" style={{ textDecoration: "none", color: "white" }}>
            Reports
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Navbar />
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#b91c1c" }}>
          Kitchen Manager Dashboard
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

        {/* Menu Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "2px solid #facc15",
            background: "white",
          }}
        >
          <thead style={{ background: "#fef3c7" }}>
            <tr>
              <th style={{ border: "1px solid #facc15", padding: "10px" }}>ID</th>
              <th style={{ border: "1px solid #facc15", padding: "10px" }}>Image</th>
              <th style={{ border: "1px solid #facc15", padding: "10px" }}>Name</th>
              <th style={{ border: "1px solid #facc15", padding: "10px" }}>Category</th>
              <th style={{ border: "1px solid #facc15", padding: "10px" }}>Description</th>
              <th style={{ border: "1px solid #facc15", padding: "10px" }}>Price</th>
              <th style={{ border: "1px solid #facc15", padding: "10px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.length > 0 ? (
              menus.map((menu) => (
                <tr key={menu.id} style={{ textAlign: "center" }}>
                  <td style={{ border: "1px solid #facc15", padding: "10px" }}>{menu.id}</td>
                  <td style={{ border: "1px solid #facc15", padding: "10px" }}>
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
                  <td style={{ border: "1px solid #facc15", padding: "10px" }}>{menu.name}</td>
                  <td style={{ border: "1px solid #facc15", padding: "10px" }}>{menu.category}</td>
                  <td style={{ border: "1px solid #facc15", padding: "10px" }}>{menu.description}</td>
                  <td style={{ border: "1px solid #facc15", padding: "10px", fontWeight: "bold", color: "#b91c1c" }}>
                    Ksh {menu.price}
                  </td>
                  <td style={{ border: "1px solid #facc15", padding: "10px" }}>
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
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No menus available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
