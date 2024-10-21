import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import ReusableForm from '../utility/ReusableForm';
import { addUser } from '../../redux/slices/userSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';

interface UserFormValues {
  email: string;
  name: string;
}

interface AddUserProps {
  onUserAdded: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ onUserAdded }) => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  const formFields = useMemo(() => [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter user email',
      validation: Yup.string().email('Invalid email').required('Email is required'),
      layoutClasses: 'col-4',
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter user name',
      validation: Yup.string().required('Name is required'),
      layoutClasses: 'col-4',
    },
  ], []);

  const initialValues: UserFormValues = {
    email: '',
    name: '',
  };

  const handleSubmit = useCallback(async (data: UserFormValues) => {
    try {
      await dispatch(addUser(data)).unwrap();
      toast.success('User added successfully!');
      onUserAdded();
      data.email=""
      data.name =""

    } catch (error) {
      console.error('Failed to save user:', error);
      toast.error('Failed to save user.');
    }
  }, [dispatch, onUserAdded]);

  return (
    <div className='row card p-4'>
      <h3>Add User</h3>
      <hr />
      {error && <div className="alert alert-danger">{error}</div>}
      <ReusableForm
        fields={formFields}
        onSubmit={handleSubmit}
        initialValues={initialValues} 
        submitButtonText={loading ? 'Saving...' : 'Add User'}
        submitButtonClass={"col-2 mt-4"}
      />
    </div>
  );
}

export default AddUser;
