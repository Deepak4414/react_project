import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';  // <-- import useLocation
import ManageCourses from './ManageCourses';
import ManageDiscipline from './ManageDiscipline';
import ManageSemesters from './ManageSemesters';
import ManageProgram from './ManageProgram';
import Contact from '../OtherComponent/Contact';
import Terms from '../OtherComponent/Terms';
import Privacy from '../OtherComponent/Privacy';
import FacultyRegistration from './FacultyRegistration'; 
import AddFacultyDetalis from './AddFacultyDetalis/AddFacultyDetalis'; // Adjust the import path as necessary
import './AdminIndex.css'; // Import the CSS file for styling
const AdminIndex = () => {
  const location = useLocation();
  const currentPath = location.pathname.endsWith('/') 
    ? location.pathname.slice(0, -1) 
    : location.pathname;

  const getBasePath = (pathname) => {
    if (pathname.startsWith('/studentindex')) return '/studentindex';
    if (pathname.startsWith('/facultyindex')) return '/facultyindex';
    if (pathname.startsWith('/adminindex')) return '/adminindex';
    return '';
  };

  const basePath = getBasePath(currentPath);

  return (
    <div>
      {/*  <Header isLoggedIn={isLoggedIn} /> */}
      
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <nav style={{ width: '220px', background: '#eee', padding: '1rem' }}>
          <h3>Admin Panel</h3>
          <ul style={{ listStyle: 'none', padding: 0 }} className='admin-nav-list'>
            <li><Link to={`${basePath}/courses`}>Programs</Link></li>
            <li><Link to={`${basePath}/branches`}>Disciplines</Link></li>
            <li><Link to={`${basePath}/semesters`}>Semesters</Link></li>
            <li><Link to={`${basePath}/subjects`}>Courses</Link></li>
             <li><Link to={`${basePath}/faculty-registration`}>Faculty Registration</Link></li>
            <li><Link to={`${basePath}/addfacultydetails`}>Add Faculty Details</Link></li>
          </ul>
        </nav>
        <main style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Here you can manage courses, branches, semesters, and subjects.</p>
          <Routes>
            <Route path="courses" element={<ManageProgram />} />
            <Route path="branches" element={<ManageDiscipline />} />
            <Route path="semesters" element={<ManageSemesters />} />
            <Route path="subjects" element={<ManageCourses />} />
            <Route path="faculty-registration" element= {<FacultyRegistration/>}/>
            <Route path="/addfacultydetails" element={<AddFacultyDetalis />} />
            {/* Add other routes as needed */}
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminIndex;
