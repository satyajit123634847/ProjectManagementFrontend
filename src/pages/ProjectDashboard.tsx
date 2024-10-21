import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProjects } from '../redux/slices/projectSlice';
import { AppDispatch } from '../redux/store';

const ProjectManagement = () => {
    const dispatch: AppDispatch = useDispatch();

    const refreshProjects = useCallback(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    useEffect(() => {
        console.log("Fetching projects...");
        refreshProjects();
    }, [refreshProjects]);

    const AddProject = React.lazy(() => import('../component/project/AddProject'));
    const ListProject = React.lazy(() => import('../component/project/ListProject'));

    return (
        <div className='container mt-5'>
            <React.Suspense fallback={<div>Loading...</div>}>
                <AddProject onProjectAdded={refreshProjects} />
                <ListProject onProjectDeleted={refreshProjects} />
            </React.Suspense>
        </div>
    );
};

export default ProjectManagement;
