// pages/api/tasks.js
import {connectMongoDB} from '@/utils/dbConnect'
import Task from '@/model/Task';
import { NextResponse } from 'next/server';


export const GET = async () => {
    try {
      await connectMongoDB();
      const tasks = await Task.find();
      return NextResponse.json({ tasks });
    } catch (error) {
      return NextResponse.json(
        { message: "An error occurred while getting the data" },
        { status: 500 }
      );
    }
  };

  export const POST = async (req, res) => {
    try {
        const { name, description, priority } =await req.json();

      await connectMongoDB();
        console.log("route post",name,description,priority)
     const resdata= await Task.create({ name, description, priority });
     console.log("post dta",resdata)
      return NextResponse.json({ resdata }, { status: 201 });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "An error occurred while posting the data." },
        { status: 500 }
      );
    }
  };
