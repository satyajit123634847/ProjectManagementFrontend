import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../utility/DataTable'; 
import { fetchUsers, deleteUser } from '../../redux/slices/userSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';

interface ListUserProps {
    users: any[];
    loading: boolean;
    error: string | null;
    onDelete: () => void;
}

const columns = (onDelete: (id: string) => void) => [
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
    {
        key: 'actions',
        label: 'Actions',
        render: (user: { _id: string; }) => (
            <button onClick={() => onDelete(user._id)} className='btn btn-danger'>Delete</button>
        ),
    },
];

const ListUser: React.FC<ListUserProps> = ({ users, loading, error, onDelete }) => {
    const dispatch: AppDispatch = useDispatch();

    const handleDelete = useCallback(async (id: string) => {
        try {
            await dispatch(deleteUser(id)).unwrap();
            toast.success('User deleted successfully!');
            onDelete(); 
        } catch (error) {
            toast.error('Failed to delete user.');
        }
    }, [dispatch, onDelete]);

    return (
        <div className='row card p-4 mt-5'>
            <h3>List User</h3>
            <DataTable
                data={users}
                columns={columns(handleDelete)}
                itemsPerPage={10}
            />
        </div>
    );
};

export default ListUser;
