import React, { useState, useEffect } from "react";
import Link from "./Link"; // Assuming the Link component is reused for links
import { useParams, useNavigate } from "react-router-dom";

const UpdateCourse = () => {
  const { courseId } = useParams(); // Course ID from route params
  const navigate = useNavigate();

  // State to manage course data
  const [courseData, setCourseData] = useState({
    title: "",
    levels: {
      Basic: [],
      Medium: [],
      Advanced: [],
    },
  });

  // Fetch course data (Simulated here, replace with actual API call)
  useEffect(() => {
    const fetchCourseData = async () => {
      // Replace with actual API call
      const fetchedData = {
        title: "Existing Course Title",
        levels: {
          Basic: [
            { title: "Basic Link 1", link: "http://basic1.com", description: "Desc 1", rating: 3 },
            { title: "Basic Link 2", link: "http://basic2.com", description: "Desc 2", rating: 4 },
          ],
          Medium: [
            { title: "Medium Link 1", link: "http://medium1.com", description: "Desc 1", rating: 2 },
          ],
          Advanced: [
            { title: "Advanced Link 1", link: "http://advanced1.com", description: "Desc 1", rating: 5 },
          ],
        },
      };
      setCourseData(fetchedData);
    };

    fetchCourseData();
  }, [courseId]);

  // Handle title changes
  const handleTitleChange = (e) => {
    setCourseData((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  // Handle changes for links in a specific level
  const handleInputChange = (level, index, field, value) => {
    const updatedLinks = [...courseData.levels[level]];
    updatedLinks[index][field] = value;
    setCourseData((prev) => ({
      ...prev,
      levels: {
        ...prev.levels,
        [level]: updatedLinks,
      },
    }));
  };

  // Add a new link to a specific level
  const addLink = (level) => {
    setCourseData((prev) => ({
      ...prev,
      levels: {
        ...prev.levels,
        [level]: [...prev.levels[level], { title: "", link: "", description: "", rating: 1 }],
      },
    }));
  };

  // Remove a link from a specific level
  const removeLink = (level, index) => {
    const updatedLinks = [...courseData.levels[level]];
    updatedLinks.splice(index, 1);
    setCourseData((prev) => ({
      ...prev,
      levels: {
        ...prev.levels,
        [level]: updatedLinks,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the updated course data (Replace with actual API call)
    console.log("Updated Course Data:", courseData);

    // Redirect or show success message
    alert("Course updated successfully!");
    navigate("/courses"); // Replace with your actual route
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Update Course</h1>
      <form onSubmit={handleSubmit}>
        {/* Course Title */}
        <div className="mb-3">
          <label htmlFor="course-title" className="form-label">
            Course Title
          </label>
          <input
            type="text"
            id="course-title"
            className="form-control"
            value={courseData.title}
            onChange={handleTitleChange}
            placeholder="Enter course title"
          />
        </div>

        {/* Links for Each Level */}
        {["Basic", "Medium", "Advanced"].map((level) => (
          <div key={level} className="mb-4">
            <h3>{level} Links</h3>
            {courseData.levels[level].map((link, index) => (
              <Link
                key={`${level}-${index}`}
                level={level}
                index={index}
                data={link}
                handleInputChange={handleInputChange}
                removeLink={removeLink}
              />
            ))}
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={() => addLink(level)}
            >
              Add {level} Link
            </button>
          </div>
        ))}

        <div className="mt-4">
          <button type="submit" className="btn btn-success">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;
