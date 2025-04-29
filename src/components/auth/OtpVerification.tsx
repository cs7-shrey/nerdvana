import React, { useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'

interface OtpVerificationProps {
    onVerify: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
    verifyingLabel?: string;
    resendingLabel?: string;
}
const OtpVerification: React.FC<OtpVerificationProps> = ({
    onVerify, onResend, verifyingLabel, resendingLabel
}) => {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false);
  const [ isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
        await onVerify(otp);
    }
    finally {
        setIsVerifying(false);
    }
  }
  
  const handleResend = async () => {
    setIsResending(true);
    try {
        await onResend();
    }
    finally {
        setIsResending(false);
    }
  }
  return (
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
                onClick={handleResend}
                disabled={isResending || isVerifying}
                className="pl-1 bg-transparent hover:bg-transparent text-green-300 mr-auto hover:cursor-pointer hover:underline"
            >
                Resend OTP
            </Button>
            <Button 
                className="text-foreground font-bold"
                onClick={handleVerify}
                disabled={isResending || isVerifying}
            >
                {isResending ? resendingLabel : (
                    isVerifying ? verifyingLabel : "Verify"
                )}
            </Button>
        </div>
  )
}

export default OtpVerification
