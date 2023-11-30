'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const EditTaskForm = ({ taskId }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [loading, setLoading] = useState(false)
  const router=useRouter()

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`/api/tasks/${taskId}`);
        const task = response.data;
        setTaskName(task.name);
        setTaskDescription(task.description);
        setPriority(task.priority);
       
  
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleEditTask = async () => {
    try {
      setLoading(true);

      // Fetch existing task details
      const existingTaskResponse = await axios.get(`/api/tasks/${taskId}`);
      const existingTask = existingTaskResponse.data;

      // Implement validation and logic to edit the task
      await axios.put(`/api/tasks/${taskId}`, {
        name: taskName,
        description: taskDescription,
        priority: priority,
        // Add more fields if needed
      });

      // Update local storage with the edited task
      const updatedTaskResponse = await axios.get(`/api/tasks/${taskId}`);
      const updatedTask = updatedTaskResponse.data;

      // Preserve certain fields in local storage
      const preservedData = {
        _id: existingTask._id,
        insertedDate: existingTask.insertedDate,
        // Add more fields if needed
      };

      // Update only the edited fields in local storage
      const updatedData = {
        ...preservedData,
        name: updatedTask.name,
        description: updatedTask.description,
        priority: updatedTask.priority,
      };

      localStorage.setItem(`task_${taskId}`, JSON.stringify(updatedData));

      // Redirect to the home page after editing
      router.push('/');
    } catch (error) {
      console.error('Error editing task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center mt-10'>
      <h2 className='text-xl font-serif font-semibold mb-4'>Edit Task</h2>
      <form className='flex flex-col items-center'>
        <label className='flex flex-col'>
          Task Name:
          <input
            className='border p-2 my-2'
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </label>
        <label className='flex flex-col'>
          Task Description:
          <textarea
            className='border w-[15rem] h-[12rem] p-2 my-2'
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </label>
        <label className='flex flex-col my-4'>
          Priority:
          <select
            className='w-[14rem] border h-10 p-2'
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <button
          className='mt-6 w-24 h-10 border bg-sky-500 rounded text-slate-200'
          type="button"
          onClick={handleEditTask}
        >
        {loading ? 'Editing...' : 'Edit Task'}
        </button>
      </form>
    </div>
  );
};

export default EditTaskForm;
