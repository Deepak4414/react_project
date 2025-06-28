import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteConfirmModal from "../FacultyModule/View/MainComponent/Update/ConfirmDeleteModal";

const ManageSemesters = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [semesterName, setSemesterName] = useState("");
  const [editingSemester, setEditingSemester] = useState(null);

  const [username, setUsername] = useState("");
  const [deleteSemesterModalInfo, setDeleteSemesterModalInfo] = useState({
    open: false,
    semesterId: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userState"));
    setUsername(storedUser?.username || "");
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.error("Error fetching courses", err);
        alert("Failed to load courses.");
      });
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      axios
        .get(`http://localhost:5000/api/admin/branches/${selectedCourseId}`)
        .then((res) => setBranches(res.data))
        .catch((err) => {
          if (err.response?.status === 404) {
            setBranches([]);
          } else {
            console.error("Error fetching branches", err);
            alert("Failed to load branches.");
          }
        });
    } else {
      setBranches([]);
      setSemesters([]);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedBranchId) {
      axios
        .get(`http://localhost:5000/api/admin/semesters/${selectedBranchId}`)
        .then((res) => setSemesters(res.data))
        .catch((err) => {
          if (err.response?.status === 404) {
            setSemesters([]);
          } else {
            console.error("Error fetching semesters", err);
            alert("Failed to load semesters.");
          }
        });
    } else {
      setSemesters([]);
    }
  }, [selectedBranchId]);

  const fetchSemesters = () => {
    axios
      .get(`http://localhost:5000/api/admin/semesters/${selectedBranchId}`)
      .then((res) => setSemesters(res.data))
      .catch(() => setSemesters([]));
  };

  const addSemester = async () => {
    if (!semesterName.trim()) return alert("Enter semester name.");
    try {
      await axios.post("http://localhost:5000/api/admin/semesters", {
        semesterName,
        branchId: selectedBranchId,
      });
      setSemesterName("");
      fetchSemesters();
    } catch {
      alert("Failed to add semester.");
    }
  };

  const updateSemester = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/semesters/${editingSemester.semesterId}`,
        { semesterName }
      );
      setEditingSemester(null);
      setSemesterName("");
      fetchSemesters();
    } catch {
      alert("Failed to update semester.");
    }
  };

  const handleDeleteSemester = async (id, password) => {
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
        `http://localhost:5000/api/admin/semesters/${id}`
      );

      if (deleteRes.status === 200 || deleteRes.status === 204) {
        fetchSemesters();
        alert("Semester deleted successfully.");
      } else {
        alert("Failed to delete semester.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting.");
    } finally {
      setDeleteSemesterModalInfo({ open: false, semesterId: null });
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Semesters</h2>

      <DeleteConfirmModal
        isOpen={deleteSemesterModalInfo.open}
        itemName="Semester"
        onClose={() =>
          setDeleteSemesterModalInfo({ open: false, semesterId: null })
        }
        onConfirm={(password) =>
          handleDeleteSemester(deleteSemesterModalInfo.semesterId, password)
        }
      />

      {/* Course Selector */}
      <div className="mb-3">
        <select
          className="form-select"
          value={selectedCourseId}
          onChange={(e) => {
            setSelectedCourseId(e.target.value);
            setSelectedBranchId("");
            setSemesterName("");
            setSemesters([]);
          }}
        >
          <option value="">Select Program</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseName}
            </option>
          ))}
        </select>
      </div>

      {/* Branch Selector */}
      {selectedCourseId && (
        <div className="mb-3">
          <select
            className="form-select"
            value={selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value);
              setSemesterName("");
            }}
          >
            <option value="">Select Discipline</option>
            {branches.map((b) => (
              <option key={b.branchId} value={b.branchId}>
                {b.branchName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Semester Form */}
      {selectedBranchId && (
        <>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Semester Name"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
            />
            {editingSemester ? (
              <>
                <button className="btn btn-primary" onClick={updateSemester}>
                  Update
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingSemester(null);
                    setSemesterName("");
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={addSemester}>
                Add
              </button>
            )}
          </div>

          {/* Semester List */}
          <ul className="list-group">
            {semesters.map((s) => (
              <li
                key={s.semesterId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{s.semesterName}</span>
                <div>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setSemesterName(s.semesterName);
                      setEditingSemester(s);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      setDeleteSemesterModalInfo({
                        open: true,
                        semesterId: s.semesterId,
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

export default ManageSemesters;
