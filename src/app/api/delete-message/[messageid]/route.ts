import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// see video https://www.youtube.com/watch?v=YjsFhkxdUCg&list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq&index=17

export async function DELETE(request:Request, {params}:{params:{messageid: string}}) {
  const messageId = params.messageid 
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
   
    try {
     const updateResult = await UserModel.updateOne(
        {_id: user._id},
        {$pull: {messages: {_id: messageId}}}
      )
      if(updateResult.modifiedCount == 0 ){
        return Response.json(
          {
            success: false,
            message: "Message Not Found or Already Deleted",
          },
          { status: 404 }
        )
     }

     return Response.json(
      {
        success: true,
        message: "Message Deleted",
      },
      { status: 200 }
    )

    } catch (error) {
      console.log("error in Deleting message route" , error)
      return Response.json(
        {
          success: false,
          message: "Error Deleting Message",
        },
        { status: 500 }
      )
      
    }
}