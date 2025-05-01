import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface LoginFormData {
    email: string;
    password: string;
}
interface LoginFormProps {
    form: UseFormReturn<LoginFormData>;
    onSubmit: (data: LoginFormData) => Promise<void>;
    isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({form , onSubmit, isLoading}) => {  
  return (
    <div>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
        >
            <FormField 
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-sm">Email</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="john.doe@gmail.com" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {/* TODO: USE THE FORMFIELDLAYOUT */}
            <FormField 
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-sm">Password</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Password" type="password"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div>
                <Button
                    type="submit"
                    className="w-full text-foreground font-bold"    
                    disabled={isLoading}
                >
                    {isLoading ? "Logging In..." : "Login"}
                </Button>
            </div>
        </form> 
    </div>
  )
}

export default LoginForm;
