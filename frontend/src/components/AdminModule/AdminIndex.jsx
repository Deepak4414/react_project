import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';  // <-- import useLocation
import ManageCourses from './ManageCourses';
import ManageBranches from './ManageBranches';
import ManageSemesters from './ManageSemesters';
import ManageSubjects from './ManageSubjects';
import Contact from '../OtherComponent/Contact';
import Terms from '../OtherComponent/Terms';
import Privacy from '../OtherComponent/Privacy';
import Header from '../OtherComponent/Header';


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
  const isLoggedIn = true; // You can get this from your auth logic

  return (
    <div>
      {/*  <Header isLoggedIn={isLoggedIn} /> */}
      
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <nav style={{ width: '220px', background: '#eee', padding: '1rem' }}>
          <h3>Admin Panel</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to={`${basePath}/courses`}>Courses</Link></li>
            <li><Link to={`${basePath}/branches`}>Branches</Link></li>
            <li><Link to={`${basePath}/semesters`}>Semesters</Link></li>
            <li><Link to={`${basePath}/subjects`}>Subjects</Link></li>
          </ul>
        </nav>
        <main style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Here you can manage courses, branches, semesters, and subjects.</p>
          <Routes>
            <Route path="courses" element={<ManageCourses />} />
            <Route path="branches" element={<ManageBranches />} />
            <Route path="semesters" element={<ManageSemesters />} />
            <Route path="subjects" element={<ManageSubjects />} />
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
