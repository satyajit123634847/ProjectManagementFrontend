import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../redux/slices/userSlice';
import AddUser from '../component/user/AddUser';
import ListUser from '../component/user/ListUser';
import { RootState, AppDispatch } from '../redux/store';

const UserPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  const refreshUsers = useCallback(() => {
    
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  return (
    <div className='container mt-5'>
      <AddUser onUserAdded={refreshUsers} />
      <ListUser users={users} loading={loading} error={error} onDelete={refreshUsers} />
    </div>
  );
};

export default UserPage;
