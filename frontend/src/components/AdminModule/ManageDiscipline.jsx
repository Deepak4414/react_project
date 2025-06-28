import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteConfirmModal from "../FacultyModule/View/MainComponent/Update/ConfirmDeleteModal";

const ManageDiscipline = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const [username, setUsername] = useState("");
  const [deleteBranchModalInfo, setDeleteBranchModalInfo] = useState({
    open: false,
    branchId: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userState"));
    setUsername(storedUser?.username || "");
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/courses")
      .then((res) => setCourses(res.data))
      .catch(() => alert("Failed to load courses."));
  }, []);

  useEffect(() => {
    if (courseId) {
      axios
        .get(`http://localhost:5000/api/admin/branches/${courseId}`)
        .then((res) => setBranches(res.data))
        .catch((err) => {
          if (err.response?.status === 404) {
            setBranches([]);
          } else {
            alert("Failed to load branches.");
          }
        });
    } else {
      setBranches([]);
    }
  }, [courseId]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/branches/${courseId}`
      );
      setBranches(res.data);
    } catch {
      setBranches([]);
    }
  };

  const addBranch = async () => {
    if (!name.trim()) return alert("Enter branch name");
    try {
      await axios.post("http://localhost:5000/api/admin/branches", {
        branchName: name,
        courseId,
      });
      setName("");
      fetchBranches();
    } catch {
      alert("Failed to add branch");
    }
  };

  const updateBranch = async () => {
    if (!name.trim()) return alert("Enter branch name");
    try {
      await axios.put(
        `http://localhost:5000/api/admin/branches/${editing.branchId}`,
        { branchName: name }
      );
      setEditing(null);
      setName("");
      fetchBranches();
    } catch {
      alert("Failed to update branch");
    }
  };

  const handleDeleteBranch = async (id, password) => {
    try {
      if (!username) {
        alert("Username not available. Please login again.");
        return;
      }

      if (!password) {
        alert("Password is required.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/verify-password",
        {
          username,
          password,
        }
      );

      if (!res.data.success) {
        alert(res.data.message || "Password is incorrect.");
        return;
      }

      const deleteRes = await axios.delete(
        `http://localhost:5000/api/admin/branches/${id}`
      );

      if (deleteRes.status === 200 || deleteRes.status === 204) {
        fetchBranches();
        alert("Branch deleted successfully.");
      } else {
        alert("Failed to delete branch.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete branch. Ensure no semesters depend on it.");
    } finally {
      setDeleteBranchModalInfo({ open: false, branchId: null });
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Discipline</h2>

      <DeleteConfirmModal
        isOpen={deleteBranchModalInfo.open}
        itemName="Discipline"
        onClose={() =>
          setDeleteBranchModalInfo({ open: false, branchId: null })
        }
        onConfirm={(password) =>
          handleDeleteBranch(deleteBranchModalInfo.branchId, password)
        }
      />

      {/* Course Selector */}
      <div className="mb-3">
        <select
          className="form-select"
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setName("");
            setEditing(null);
          }}
        >
          <option value="">-- Select Program --</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseName}
            </option>
          ))}
        </select>
      </div>

      {courseId && (
        <>
          {/* Form */}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Discipline Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {editing ? (
              <>
                <button className="btn btn-primary" onClick={updateBranch}>
                  Update
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(null);
                    setName("");
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={addBranch}>
                Add
              </button>
            )}
          </div>

          {/* List */}
          <ul className="list-group">
            {branches.map((b) => (
              <li
                key={b.branchId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{b.branchName}</span>
                <div>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setName(b.branchName);
                      setEditing(b);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      setDeleteBranchModalInfo({
                        open: true,
                        branchId: b.branchId,
                      })
                    }
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ManageDiscipline;
