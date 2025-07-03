import React, { useState, useEffect } from "react";
import axios from "axios";

const FacultyRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "faculty",
    name: "",
    email: "",
  });

  const [facultyList, setFacultyList] = useState([]);
  const [searchId, setSearchId] = useState("");

  const fetchFaculty = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/faculty");
      setFacultyList(res.data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );
      alert(res.data.message);
      setFormData({
        username: "",
        password: "",
        role: "faculty",
        name: "",
        email: "",
      });
      fetchFaculty();
    } catch (error) {
      console.error("Registration error:", error);

      // Show specific message from server response if available
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Registration failed.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/delete/faculty/${id}`);
      fetchFaculty();
    } catch (error) {
      console.error("Deletion error:", error);
      alert("Failed to delete.");
    }
  };

  const handleSearchDelete = async () => {
    if (!searchId.trim()) return;
    handleDelete(searchId.trim());
    setSearchId("");
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h2 className="mb-4">Faculty Registration & Management</h2>

      {/* --- Registration Form --- */}
      <div>
        <h4>Register New Faculty</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
            required
            className="form-control mb-2"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            required
            className="form-control mb-2"
          />
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
      {/* --- Faculty List & Search --- */}
      <div className="mb-4 mt-4">
        <h4>Faculty List</h4>

        {facultyList.length === 0 ? (
          <p className="text-muted">No faculty registered.</p>
        ) : (
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Username</th>
                <th style={{ width: "80px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.map((f) => (
                <tr key={f.id}>
                  <td>{f.username}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(f.id)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FacultyRegistration;
