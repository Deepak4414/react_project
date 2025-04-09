import React from "react";
import { Outlet } from "react-router-dom";
import MainView from "./View/MainView";

const FacultyIndex = ({isLoggedIn}) => {
   
  
    return (
        <div>
            <MainView isLoggedIn={isLoggedIn} />
            <Outlet />
        </div>
    );
};
export default FacultyIndex;