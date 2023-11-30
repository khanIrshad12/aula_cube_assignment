'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FcCollapse } from "react-icons/fc";
import { MdDelete, MdEdit } from "react-icons/md";
import Link from 'next/link';
import { Pagination } from './Pagination';
import Loading from './loading';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [isCollapseIconRotated, setIsCollapseIconRotated] = useState({});
    const [sortOption, setSortOption] = useState('inseertedDate');
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true)
                const response = await axios.get('/api/tasks');
                setTasks(response.data.tasks);
                setLoading(false)

            } catch (error) {
                console.error('Error fetching tasks:', error);
                setTasks([]); // Set tasks to an empty array in case of an error
                setLoading(false)
            }
        };

        fetchTasks();
    }, []);

    const handleSortChange = (e) => {
        setLoading(true)
        setSortOption(e.target.value);
        setLoading(false)
    };

    const getSortedTasks = () => {
        // Sort tasks based on the selected option
        return tasks.slice().sort((taskA, taskB) => {
            switch (sortOption) {
                case 'name':
                    return taskA.name.localeCompare(taskB.name);
                case 'priority':
                    return taskA.priority.localeCompare(taskB.priority);
                    case 'insertedDate':
                    return new Date(taskA.insertedDate) - new Date(taskB.insertedDate);
                case 'completed':
                    return taskA.completed === taskB.completed
                        ? 0
                        : taskA.completed
                            ? -1
                            : 1;
                
                default:
                    return 0;
            }
        });
    };

    // Get current tasks for the current page
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = getSortedTasks().slice(indexOfFirstTask, indexOfLastTask);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleToggleComplete = async (taskId) => {
        // Implement logic to toggle task completion status
        try {
            // Find the task with the specified taskId
            const updatedTasks = tasks.map((task) =>
                task._id === taskId ? { ...task, completed: !task.completed } : task
            );
            setTasks(updatedTasks);

            // Send a request to update the completion status in the database
            await axios.put(`/api/checkboxUpdate/${taskId}`, {
                completed: updatedTasks.find((task) => task._id === taskId).completed,
            });
        } catch (error) {
            console.error('Error updating task completion status:', error);
            // Rollback the local state update in case of an error
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? { ...task, completed: !task.completed } : task
                )
            );
        }
    };

    const handleDeleteTask = async (taskId) => {
        // Implement logic to delete task
        try {
            setLoading(true)
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

            // Send a DELETE request to the server API endpoint to delete the task in the database
            await axios.delete(`/api/tasks/${taskId}`);
            setLoading(false)
        } catch (error) {
            console.error('Error deleting task:', error);
            // Rollback the local state update in case of an error
            setTasks((prevTasks) => [...prevTasks]);
            setLoading(false)
        }
    };

    const handleToggleDescription = (taskId) => {
        setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
        setIsCollapseIconRotated((prevRotation) => ({
            ...prevRotation,
            [taskId]: !prevRotation[taskId],
        }));
    };

    return (
        <div>
            <div className='flex flex-col items-center '>
                <label className='text-sm'>Sort By:</label>
                <select
                    className='border-[1px] rounded-lg w-[152px] h-10 mt-2'
                    onChange={handleSortChange}
                    value={sortOption}
                >
                <option value='insertedDate'>InsertedDate</option>
                    <option value='name'>Task Name</option>
                    <option value='priority'>Priority</option>
                    <option value='completed'>Completion Status</option>
                </select>
            </div>
            <h2 className='text-xl my-4'>Task List</h2>
            {loading ? (<Loading />) :
                currentTasks.length === 0 ? (
                    <p>No tasks available</p>
                ) : (
                    <ul>
                        {currentTasks.map((task) => (
                            <li key={task._id} className='h-auto border my-5 p-2 flex flex-col items-start'>
                                <div className='flex items-center justify-between w-full'>
                                    <input
                                        className='mr-2'
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggleComplete(task._id)}
                                    />
                                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }} className='mx-2 font-serif font-semibold'>{task.name}</span>
                                    <div className='flex items-center'>
                                        <Link href={`/EditTaskForm/${task._id}`}>
                                            <button className='mx-3'><MdEdit /></button>
                                        </Link>
                                        <button className='text-red-600' onClick={() => handleDeleteTask(task._id)}><MdDelete /></button>
                                        <span
                                            onClick={() => handleToggleDescription(task._id)}
                                            className={`cursor-pointer transform mx-3 ${isCollapseIconRotated[task._id] ? 'rotate-180' : ''
                                                }`}
                                        >
                                            <FcCollapse />
                                        </span>
                                    </div>
                                </div>
                                <span
                                    className={`transition-all overflow-hidden w-[18rem] ${expandedTaskId === task._id ? 'max-h-full' : 'max-h-0'
                                        } duration-300 ease-in-out`}
                                >
                                    {task.description}
                                </span>
                                <span className='text-lg font-semibold'>{task.priority}</span>
                            </li>
                        ))}
                    </ul>
                )}


            <Pagination
                tasksPerPage={tasksPerPage}
                totalTasks={getSortedTasks().length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    );
};

export default TaskList;
