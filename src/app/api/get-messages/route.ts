import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
// see video https://www.youtube.com/watch?v=MKNA_-wzxMk&list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq&index=8

export async function GET(request:Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if (!session || !session.user){
        return Response.json(
            {
              success: false,
              message: "Not Authenticated",
            },
            { status: 401 }
          )
    }
   const userId = new mongoose.Types.ObjectId( user._id);

   try {

    const user = await UserModel.aggregate([
        { $match: {id: userId} },
        { $unwind: '$messages'},
        { $sort: {'messages.createdAt': -1 }},
        {$group: {_id: '$_id', messages: {$push:'$messages'}}}        
    ])
    if(!user || user.length === 0)
        {
            return Response.json(
                {
                  success: false,
                  message: "User Not Found",
                },
                { status: 401 }
              )
        }

        return Response.json(
            {
              success: true,
              messages:user[0].messages
            },
            { status: 200 }
          )
    
   } catch (error) {
    console.error("An unexpected Error occured", error)
        return Response.json(
            {
              success: false,
              message: "An unexpected Error occured",
            },
            { status: 500 }
          )
   }



    
}

