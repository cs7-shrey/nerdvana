import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	InputOTPSeparator,
} from "@/components/ui/input-otp";
import { toast, Toaster } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { sendOtpForSignup, verifyOtpForSignup } from "@/api/endpoints/users";
import { AxiosError, isAxiosError } from "axios";

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

interface ErrorResponse {
	detail: string
}

const SignUp = () => {
	const router = useRouter();

	const [otpSent, setOtpSent] = useState(false);
	const [sendingOtp, setSendingOtp] = useState(false);
	const [verifying, setVerifying] = useState(false);
	const [otp, setOtp] = useState("");
	const [cardDescription, setCardDescription] = useState(!otpSent ? "Create an account to get started" : "Please enter the OTP")
	const [userData, setUserData] = useState<SignupFormValues>();

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

	// Sends OTP to the user's email
	// TODO : clean up this clutter
	const onSubmit = async (data: SignupFormValues) => {
		const { name, email, password} = data
		try {
			setSendingOtp(true);
			await sendOtpForSignup(name, email, password)	
			toast.success("OTP sent successfully");
			
			setOtpSent(true);
			setCardDescription('Please enter the OTP')
			setUserData(data)
		} catch (error) {
			if (isAxiosError(error)) {
				const e = error as AxiosError
				toast.error(`An error occured while sending OTP. ${(e.response?.data as ErrorResponse)?.detail}`)
			}
			else {
				toast.error('An error occured while sending OTP.')
			}
			console.error(error)
		}
		finally {
			setSendingOtp(false)
		}
	};

	const verifyOTP = async (otp: string) => {
		try {
			setVerifying(true);
			const email= userData?.email;
			const response = await verifyOtpForSignup(otp, email as string);
			if (response.status === 200) {
				toast.success('OTP verified successfully')
				router.push('/home')
			}
		}
		catch(error) {
			toast.error('Could not verify OTP');
			console.error(error)
		}
		finally {
			setVerifying(false)
		}
	};

	return (
		<div className="h-screen flex justify-center items-center">
			<Toaster richColors position="top-center" />
			<Card className="min-w-[30%] flex flex-col justify-center">
				<CardHeader className="w-full text-center">
					<CardTitle className="text-xl">Sign Up</CardTitle>
					<CardDescription>{cardDescription}</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						{!otpSent && <form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-4"
						>
							{/* Name */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel className="text-sm">Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="John Doe" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel className="text-sm">Email ID</FormLabel>
										<FormControl>
											<Input {...field} placeholder="john.doe@example.com" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel className="text-sm">Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												{...field}
												placeholder="********"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Confirm Password */}
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel className="text-sm">Confirm Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												{...field}
												placeholder="********"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* OTP */}

							<div className="">
								<Button
									type="submit"
									className="w-full text-foreground font-bold"
									disabled={sendingOtp}
								>
									{otpSent ? "Sign Up" : "Send OTP"}
								</Button>
							</div>
						</form>}
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
									<div className="flex flex-col justify-center mx-auto">
										<InputOTP maxLength={6} value={otp} onChange={setOtp}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
										<Button
											type="button"
											onClick={() => 
												onSubmit(form.getValues())
											}
											disabled={sendingOtp || verifying}
											className="pl-1 bg-transparent hover:bg-transparent text-green-300 mr-auto hover:cursor-pointer hover:underline"
										>
											Resend OTP
										</Button>
										<Button 
											className="text-foreground font-bold"
											onClick={() => {
												verifyOTP(otp)
											}}
											disabled={sendingOtp || verifying}
										>
											Verify
										</Button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</Form>
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-gray-500">
						Already have an account?{" "}
						<a
							href="#"
							className="text-blue-500 hover:text-blue-700 font-medium"
						>
							Sign in
						</a>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default SignUp;
