import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import './Navbar.module.css';
import { toast } from 'react-toastify';

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        toast.success('User logout successful!');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow ">
            <div className="container py-2">
                <NavLink className="navbar-brand" to="/projects">Admin Dashboard</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink 
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                                to="/users"
                            >
                                Users
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink 
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                                to="/projects"
                            >
                                Projects
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink 
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                                to="/tasks"
                            >
                                Tasks
                            </NavLink>
                        </li>
                    </ul>
                    <button className="btn btn-outline-light submit-btn ms-3" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
