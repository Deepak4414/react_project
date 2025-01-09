import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainComponent from './components/MainComponent';

const MainApp = () => {
    return (
        // <BrowserRouter>
            <div>
                <MainComponent />
            </div>
        // </BrowserRouter>
    );
};

export default MainApp;