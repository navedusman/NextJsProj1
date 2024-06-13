import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
// see video https://www.youtube.com/watch?v=MKNA_-wzxMk&list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq&index=8

export async function POST(request:Request) {
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
   const userId = user._id;
   const {acceptMessages} = await request.json()

   try {

    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessage: acceptMessages},
        {new: true},
    )
    if(!updatedUser){
        return Response.json(
            {
              success: false,
              message: "Failed to update user status to accept messages",
            },
            { status: 401 }
          )
     }

     return Response.json(
        {
          success: true,
          message: "Message acceptance status updated successfully",
          updatedUser
        },
        { status: 200 }
      )
    
   } catch (error) {
    console.error("Failed to update user status to accept messages", error)
        return Response.json(
            {
              success: false,
              message: "Failed to update user status to accept messages",
            },
            { status: 500 }
          )
    
   }

}

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
   const userId = user._id;
   
   try {
            const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json(
                {
                success: false,
                message: "User no found",
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
            success: true,
            message: "User found",
            isAcceptingMessages: foundUser.isAcceptingMessage
            },
            { status: 200 }
        )
   } catch (error) {
    console.error("Error in getting message Acceptance status", error)
        return Response.json(
            {
              success: false,
              message: "Error in getting message Acceptance status ",
            },
            { status: 500 }
          )
   }
    
}