import React, { useEffect, useState } from "react";
import "./Faculty_Photo.css";
const Faculty_Photo = ({ name }) => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch faculty image from backend
  useEffect(() => {
    if (name) {
      const fetchFacultyImage = async () => {
        try {
          const imageUrl = `http://localhost:5000/api/faculty/image/${name}`;
          setImage(imageUrl);
          setMessage("");
        } catch (error) {
          setMessage("Error fetching image");
        }
      };
      fetchFacultyImage();
    } else {
      setMessage("Please enter a name");
    }
  }, [name]);

  return (
    <div
      className="container"
      style={{ display: "grid", gridTemplateColumns: "3fr 1fr" }}
    >
      <div>
        <h5 style={{ fontSize: "15px", textAlign: "left", marginLeft:'-12px' }}>{name}</h5>
      </div>
      {image && (
        <div className="image-container">
          <img src={image} alt="Faculty" className="faculty-image" />
        </div>
      )}
    </div>
  );
};

export default Faculty_Photo;
