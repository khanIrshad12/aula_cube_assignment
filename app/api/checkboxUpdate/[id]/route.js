import {connectMongoDB} from '@/utils/dbConnect'
import Task from '@/model/Task';
import { NextResponse } from 'next/server';


export const PUT=async(req,{params})=>{
  try{
    
    await connectMongoDB();
    const {id}=params
    const {completed}  =await req.json();
    console.log(id,completed)
    const TaskComplete = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true } // Return the updated document
    );

    if (!TaskComplete) {
      return NextResponse.json( { message: "An error occurred while update the completed." },
      { status: 500 })
    }
    console.log('upated data',TaskComplete)

    return NextResponse.json({message:'upated'},{status:201});
  }catch(error){
    console.error('Error updating Checkbox complete:', error);
    return NextResponse.json( {message: "internal error 500" })
  }
}