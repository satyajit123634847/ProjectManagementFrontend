import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import ReusableForm from '../utility/ReusableForm';
import { login } from '../../redux/slices/authSlice';
import styles from './LoginForm.module.css';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const formFields = useMemo(() => [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      validation: Yup.string().email('Invalid email').required('Email is required'),
      layoutClasses: 'col-12',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Choose a password',
      validation: Yup.string().required('Password is required').min(4, 'Password must be at least 4 characters'),
      layoutClasses: 'col-12',
    },
  ], []);

  const initialValues: LoginFormValues = {
    email: '', 
    password: '', 
  };

  const handleSubmit = async (data: LoginFormValues) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.success('Login successful!');
      navigate('/users');
    } catch (error) {
      console.error('Login failed:', error);
      
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      <div className={`${styles.loginFormCard} card`}>
        <div className="card-body">
          <h2 className={`${styles.formTitle} h2 mb-5`}>Welcome back</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <ReusableForm 
            fields={formFields}
            initialValues={initialValues}
            onSubmit={handleSubmit} 
            submitButtonText={loading ? 'Logging in...' : 'Log In'}
            submitButtonClass={"col-12"}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
