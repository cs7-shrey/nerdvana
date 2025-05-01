import { useRouter } from "next/router";

import { toast, Toaster } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
} from "@/components/ui/form";

import SignupForm from "@/components/auth/SignupForm";
import OtpVerification from "@/components/auth/OtpVerification";
import { useSignup } from "@/hooks/auth/useSignup";
import AuthLayout from "@/components/layouts/AuthLayout";
import Link from "next/link";

// Define the form schema with Zod
const signupFormSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		email: z.string().email("Please enter a valid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type SignupFormValues = z.infer<typeof signupFormSchema>;

const SignUp = () => {
	const router = useRouter();

	const [otpSent, setOtpSent] = useState(false);

	// Initialize React Hook Form
	const form = useForm<SignupFormValues>({
		resolver: zodResolver(signupFormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const {
		sendOtp,
		verifyOtp,
		isSending: isSendingOtp,
	} = useSignup({
		onOtpSent: () => {
			toast.success("OTP sent successfully");
			setOtpSent(true)
		},
		onVerificationSuccess: () => {
			toast.success('OTP verified successfully')
			router.push('/home')
		},
		onError: (err) => {
			toast.error(err.message);
		}
	})

	// Sends OTP to the user's email
	const onSubmit = async (data: SignupFormValues) => {
		const { name, email, password} = data
		await sendOtp({
			name,
			email,
			password
		})
	};

	const handleVerify = async (otp: string) => {
		const email = form.getValues("email");
		if (!email) return;

		await verifyOtp({
			otp, email
		})
	};

	return (
		<div className="h-screen flex justify-center items-center">
			<Toaster richColors position="top-center" />
			<div className="min-w-[30%]">
				<AuthLayout 
					title="Sign Up" 
					description={!otpSent ? "Create an account to get started" : "Please enter the OTP"}
				>
					<Form {...form}>
						{!otpSent && <SignupForm form={form} onSubmit={onSubmit} isLoading={isSendingOtp} />}
						<AnimatePresence>
							{otpSent && (
								<motion.div
									className="flex flex-col gap-1"
									initial={{ opacity: 0, y: 20, height: 0 }}
									animate={{ opacity: 1, y: 0, height: "auto" }}
									exit={{ opacity: 0, y: -20, height: 0 }}
									transition={{
										duration: 0.3,
										ease: "easeOut",
									}}
									>
										<OtpVerification 
											onResend={async () => {
												onSubmit(form.getValues())
											}} 
											onVerify={handleVerify}
										/>
								</motion.div>
							)}
						</AnimatePresence>
						<div className="flex mt-6 justify-center">
							<p className="text-sm text-gray-500">
								Already have an account?{" "}
								<Link
								 	href={"/login"}
									className="text-blue-500 hover:text-blue-700 font-medium"
								>
									Sign in
								</Link>
							</p>
						</div>
					</Form>
				</AuthLayout>
			</div>	
		</div>
	);
};

export default SignUp;
