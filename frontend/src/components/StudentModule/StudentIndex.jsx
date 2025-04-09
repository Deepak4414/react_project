import React from 'react';
import  { useState, useEffect } from 'react';
import {  Routes, Route, Outlet } from 'react-router-dom';
import Navbar from '../StudentModule/View/MainComponent/Navbar'; // Assuming you have a Navbar component
import Home from './View/MainComponent/Home'; // Assuming you have a Home component
import ExploreMaterial from '../StudentModule/View/MainComponent/ExploreMaterial'; // Assuming you have an ExploreMaterial component
import Logout from '../Registration/Logout'; // Assuming you have a Logout component


function StudentIndex({isLoggedIn}) {
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
    <div className="app">
      <Navbar isLoggedIn={isLoggedIn}/>
      <main>
        <Routes>
          <Route path="/" element={<Home username={userState}/>} />
          <Route path="/explore-material" element={<ExploreMaterial username={userState} />} />
          <Route path="/view-course" element={<Home />} />
          <Route path="/logout" element={<Logout />} />   
        </Routes>
        <Outlet />
      </main>
    </div>
  );
}

export default StudentIndex;