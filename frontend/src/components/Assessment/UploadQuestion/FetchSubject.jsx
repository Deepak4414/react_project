import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function FetchSubject() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (selectedCourse && selectedBranch && selectedSemester && selectedSubject) {
      navigate("/facultyindex/addQuestion", {
        state: {
          course: selectedCourse,
          branch: selectedBranch,
          semester: selectedSemester,
          subject: selectedSubject,
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
            <label htmlFor="course" className="form-label">Course</label>
            <select
              id="course"
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="branch" className="form-label">Branch</label>
            <select
              id="branch"
              className="form-select"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabled={!selectedCourse}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="semester" className="form-label">Semester</label>
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
            <label htmlFor="subject" className="form-label">Subject</label>
            <select
              id="subject"
              className="form-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedSemester}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-3">
            Add Question
          </button>
        </form>
      </div>
    </div>
  );
}

export default FetchSubject;
