import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteConfirmModal from "../FacultyModule/View/MainComponent/Update/ConfirmDeleteModal";
const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [username, setUsername] = useState("");

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);

  const [deleteCourseModalInfo, setDeleteCourseModalInfo] = useState({
    open: false,
    courseId: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userState"));
    setUsername(storedUser?.username || "");
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/courses")
      .then((res) => setCourses(res.data))
      .catch(() => alert("Failed to load courses"));
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      axios
        .get(`http://localhost:5000/api/admin/branches/${selectedCourseId}`)
        .then((res) => setBranches(res.data))
        .catch((err) => {
          if (err.response?.status === 404) setBranches([]);
          else alert("Failed to load branches");
        });
    } else {
      setBranches([]);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedBranchId) {
      axios
        .get(`http://localhost:5000/api/admin/semesters/${selectedBranchId}`)
        .then((res) => setSemesters(res.data))
        .catch((err) => {
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
      const res = await axios.get(
        `http://localhost:5000/api/admin/subjects/${selectedSemesterId}`
      );
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
        semesterId: selectedSemesterId,
      });
      setSubjectName("");
      fetchSubjects();
    } catch {
      alert("Failed to add subject");
    }
  };

  const handleUpdate = async () => {
    if (!subjectName.trim()) return alert("Enter subject name");
    try {
      await axios.put(
        `http://localhost:5000/api/admin/subjects/${editingSubject.subjectId}`,
        {
          subjectName,
        }
      );
      setEditingSubject(null);
      setSubjectName("");
      fetchSubjects();
    } catch {
      alert("Failed to update subject");
    }
  };

  const handleDelete = async (id, password) => {
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
        `http://localhost:5000/api/admin/subjects/${id}`
      );

      if (deleteRes.status === 200 || deleteRes.status === 204) {
        fetchSubjects();
        alert("Subject deleted successfully.");
      } else {
        alert("Failed to delete subject. Try again later.");
      }
    } catch {
      alert("Failed to delete subject.");
    } finally {
      // ✅ Always close modal at the end
      setDeleteCourseModalInfo({
        open: false,
        courseId: null,
      });
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Courses</h2>

      <DeleteConfirmModal
        isOpen={deleteCourseModalInfo.open}
        itemName="Course"
        onClose={() =>
          setDeleteCourseModalInfo({
            open: false,
            courseId: null,
          })
        }
        onConfirm={(password) =>
          handleDelete(deleteCourseModalInfo.courseId, password)
        }
      />

      {/* Course Selection */}
      <div className="mb-3">
        <label htmlFor="courseSelect" className="form-label">
          Course:
        </label>
        <select
          id="courseSelect"
          className="form-select"
          value={selectedCourseId}
          onChange={(e) => {
            setSelectedCourseId(e.target.value);
            setSelectedBranchId("");
            setSelectedSemesterId("");
            setSubjectName("");
            setEditingSubject(null);
            setBranches([]);
            setSemesters([]);
            setSubjects([]);
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

      {/* Branch Selection */}
      {selectedCourseId && (
        <div className="mb-3">
          <label htmlFor="branchSelect" className="form-label">
            Discipline:
          </label>
          <select
            id="branchSelect"
            className="form-select"
            value={selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value);
              setSelectedSemesterId("");
              setSubjectName("");
              setEditingSubject(null);
              setSemesters([]);
              setSubjects([]);
            }}
          >
            <option value="">-- Select Discipline --</option>
            {branches.map((b) => (
              <option key={b.branchId} value={b.branchId}>
                {b.branchName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Semester Selection */}
      {selectedBranchId && (
        <div className="mb-3">
          <label htmlFor="semesterSelect" className="form-label">
            Semester:
          </label>
          <select
            id="semesterSelect"
            className="form-select"
            value={selectedSemesterId}
            onChange={(e) => {
              setSelectedSemesterId(e.target.value);
              setSubjectName("");
              setEditingSubject(null);
              setSubjects([]);
            }}
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((s) => (
              <option key={s.semesterId} value={s.semesterId}>
                {s.semesterName}
              </option>
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
              placeholder="Course name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
            {editingSubject ? (
              <>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Update
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingSubject(null);
                    setSubjectName("");
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAdd}>
                Add Subject
              </button>
            )}
          </div>

          {/* Subject List */}
          <ul className="list-group">
            {subjects.map((s) => (
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
                    onClick={(e) => {
                      e.stopPropagation();
                      // handleDelete(s.subjectId)
                      setDeleteCourseModalInfo({
                        open: true,
                        courseId: s.subjectId,
                      });
                    }}
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

export default ManageCourses;
