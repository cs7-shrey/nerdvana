import apiClient from "@/api/axios";

const USER_PATH = '/user'

export async function sendOtpForSignup(name: string, emailId: string, password: string) {
    return apiClient.post(`${USER_PATH}/signup_via_otp`, {
       name,
       email_id: emailId,
       password 
    })
}

export async function verifyOtpForSignup(otp: string, emailId: string) {
    return apiClient.post(`${USER_PATH}/verify_otp`, {
        otp, 
        email_id: emailId,
    })
}