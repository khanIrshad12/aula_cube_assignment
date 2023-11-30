import Link from 'next/link';
import TaskList from '../components/TaskList';
const Home = () => {
  return (
    <>
      <div className='relative w-full h-full'>
      <h1 className='flex justify-center my-4 text-lg'>Task Management</h1>
      <Link  href={`/AddTaskForm`}>
      <button className='absolute right-2 border p-2 w-24 bg-sky-500'>Add Task</button>
      </Link>
      <div className='flex flex-col items-center mt-16'>
      <TaskList/>
      </div>
      </div>
    </>
  );
};

export default Home;
