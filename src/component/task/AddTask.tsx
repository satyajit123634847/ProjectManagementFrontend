import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import ReusableForm from '../utility/ReusableForm';
import { addTask, updateTask, setCurrentTask } from '../../redux/slices/taskSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { fetchTasks } from '../../redux/slices/taskSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';


interface AddTaskProps {
    onTaskAdded: () => void;
}

interface TaskData {
    title: string;
    description: string;
    project: string;
    assignee: string;
    priority: string;
    taskStatus: string;
    dueDate: string;
}


const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded }) => {
    const dispatch: AppDispatch = useDispatch();
    const loading = useSelector((state: RootState) => state.tasks.loading);
    const error = useSelector((state: RootState) => state.tasks.error);
    const users = useSelector((state: RootState) => state.users.users);
    const projects = useSelector((state: RootState) => state.projects.projects);
    const currentTask = useSelector((state: RootState) => state.tasks.currentTask);

    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchProjects());
    }, [dispatch]);

    useEffect(() => {
        if (currentTask) {
            setFormKey(prevKey => prevKey + 1);
        }
    }, [currentTask]);

    const formFields = useMemo(() => [
        {
            name: 'title',
            label: 'Title',
            type: 'text',
            placeholder: 'Enter task title',
            validation: Yup.string().required('Title is required'),
            layoutClasses: 'col-4 mt-3',
        },
        {
            name: 'description',
            label: 'Description',
            type: 'text',
            placeholder: 'Enter task description',
            validation: Yup.string().required('Description is required'),
            layoutClasses: 'col-4 mt-3',
        },
        {
            name: 'project',
            label: 'Project',
            type: 'select',
            options: projects.map(project => ({ value: project._id, label: project.name })),
            validation: Yup.string().required('Project is required'),
            layoutClasses: 'col-4 mt-3',
        },
        {
            name: 'assignee',
            label: 'Assignee',
            type: 'select',
            options: users.map(user => ({ value: user._id, label: user.name })),
            validation: Yup.string().required('Assignee is required'),
            layoutClasses: 'col-4 mt-3',
        },
        {
            name: 'priority',
            label: 'Priority',
            type: 'select',
            options: [
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' },
            ],
            validation: Yup.string().required('Priority is required'),
            layoutClasses: 'col-4 mt-3',
        },
        {
            name: 'taskStatus',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'To Do', label: 'To Do' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
            ],
            validation: Yup.string().required('Task status is required'),
            layoutClasses: 'col-4 mt-3',
        },
        {
            name: 'dueDate',
            label: 'Due Date',
            type: 'date',
            validation: Yup.date().required('Due date is required'),
            layoutClasses: 'col-4 mt-4',
        },
    ], [users, projects]);


    const handleSubmit = useCallback(async (data: TaskData) => {
        try {
            if (currentTask) {
                await dispatch(updateTask({ ...data, _id: currentTask._id })).unwrap();
                toast.success('Task updated successfully!');
            } else {
                await dispatch(addTask(data)).unwrap();
                toast.success('Task added successfully!');
            }
            dispatch(fetchTasks());
            onTaskAdded();
            data.title = ""
            data.description = ""
            data.project = ""
            data.assignee = ""
            data.priority = ""
            data.taskStatus = ""
            data.dueDate = ""
        } catch (error) {
            toast.error('Failed to add task.');
        }
    }, [dispatch, currentTask, onTaskAdded]);

    const initialValues = useMemo(() => {
        if (currentTask) {
            return {
                title: currentTask.title,
                description: currentTask.description,
                project: (currentTask.project as any)._id,
                assignee: (currentTask.assignee as any)._id,
                priority: currentTask.priority,
                taskStatus: currentTask.taskStatus,
                dueDate: currentTask.dueDate.split('T')[0]
            };
        }
        return {
            title: '',
            description: '',
            project: '',
            assignee: '',
            priority: '',
            taskStatus: '',
            dueDate: '',
        };
    }, [currentTask]);

    console.log("initialValues", initialValues)

    return (
        <div className='row card p-4'>
            <h3>{currentTask ? 'Update Task' : 'Add Task'}</h3>
            <hr />
            {error && <div className="alert alert-danger">{error}</div>}
            <ReusableForm
                key={formKey}
                fields={formFields}
                onSubmit={handleSubmit}
                submitButtonText={loading ? 'Saving...' : (currentTask ? 'Update Task' : 'Add Task')}
                submitButtonClass={"col-2 mt-5"}
                initialValues={initialValues}
            />
        </div>
    );
};

export default AddTask;
