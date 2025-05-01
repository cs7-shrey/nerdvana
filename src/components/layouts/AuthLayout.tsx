import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

interface AuthLayoutProps {
    description: string;
    title: string;
    children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ description, title, children }) => {
  return (
    <div>
			<Card className="w-full flex flex-col justify-center">
				<CardHeader className="w-full text-center">
					<CardTitle className="text-xl">{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>
                    {children}
				</CardContent>
			</Card>
    </div>
  )
}

export default AuthLayout;
