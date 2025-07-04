import { Hono } from "hono"
import { login, register, logout, getProfile, forgotPassword, resetPassword, verifyOTP, resendOTP } from "@/controllers/auth.controller.js"
import { validate } from "@/utils/zod.js"
import { forgotPasswordSchema, loginSchema, registerSchema, resendOTPSchema, resetPasswordSchema, verifyOTPSchema } from "@/validation/auth.val.js"
import { authMiddleware } from "@/middleware/auth.middleware.js"
const auth = new Hono()

auth.post("/login", validate(loginSchema), login)
auth.post("/register", validate(registerSchema), register)
auth.post("/logout", logout)
auth.get("/profile", authMiddleware, getProfile)

auth.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword)
auth.patch("/reset-password", validate(resetPasswordSchema), resetPassword)
auth.post("/verify-otp", validate(verifyOTPSchema), verifyOTP)
auth.post("/resend-otp", validate(resendOTPSchema), resendOTP)

export default auth
