import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/slices/taskSlice';
import AddTask from '../component/task/AddTask';
import ListTask from '../component/task/ListTask';
import ReusableForm from '../component/utility/ReusableForm';
import { AppDispatch, RootState } from '../redux/store';

const TaskPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [selectedStatus, setSelectedStatus] = useState('');

    const refreshTasks = useCallback(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    useEffect(() => {
        refreshTasks();
    }, [refreshTasks]);

    const filteredTasks = selectedStatus
        ? tasks.filter(task => task.taskStatus === selectedStatus)
        : tasks;

    const filterFields = useMemo(() => [
        {
            name: 'taskStatusFilter',
            label: 'Filter by Status',
            type: 'select',
            options: [
                { value: '', label: 'All Tasks' },
                { value: 'To Do', label: 'To Do' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
            ],
            layoutClasses: 'col-4 mt-1',
        },
    ], []);

    const handleFilterSubmit = (data: { taskStatusFilter: React.SetStateAction<string>; }) => {
        setSelectedStatus(data.taskStatusFilter);
    };

    return (
        <div className='container mt-5'>
            <AddTask onTaskAdded={refreshTasks} />
            <div className="mb-3 card p-4 mt-5">
                <ReusableForm
                    fields={filterFields}
                    onSubmit={handleFilterSubmit}
                    submitButtonText="Filter"
                    submitButtonClass="col-2 mt-4"
                    initialValues={{ taskStatusFilter: selectedStatus }}
                />
            </div>
            <ListTask tasks={filteredTasks as any} onTaskUpdated={refreshTasks} />
        </div>
    );
};

export default TaskPage;
