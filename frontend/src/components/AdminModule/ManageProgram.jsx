import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteConfirmModal from "../FacultyModule/View/MainComponent/Update/ConfirmDeleteModal";

const ManageProgram = () => {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [username, setUsername] = useState("");
  const [deleteCourseModalInfo, setDeleteCourseModalInfo] = useState({
    open: false,
    courseId: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userState"));
    setUsername(storedUser?.username || "");
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      alert("Error loading courses.");
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return alert("Please enter a course name.");
    try {
      await axios.post("http://localhost:5000/api/admin/courses", {
        courseName: name,
      });
      setName("");
      fetchCourses();
    } catch (err) {
      alert("Failed to add course.");
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return alert("Please enter a course name.");
    try {
      await axios.put(`http://localhost:5000/api/admin/courses/${editingId}`, {
        courseName: name,
      });
      setName("");
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      alert("Failed to update course.");
    }
  };

  const handleDeleteCourse = async (id, password) => {
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
        `http://localhost:5000/api/admin/courses/${id}`
      );

      if (deleteRes.status === 200 || deleteRes.status === 204) {
        fetchCourses();
        alert("Course deleted successfully.");
      } else {
        alert("Failed to delete course. Try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete course. Make sure no branches depend on it.");
    } finally {
      setDeleteCourseModalInfo({ open: false, courseId: null });
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Programs</h2>
      <DeleteConfirmModal
        isOpen={deleteCourseModalInfo.open}
        itemName="Program"
        onClose={() =>
          setDeleteCourseModalInfo({ open: false, courseId: null })
        }
        onConfirm={(password) =>
          handleDeleteCourse(deleteCourseModalInfo.courseId, password)
        }
      />

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Program Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {editingId ? (
          <>
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setName("");
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button className="btn btn-success" onClick={handleAdd}>
            Add
          </button>
        )}
      </div>

      <ul className="list-group">
        {courses.map((c) => (
          <li
            key={c.courseId}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{c.courseName}</span>
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => {
                  setName(c.courseName);
                  setEditingId(c.courseId);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() =>
                  setDeleteCourseModalInfo({ open: true, courseId: c.courseId })
                }
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProgram;
