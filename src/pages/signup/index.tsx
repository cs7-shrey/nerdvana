import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const SignUp = () => {

  return (
    <div className="h-screen flex justify-center items-center">
       <Card className="min-w-1/3 flex flex-col justify-center">
            <CardHeader className="w-full text-center">
                <CardTitle className="text-xl">
                    Sign Up
                </CardTitle>    
            </CardHeader> 
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm">
                            Name
                        </p>
                        <Input />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm">
                            Email ID
                        </p>
                        <Input />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm">
                            Password
                        </p>
                        <Input />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm">
                            Confirm Password
                        </p>
                        <Input />
                    </div>
                    <div className="mt-4">
                        <Button className="w-full text-foreground font-bold">
                            Sign Up
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card> 
    </div>
  )
}

export default SignUp
