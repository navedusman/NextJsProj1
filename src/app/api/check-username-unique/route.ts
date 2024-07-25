import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernameValidation} from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect()
    try {
    const {searchParams}= new URL(request.url)
    const queryParam ={
        username: searchParams.get('username')
    }
     // validate with zod video link https://www.youtube.com/watch?v=VQTFxPxr9HY 14:28 minute
     const result = UsernameQuerySchema.safeParse(queryParam) 
    console.log(result) // todo remove
    if (!result.success){
        const userNameErrors = result.error.format().username?._errors || []
        return Response.json(
            {
              success: false,
              message: userNameErrors || 'Invalid Query parameters' ,
            },
            { status: 400 }
          );
    }
    const {username} = result.data
    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
    if (existingVerifiedUser){
        return Response.json(
            {
              success: false,
              message: 'Username is already Taken',
            },
            { status: 400 }
          );
    }
    return Response.json(
        {
          success: true,
          message: 'Username is unique',
        },
        { status: 200 }
      );
   
    } catch (error) {
        console.error("Error Checking Username", error)
        return Response.json(
            {
              success: false,
              message: 'Error Checking Username',
            },
            { status: 500 }
          );
        
    }
    
}



