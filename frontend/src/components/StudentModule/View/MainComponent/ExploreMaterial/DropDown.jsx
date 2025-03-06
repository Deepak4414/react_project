import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Css/DropDown.css';

const DropDown = ({ onSubmit }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Fetch courses on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  // Fetch branches when course changes
  useEffect(() => {
    if (selectedCourse) {
      axios.get(`http://localhost:5000/api/branches/${selectedCourse}`)
        .then((response) => {
          setBranches(response.data);
          setSemesters([]);  // Reset dependent dropdowns
          setSubjects([]);
        })
        .catch((error) => {
          console.error('Error fetching branches:', error);
        });
    }
  }, [selectedCourse]);

  // Fetch semesters when branch changes
  useEffect(() => {
    if (selectedBranch) {
      axios.get(`http://localhost:5000/api/semesters/${selectedBranch}`)
        .then((response) => {
          setSemesters(response.data);
          setSubjects([]);
        })
        .catch((error) => {
          console.error('Error fetching semesters:', error);
        });
    }
  }, [selectedBranch]);

  // Fetch subjects when semester changes
  useEffect(() => {
    if (selectedSemester) {
      axios.get(`http://localhost:5000/api/subjects/${selectedSemester}`)
        .then((response) => {
          setSubjects(response.data);
        })
        .catch((error) => {
          console.error('Error fetching subjects:', error);
        });
    }
  }, [selectedSemester]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedCourse && selectedBranch && selectedSemester && selectedSubject) {
      // Send selected subject data to parent
      onSubmit(selectedSubject);
    } else {
      alert('Please complete all selections.');
    }
  };

  return (
    <div className='main-container'>
      <form onSubmit={handleSubmit} className='dropdown-container'>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.courseName}
            </option>
          ))}
        </select>

        {selectedCourse && (
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </option>
            ))}
          </select>
        )}

        {selectedBranch && (
          <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester.semesterId} value={semester.semesterId}>
                {semester.semesterName}
              </option>
            ))}
          </select>
        )}

        {selectedSemester && (
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.subjectName}
              </option>
            ))}
          </select>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DropDown;
