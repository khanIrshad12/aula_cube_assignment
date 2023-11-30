'use client'
import EditTaskForm from '@/components/EditTaskForm';
import { useParams } from 'next/navigation';

const EditTaskPage = () => {
    const {id} =useParams();

  return (
    <div>
      <EditTaskForm taskId={id} />
    </div>
  );
};

export default EditTaskPage;
