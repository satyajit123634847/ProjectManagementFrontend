import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import ReusableForm from '../utility/ReusableForm';
import { addProject } from '../../redux/slices/projectSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';

interface ProjectFormValues {
  name: string;
  description: string;
}

interface AddProjectProps {
  onProjectAdded: () => void;
}


const AddProject: React.FC<AddProjectProps> = ({ onProjectAdded }) => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.projects.loading);
  const error = useSelector((state: RootState) => state.projects.error);

  const initialValues: ProjectFormValues = {
    name: '',
    description: '',
  };

  const formFields = useMemo(() => [
    {
      name: 'name',
      label: 'Project Name',
      type: 'text',
      placeholder: 'Enter project name',
      validation: Yup.string().required('Project name is required'),
      layoutClasses: 'col-4',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter project description',
      validation: Yup.string().required('Description is required'),
      layoutClasses: 'col-4',
    },
  ], []);

  const handleSubmit = useCallback(async (data: ProjectFormValues) => {
    try {
      await dispatch(addProject(data as any)).unwrap();
      toast.success('Project added successfully!');
      onProjectAdded(); 
      data.name = ""
      data.description = ""

    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error('Failed to save project.');
    }
  }, [dispatch, onProjectAdded]);

  return (
    <div className='row card p-4'>
      <h3>Add Project</h3>
      <hr />
      {error && <div className="alert alert-danger">{error}</div>}
      <ReusableForm
        fields={formFields}
        onSubmit={handleSubmit}
        submitButtonText={loading ? 'Saving...' : 'Add Project'}
        submitButtonClass={"col-2 mt-4"}
        initialValues={initialValues}
      />
    </div>
  );
};

export default AddProject;
