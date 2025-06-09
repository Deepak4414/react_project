import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageBranches = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/courses')
      .then(res => setCourses(res.data))
      .catch(() => alert('Failed to load courses.'));
  }, []);

  useEffect(() => {
    if (courseId) {
      axios.get(`http://localhost:5000/api/admin/branches/${courseId}`)
        .then(res => setBranches(res.data))
        .catch(err => {
          if (err.response?.status === 404) {
            setBranches([]);
          } else {
            alert('Failed to load branches.');
          }
        });
    } else {
      setBranches([]);
    }
  }, [courseId]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/branches/${courseId}`);
      setBranches(res.data);
    } catch {
      setBranches([]);
    }
  };

  const addBranch = async () => {
    if (!name.trim()) return alert('Enter branch name');
    try {
      await axios.post('http://localhost:5000/api/admin/branches', { branchName: name, courseId });
      setName('');
      fetchBranches();
    } catch {
      alert('Failed to add branch');
    }
  };

  const updateBranch = async () => {
    if (!name.trim()) return alert('Enter branch name');
    try {
      await axios.put(`http://localhost:5000/api/admin/branches/${editing.branchId}`, { branchName: name });
      setEditing(null);
      setName('');
      fetchBranches();
    } catch {
      alert('Failed to update branch');
    }
  };

  const deleteBranch = async (id) => {
    if (!window.confirm("Delete this branch?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/branches/${id}`);
      fetchBranches();
    } catch {
      alert("Failed to delete branch. Ensure no semesters depend on it.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Branches</h2>

      {/* Course Selector */}
      <div className="mb-3">
        <select
          className="form-select"
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setName('');
            setEditing(null);
          }}
        >
          <option value=''>-- Select Course --</option>
          {courses.map(c => (
            <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
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
              placeholder="Branch Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {editing ? (
              <>
                <button className="btn btn-primary" onClick={updateBranch}>Update</button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(null);
                    setName('');
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={addBranch}>Add</button>
            )}
          </div>

          {/* List */}
          <ul className="list-group">
            {branches.map(b => (
              <li key={b.branchId} className="list-group-item d-flex justify-content-between align-items-center">
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
                    onClick={() => deleteBranch(b.branchId)}
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

export default ManageBranches;
