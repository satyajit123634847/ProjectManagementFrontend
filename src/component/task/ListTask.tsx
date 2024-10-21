import React from 'react';
import { useDispatch } from 'react-redux';
import DataTable from '../utility/DataTable';
import { deleteTask, setCurrentTask } from '../../redux/slices/taskSlice';
import { toast } from 'react-toastify';
import { AppDispatch } from '../../redux/store';


interface Task {
    _id: string;
    title: string;
    description: string;
    assignee?: { name: string };
    project?: { name: string };
    priority: string;
    dueDate: string | Date;
    taskStatus: string;
}

const formatDate = (dateString: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const getPriorityClass = (priority: string) => {
    switch (priority) {
        case 'High':
            return 'text-danger';
        case 'Medium':
            return 'text-warning';
        case 'Low':
            return 'text-success';
        default:
            return '';
    }
};

const getStatusClass = (status: string) => {
    switch (status) {
        case 'In Progress':
            return 'text-warning';
        case 'Completed':
            return 'text-success';
        case 'To Do':
            return 'text-danger';
        default:
            return '';
    }
};


const columns = (onDelete: (id: string) => Promise<void>, onEdit: (task: Task) => void) => [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    {
        key: 'assignee',
        label: 'Assignee',
        render: (item: Task) => item.assignee ? item.assignee.name : 'Unassigned',
    },
    {
        key: 'project',
        label: 'Project Name',
        render: (item: Task) => item.project ? item.project.name : 'Unassigned',
    },
    {
        key: 'priority',
        label: 'Priority',
        render: (item: Task) => (
            <span className={getPriorityClass(item.priority)}>
                {item.priority}
            </span>
        ),
    },
    {
        key: 'dueDate',
        label: 'Due Date',
        render: (item: Task) => formatDate(item.dueDate),
    },
    {
        key: 'taskStatus',
        label: 'Status',
        render: (item: Task) => (
            <span className={getStatusClass(item.taskStatus)}>
                {item.taskStatus}
            </span>
        ),
    },
    {
        key: 'actions',
        label: 'Actions',
        render: (item: Task) => (
            <>
                <button onClick={() => onEdit(item)} className='btn btn-warning text-white mx-2'>Edit</button>
                <button onClick={() => onDelete(item._id)} className='btn btn-danger'>Delete</button>
            </>
        ),
    },
];

const ListTask = ({ tasks, onTaskUpdated }: { tasks: Task[]; onTaskUpdated: () => void }) => {
    const dispatch: AppDispatch = useDispatch();

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteTask(id)).unwrap();
            toast.success('Task deleted successfully!');
            onTaskUpdated();
        } catch (error) {
            toast.error('Failed to delete task.');
        }
    };

    const handleEdit = (task: any) => {
        dispatch(setCurrentTask(task));
        onTaskUpdated();
        window.scrollTo(0, 0);
    };

    return (
        <div className='row card p-4 mt-5'>
            <h3>List Task</h3>
            <DataTable
                data={tasks}
                columns={columns(handleDelete, handleEdit)}
                itemsPerPage={10}
            />
        </div>
    );
};

export default ListTask;
