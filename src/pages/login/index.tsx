import LoginForm from '@/components/auth/LoginForm'
import AuthLayout from '@/components/layouts/AuthLayout'
import { Form } from '@/components/ui/form'
import { Toaster } from '@/components/ui/sonner'
import { useLogin } from '@/hooks/auth/useLogin'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const loginFormSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Please enter a password")
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
        email: "",
        password: "",
    }
  });
  const router = useRouter()
  const {isLoggingIn, loginUser} = useLogin({
    onSuccess: () => {
        router.push("/home");
    },
    onError: (error) => {
        toast.error(error.message);
        console.log(error.message);
    }
  })

  const handleLogin = async (data: LoginFormValues) => {
    await loginUser({
        email: data.email,
        password: data.password,
    })
  }
  return (
    <div className="h-screen flex justify-center items-center">
        <Toaster richColors position="top-center" />
        <Form {...form} >
            <div className='min-w-[30%]'>
                <AuthLayout title='Login' description='Please enter your details'>
                    <LoginForm form={form} onSubmit={handleLogin} isLoading={isLoggingIn} />
                    <div className="flex mt-6 justify-center">
                        <p className="text-sm text-gray-500">
                            Don{`'`}t have an account?{" "}
                            <Link
                                href={"/signup"}
                                className="text-blue-500 hover:text-blue-700 font-medium"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </AuthLayout>
            </div>
        </Form>
    </div>
  )
}

export default Login;
