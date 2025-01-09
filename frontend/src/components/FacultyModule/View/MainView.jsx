import React from "react";
import Navbar from "./MainComponent/Navbar";
import Faculty from "./MainComponent/Faculty";
const MainView = ({isLoggedIn}) => {
    return (
        <div>
            <Faculty isLoggedIn={isLoggedIn}/>
        </div>
    );
};
export default MainView;