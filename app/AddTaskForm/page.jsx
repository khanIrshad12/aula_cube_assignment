'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AddTaskForm = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [loading, setLoading] = useState(false);
  const router =useRouter();

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      if (!taskName) {
        alert('Task Name is required');
        setLoading(false);
        return;
      }

      // Make a POST request to the API to add the task
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name:taskName, description:taskDescription, priority }),
      });
      const data=await res.json()
      

      if (res.ok) {
        const newTask = {
          _id: data.resdata._id,
          name: taskName,
          description: taskDescription,
          priority,
          insertedDate: data.resdata.insertedDate, // Assuming the API returns the insertedDate
        };

        // Save the new task to local storage
        saveTaskToLocal(newTask);
        setTaskName('');
      setTaskDescription('');
      setPriority('');

      router.push('/');
      } else {
        throw new Error("Failed to create a task");
      }
      
    } catch (error) {
      console.error('Error adding task:', error);
      alert('An error occurred while adding the task.');
    }finally {
      setLoading(false); 
    }
  };

  const saveTaskToLocal = (task) => {
    // Get existing tasks from local storage
    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Add the new task to the existing tasks
    const updatedTasks = [...existingTasks, task];

    // Save the updated tasks to local storage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className='flex flex-col items-center '>
      <h2 className='mt-10 text-xl font-serif font-semibold'>Add Task</h2>
      <form onSubmit={handleAddTask} className='flex flex-col my-4 items-center'>
        <label className='flex flex-col'>
          Task Name:
          <input className='border p-2 my-2' type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
        </label>
        <label className='flex flex-col'>
          Task Description:
          <textarea
          className='border w-[15rem] h-[12rem] p-2'
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </label>
        <label className='flex flex-col my-4'>
          Priority:
          <select className='w-[14rem] border h-10' value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <button className='mt-6 w-24 h-10 border bg-sky-500 rounded text-slate-200' type="submit">{loading ? 'Adding...' : 'Add Task'}</button>
      </form>
    </div>
  );
};

export default AddTaskForm;
