import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import AddCourse from "./AddCourse";
import AddTopic from "./AddTopic";
import UpdateCourse from "./Update/UpdateCourse";
import Logout from "../../../Registration/Logout";
import LiveChannel from "./LiveChannel";
import LiveChannelTime from "./LiveChannelTime";
import AddVfstrVideo from "./AddVfstrVideo/AddVfstrVideo";
import SaveVfstrVideo from "./AddVfstrVideo/SaveVfstrVideo";
import UpdateTopic from "./Update/UpdateTopic";
import AddFacultyDetalis from "./AddFacultyDetalis/AddFacultyDetalis";
import ExploreMaterial from "../../../StudentModule/View/MainComponent/ExploreMaterial";
import LoadingSpinner from "../SubComponent/LoadingSpinner";
import ErrorMessage from "../SubComponent/ErrorMessage";
import "../../Css/Faculty.css";
import QuestionInsertion from "../../../Assessment/UploadQuestion/QuestionInsertion";
import FetchSubject from "../../../Assessment/UploadQuestion/FetchSubject";
import LiveChannelProgramGuide from "./LiveChannelProgramGuide";

function Faculty({ isLoggedIn }) {
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUserState = localStorage.getItem('userState');
        if (savedUserState) {
          setUserState(JSON.parse(savedUserState));
        } else {
          setError('No user data found. Please login again.');
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error parsing user state:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="faculty-container">
      <Navbar isLoggedIn={isLoggedIn} user={userState} />
      
      <div className="faculty-content">
        <Routes>
          <Route path="/" element={<Home username={userState?.username} />} />
          <Route path="/add" element={<AddCourse />} />
          <Route path="/add-topic" element={<AddTopic />} />
          <Route path="/update" element={<UpdateCourse />} />
          <Route path="/livechannel" element={<LiveChannel />} />
          <Route path="/livechanneltime" element={<LiveChannelTime />} />
          <Route path="/addvfstrvideo" element={<AddVfstrVideo />} />
          <Route path="/savevfstrvideo" element={<SaveVfstrVideo />} />
          <Route path="/update-topic" element={<UpdateTopic />} />
          <Route path="/addfacultydetails" element={<AddFacultyDetalis />} />
          <Route path="/addQuestion" element={<QuestionInsertion />}/>
          <Route path="/fetch-subject-for-question" element={<FetchSubject />} />
          <Route path="/live-channel-program-guide" element={<LiveChannelProgramGuide />} />
          <Route path="/explore-material" element={<ExploreMaterial />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
}

export default Faculty;