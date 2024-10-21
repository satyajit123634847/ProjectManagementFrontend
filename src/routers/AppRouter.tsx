import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '../pages/LoginPage';
import ProjectDashboard from '../pages/ProjectDashboard';
import Navbar from '../component/layout/Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import UserPage from '../pages/UserPage';
import TaskPage from '../pages/TaskPage';



const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = useSelector((state: RootState) => state.auth.token);
    return token ? children : <Navigate to="/" />;
};

const AppRouter = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/';

    return (
        <>
            {!isLoginPage && <Navbar />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/projects"
                    element={
                        <PrivateRoute>
                            <ProjectDashboard />
                        </PrivateRoute>
                    }
                />
                <Route path="/users" element={
                    <PrivateRoute>
                       <UserPage />
                    </PrivateRoute>
                } />
                <Route path="/tasks" element={
                    <PrivateRoute>
                       <TaskPage />
                    </PrivateRoute>
                } />
            </Routes>
        </>
    );
};

export default AppRouter;
