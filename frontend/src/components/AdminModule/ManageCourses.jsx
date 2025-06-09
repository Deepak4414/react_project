import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/courses');
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      alert("Error loading courses.");
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return alert("Please enter a course name.");
    try {
      await axios.post('http://localhost:5000/api/admin/courses', { courseName: name });
      setName('');
      fetchCourses();
    } catch (err) {
      alert("Failed to add course.");
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return alert("Please enter a course name.");
    try {
      await axios.put(`http://localhost:5000/api/admin/courses/${editingId}`, { courseName: name });
      setName('');
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      alert("Failed to update course.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/courses/${id}`);
      fetchCourses();
    } catch (err) {
      alert("Failed to delete course. Make sure no branches depend on it.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Courses</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Course Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {editingId ? (
          <>
            <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setName('');
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button className="btn btn-success" onClick={handleAdd}>Add</button>
        )}
      </div>

      <ul className="list-group">
        {courses.map(c => (
          <li key={c.courseId} className="list-group-item d-flex justify-content-between align-items-center">
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
                onClick={() => handleDelete(c.courseId)}
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

export default ManageCourses;
