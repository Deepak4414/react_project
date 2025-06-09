import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageSubjects = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/courses')
      .then(res => setCourses(res.data))
      .catch(() => alert("Failed to load courses"));
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      axios.get(`http://localhost:5000/api/admin/branches/${selectedCourseId}`)
        .then(res => setBranches(res.data))
        .catch(err => {
          if (err.response?.status === 404) setBranches([]);
          else alert("Failed to load branches");
        });
    } else {
      setBranches([]);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedBranchId) {
      axios.get(`http://localhost:5000/api/admin/semesters/${selectedBranchId}`)
        .then(res => setSemesters(res.data))
        .catch(err => {
          if (err.response?.status === 404) setSemesters([]);
          else alert("Failed to load semesters");
        });
    } else {
      setSemesters([]);
    }
  }, [selectedBranchId]);

  useEffect(() => {
    if (selectedSemesterId) fetchSubjects();
    else setSubjects([]);
  }, [selectedSemesterId]);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/subjects/${selectedSemesterId}`);
      setSubjects(res.data);
    } catch (err) {
      if (err.response?.status === 404) setSubjects([]);
      else alert("Failed to load subjects");
    }
  };

  const handleAdd = async () => {
    if (!subjectName.trim()) return alert("Enter subject name");
    try {
      await axios.post("http://localhost:5000/api/admin/subjects", {
        subjectName,
        branchId: selectedBranchId,
        semesterId: selectedSemesterId
      });
      setSubjectName('');
      fetchSubjects();
    } catch {
      alert("Failed to add subject");
    }
  };

  const handleUpdate = async () => {
    if (!subjectName.trim()) return alert("Enter subject name");
    try {
      await axios.put(`http://localhost:5000/api/admin/subjects/${editingSubject.subjectId}`, {
        subjectName
      });
      setEditingSubject(null);
      setSubjectName('');
      fetchSubjects();
    } catch {
      alert("Failed to update subject");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/subjects/${id}`);
      fetchSubjects();
    } catch {
      alert("Failed to delete subject");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Subjects</h2>

      {/* Course Selection */}
      <div className="mb-3">
        <label htmlFor="courseSelect" className="form-label">Course:</label>
        <select
          id="courseSelect"
          className="form-select"
          value={selectedCourseId}
          onChange={(e) => {
            setSelectedCourseId(e.target.value);
            setSelectedBranchId('');
            setSelectedSemesterId('');
            setSubjectName('');
            setEditingSubject(null);
            setBranches([]);
            setSemesters([]);
            setSubjects([]);
          }}
        >
          <option value="">-- Select Course --</option>
          {courses.map(c => (
            <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
          ))}
        </select>
      </div>

      {/* Branch Selection */}
      {selectedCourseId && (
        <div className="mb-3">
          <label htmlFor="branchSelect" className="form-label">Branch:</label>
          <select
            id="branchSelect"
            className="form-select"
            value={selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value);
              setSelectedSemesterId('');
              setSubjectName('');
              setEditingSubject(null);
              setSemesters([]);
              setSubjects([]);
            }}
          >
            <option value="">-- Select Branch --</option>
            {branches.map(b => (
              <option key={b.branchId} value={b.branchId}>{b.branchName}</option>
            ))}
          </select>
        </div>
      )}

      {/* Semester Selection */}
      {selectedBranchId && (
        <div className="mb-3">
          <label htmlFor="semesterSelect" className="form-label">Semester:</label>
          <select
            id="semesterSelect"
            className="form-select"
            value={selectedSemesterId}
            onChange={(e) => {
              setSelectedSemesterId(e.target.value);
              setSubjectName('');
              setEditingSubject(null);
              setSubjects([]);
            }}
          >
            <option value="">-- Select Semester --</option>
            {semesters.map(s => (
              <option key={s.semesterId} value={s.semesterId}>{s.semesterName}</option>
            ))}
          </select>
        </div>
      )}

      {/* Subject Form */}
      {selectedSemesterId && (
        <>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Subject name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
            {editingSubject ? (
              <>
                <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingSubject(null);
                    setSubjectName('');
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAdd}>Add Subject</button>
            )}
          </div>

          {/* Subject List */}
          <ul className="list-group">
            {subjects.map(s => (
              <li
                key={s.subjectId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{s.subjectName}</span>
                <div>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setEditingSubject(s);
                      setSubjectName(s.subjectName);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(s.subjectId)}
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

export default ManageSubjects;
