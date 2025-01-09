import React, { useState } from 'react';
import DropDown from './DropDown';
import TwoColumnPage from './TwoColumnPage';

const Main = ({username}) => {
    const [selectedSubject, setSelectedSubject] = useState(null);

    // This function is called when the subject is selected and form is submitted
    const handleSubmit = (subject) => {
        setSelectedSubject(subject);
    };

    return (
        <div className="Main">
            <DropDown onSubmit={handleSubmit} />
            {selectedSubject && <TwoColumnPage selectedSubject={selectedSubject} username={username} />}
        </div>
    );
};

export default Main;
