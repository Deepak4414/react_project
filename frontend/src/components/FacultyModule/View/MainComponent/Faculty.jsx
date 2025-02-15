import React,{useEffect,useState} from "react";
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
function Faculty({isLoggedIn}) {
   const [userState, setUserState] = useState(null);
   
       useEffect(() => {
           // Retrieve userState from localStorage
           const savedUserState = localStorage.getItem('userState');
           if (savedUserState) {
               setUserState(JSON.parse(savedUserState));
           } else {
               // Handle case where userState is not found (e.g., user is not logged in)
               console.log('No user data found in local storage');
           }
       }, []);
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn}/>
            
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Home username={userState}/>} />
                    <Route path="/add" element={<AddCourse />} />
                    <Route path="/add-topic" element={<AddTopic />} />
                    <Route path="/update" element={<UpdateCourse />} />
                    <Route path="/livechannel" element={<LiveChannel />} />
                    <Route path="/livechanneltime" element={<LiveChannelTime/>}/>
                    <Route path="/addvfstrvideo" element={<AddVfstrVideo />} />
                    <Route path="/savevfstrvideo" element={<SaveVfstrVideo />} />
                    <Route path="/update-topic" element={<UpdateTopic />} />"
                    <Route path="/logout" element={Logout} />
                </Routes>
            </div>
        </>
    );
}

export default Faculty;
