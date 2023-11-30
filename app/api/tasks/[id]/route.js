import { connectMongoDB } from "@/utils/dbConnect";
import Task from "@/model/Task";
import { NextResponse } from "next/server";

export const GET = async (req,{ params }) => {
    try {
      const { id} = params;
      await connectMongoDB();
      
      const task = await Task.findById(id);
  
      if (!task) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
      }
  
      return NextResponse.json(task);
    } catch (error) {
      console.error('Error fetching task details:', error);
      return NextResponse.json(
        { message: 'Something went wrong during fetching task details' },
        { status: 500 }
      );
    }
  };

  export const PUT = async (req,{ params }) => {
    try {
      const { id } = params;
      const { name, description, priority } = await req.json();
  console.log(name,description,priority)
      await connectMongoDB();
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { name, description, priority },
        { new: true } // Ensure you get the updated task after the update
      );
  
      if (!updatedTask) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
      console.error('Error updating task:', error);
      return NextResponse.json(
        { message: 'Something went wrong during updating task' },
        { status: 500 }
      );
    }
  };

export const DELETE = async (req,{params}) => {
    try {
        console.log(params)
        const { id } = params;
      await connectMongoDB();
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return NextResponse.json({ message: 'Task not found' },{status:401});
      }

      return NextResponse.json({ res }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "something went wrong" },
        { status: 500 }
      );
    }
  };