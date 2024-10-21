import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../utility/DataTable'; 
import { deleteProject } from '../../redux/slices/projectSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';

interface ListProjectProps {
    onProjectDeleted: () => void;
}

const columns = (onDelete: (id: number) => void) => [
    { key: 'name', label: 'Project Name' },
    { key: 'description', label: 'Description' },
    {
        key: 'actions',
        label: 'Actions',
        render: (project: { _id: number; }) => (
            <button onClick={() => onDelete(project._id)} className='btn btn-danger'>Delete</button>
        ),
    },
];

const ListProject: React.FC<ListProjectProps> = ({ onProjectDeleted }) => {
    const dispatch: AppDispatch = useDispatch();
    const projects = useSelector((state: RootState) => state.projects.projects);
    const loading = useSelector((state: RootState) => state.projects.loading);
    const error = useSelector((state: RootState) => state.projects.error);
    const transformedProjects = projects.map((project) => ({ ...project }));


    
    const handleDelete = useCallback(async (id: number) => {
        try {
            await dispatch(deleteProject(id)).unwrap();
            toast.success('Project deleted successfully!');
            onProjectDeleted(); 
        } catch (error) {
            toast.error('Failed to delete project.');
        }
    }, [dispatch, onProjectDeleted]);

    return (
        <div className='row card p-4 mt-5'>
            <h3>List Project</h3>
           
            <DataTable
                data={transformedProjects}
                columns={columns(handleDelete)}
                itemsPerPage={10}
            />
        </div>
    );
};

export default ListProject;
