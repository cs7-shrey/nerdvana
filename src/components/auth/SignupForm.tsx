import { UseFormReturn } from "react-hook-form"
import { FormField, FormControl, FormLabel, FormMessage, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// duplicate types in two files
// TODO: simplify later
export type SignupFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

interface SignupFormProps {
    form: UseFormReturn<SignupFormData>;
    onSubmit: (data: SignupFormData) => void;
    isLoading: boolean
}

const SignupForm: React.FC<SignupFormProps> = ({form, onSubmit, isLoading}) => {
    return (
            <form
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

            <div className="">
                <Button
                    type="submit"
                    className="w-full text-foreground font-bold"
                    disabled={isLoading}
                >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
            </div>
        </form>
    )
}

export default SignupForm;