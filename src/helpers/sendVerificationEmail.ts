import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Next Project Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
          });
        return {success: true, message:'Verification Email send Succesfully'}
        
    } catch (emailError) {
        console.log("Error Sending email Verification",emailError)
        return {success: false, message:'Failed to send verification Email'}
        
    }
}
