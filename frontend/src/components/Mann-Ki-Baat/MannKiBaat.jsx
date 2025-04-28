import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faHomeLg } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];



function MannKiBaat() {
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [files, setFiles] = useState([]);
    const [lang, setLang] = useState("hi"); // Default to Hindi or whatever you want
    const [audioSrc, setAudioSrc] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (lang) {
            fetchYears();
        }
    }, [lang]);

    const fetchYears = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/mannKiBaat/yearList?langCode=${lang}`);
            const sorted = response.data.sort();
            console.log("sorted",sorted);
            setYears(sorted);
            setSelectedYear(sorted[0]);
            fetchFiles(sorted[0]);
            setError(false);
        } catch (err) {
            console.error(err);
            setError(true);
        }
    };

    const fetchFiles = async (year) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/mannKiBaat/fileInfo?langCode=${lang}&year=${year}`);
            setFiles(response.data.sort());
        } catch (err) {
            console.error(err);
        }
    };

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);
        fetchFiles(year);
    };

    const playAudio = (file) => {
        const monthIndex = parseInt(file.split(".")[0]) - 1;
        const audioUrl = `http://localhost:5000/api/mannKiBaat/getMannKiBaat/${lang}/${selectedYear}/${file}`;
        setAudioSrc(audioUrl);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setAudioSrc("");
    };

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/studentindex" className="fs-2 text-decoration-none">
                    <FontAwesomeIcon icon={faHomeLg} />
                </Link>
                <div className="d-flex gap-2 align-items-center">
                    <label>Select Language:</label>
                    <select
                        className="form-select"
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                    >
                        <option value="hi">Hindi</option>
                        <option value="en">English</option>
                        <option value="te">Telugu</option>
                        {/* Add more languages as needed */}
                    </select>
                </div>
            </div>

            <h2 className="text-center mb-4">Man Ki Baat</h2>

            {error ? (
                <div className="text-center text-danger">Something went wrong while loading data.</div>
            ) : (
                <>
                    {/* Year Selector */}
                    <div className="mb-3 text-center">
                        <label className="form-label fs-5">Select Year</label>
                        <select
                            className="form-select w-50 mx-auto"
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            {years.map((year, i) => (
                                <option key={i} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Audio Buttons */}
                    <div className="row justify-content-center">
                        {files.map((file, i) => {
                            const monthName = months[parseInt(file.split(".")[0]) - 1];
                            return (
                                <div className="col-md-4 mb-3" key={i}>
                                    <button
                                        className="btn btn-info text-white w-100 rounded-pill p-3"
                                        onClick={() => playAudio(file)}
                                    >
                                        <FontAwesomeIcon icon={faHeadphones} className="me-2" />
                                        {monthName}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Audio Modal */}
            {showModal && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    onClick={closeModal}
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                >
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Now Playing</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body text-center">
                                <audio controls autoPlay src={audioSrc}></audio>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MannKiBaat;
