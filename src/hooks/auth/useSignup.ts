import { useState } from "react";
import { verifyOtpForSignup } from "@/api/endpoints/users";
import { sendOtpForSignup } from "@/api/endpoints/users";
import { isAxiosError } from "axios";

/**
 * Interface for signup hook options
*/
interface UseSignupOptions {
    onOtpSent?: () => void;
    onVerificationSuccess?: () => void;
    onError?: (error: SignupError) => void;
}

interface SignupError {
    message: string;
    code?: string;
  }
  
/**
 * Interface for OTP sending parameters
*/
  interface SendOtpParams {
    name: string;
    email: string;
    password: string;
  }
  
/**
 * Interface for OTP verification parameters
 */
  interface VerifyOtpParams {
    otp: string;
    email: string;
  }

export const useSignup = (options: UseSignupOptions = {}) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: unknown) => {

        console.error(err);
        let errorMessage = "An unexpected error occured";

        if (isAxiosError(err)) {
            errorMessage = err.response?.data.detail || err.message;
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }

        setError(errorMessage);
        options.onError?.({message: errorMessage})

        return errorMessage
    }

    const sendOtp = async (params: SendOtpParams): Promise<boolean> => {
        try {
            setIsSending(true);
            await sendOtpForSignup(
                params.name,
                params.email,
                params.password
            );
            options.onOtpSent?.();
            return true
        } catch (err) {
            handleError(err);
            return false
        } finally {
            setIsSending(false);
        }
    }
    const verifyOtp = async (params: VerifyOtpParams): Promise<boolean> => {
        // call the axios function
        try {
            setIsVerifying(true);
            await verifyOtpForSignup(
                params.otp, 
                params.email
            );
            options.onVerificationSuccess?.();
            return true;
        } catch (err) {
            handleError(err);
            return false;
        }
        // the finally block always executes no matter the return statement
        finally {
            setIsVerifying(false);
        }
    }
    return {
        sendOtp,
        verifyOtp,
        isSending,
        isVerifying,
        error
    } as const
}