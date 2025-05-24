import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function AddCourse() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isAddingNewSubject, setIsAddingNewSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  // Fetch courses on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/courses").then((response) => {
      setCourses(response.data);
    });
  }, []);

  // Fetch branches when course changes
  useEffect(() => {
    if (selectedCourse) {
      axios
        .get(`http://localhost:5000/api/branches/${selectedCourse}`)
        .then((response) => {
          setBranches(response.data);
          setSemesters([]); // Reset dependent dropdowns
          setSubjects([]);
        });
    }
  }, [selectedCourse]);

  // Fetch semesters when branch changes
  useEffect(() => {
    if (selectedBranch) {
      axios
        .get(`http://localhost:5000/api/semesters/${selectedBranch}`)
        .then((response) => {
          setSemesters(response.data);
          setSubjects([]);
        });
    }
  }, [selectedBranch]);

  // Fetch subjects when semester changes
  useEffect(() => {
    if (selectedSemester) {
      axios
        .get(`http://localhost:5000/api/subjects/${selectedSemester}`)
        .then((response) => {
          setSubjects(response.data);
        });
    }
  }, [selectedSemester]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  let subjectValue = selectedSubject;

  // If user is adding a new subject
  if (isAddingNewSubject) {
    try {
      const res = await axios.post("http://localhost:5000/api/subjects/add-subject", {
        subjectName: newSubjectName,
        semesterId: selectedSemester,
        branchId: selectedBranch,

      });
     subjectValue = res.data.subjectId || newSubjectName;
    } catch (error) {
      alert("Error adding new subject. Please try again.");
      console.error(error);
      return;
    }
  }

  if (selectedCourse && selectedBranch && selectedSemester && subjectValue) {
    navigate("/facultyindex/add-topic", {
      state: {
        course: selectedCourse,
        branch: selectedBranch,
        semester: selectedSemester,
        subject: subjectValue,
      },
    });
  } else {
    alert("Please complete all selections.");
  }
};


  return (
    <div className="container my-5">
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-center mb-4 text-primary">Add Course Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="course" className="form-label">
              Program
            </label>
            <select
              id="course"
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select the Program</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="branch" className="form-label">
              Discipline
            </label>
            <select
              id="branch"
              className="form-select"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabled={!selectedCourse}
            >
              <option value="">Select Discipline</option>
              {branches.map((branch) => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="semester" className="form-label">
              Semester
            </label>
            <select
              id="semester"
              className="form-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={!selectedBranch}
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester.semesterId} value={semester.semesterId}>
                  {semester.semesterName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="form-label">
              Courses
            </label>
            <select
              id="subject"
              className="form-select"
              value={selectedSubject}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "add-new") {
                  setIsAddingNewSubject(true);
                  setSelectedSubject(""); // reset selected subject
                } else {
                  setSelectedSubject(value);
                  setIsAddingNewSubject(false); // hide input if not adding
                }
              }}
              disabled={!selectedSemester}
            >
              <option value="">Select Courses</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
              <option value="add-new">➕ Add New Subject</option>
            </select>
          </div>

          {isAddingNewSubject && (
            <div className="mb-4">
              <label htmlFor="newSubject" className="form-label">
                New Subject Name
              </label>
              <input
                id="newSubject"
                type="text"
                className="form-control"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Enter new subject name"
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 py-3">
            Add Topics
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
