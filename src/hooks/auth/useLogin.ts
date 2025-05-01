import { userLogin } from "@/api/endpoints/users";
import { isAxiosError } from "axios";
import { useState } from "react"

interface LoginOptions {
    onSuccess?: () => void,
    onError?: (error: LoginError) => void,
}
interface LoginError {
    message: string;
    code?: number
}
interface LoginParams {
    email: string;
    password: string;
}
export const useLogin = (options: LoginOptions) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
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
    const loginUser = async (params: LoginParams) => {
        try {
           setIsLoggingIn(true);
           await userLogin(params.email, params.password);
           options.onSuccess?.()
           return true
        } catch (err) {
            handleError(err)
            return false;
        } finally {
            setIsLoggingIn(false);
        }
    }

    return {
        isLoggingIn,
        loginUser,
        error
    } as const;
}