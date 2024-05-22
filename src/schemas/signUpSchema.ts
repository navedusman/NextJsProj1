import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2,"User Name must be of 2 Charachters ")
    .max(20,"User Name must be no more than 20 Charachters ")
    .regex(/^[a-zA-Z0-9_]+$/,"User Name must not contain special Charachters")

    
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:'Invalid email address'}),
    password: z.string().min(6,{message:'Password must be minimum 6 Charachters'}),

})    