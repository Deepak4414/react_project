import React from "react";
import MainView from "./View/MainView";

const FacultyIndex = ({isLoggedIn}) => {
   
  
    return (
        <div>
            <MainView isLoggedIn={isLoggedIn} />
        </div>
    );
};
export default FacultyIndex;