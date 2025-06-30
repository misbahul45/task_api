import { Hono } from "hono"
import { login, register, logout, getProfile, forgotPassword, resetPassword, verifyEmail, resendVerificationEmail } from "@/controllers/auth.controller.js"
import { validate } from "@/utils/zod.js"
import { loginSchema, registerSchema } from "@/validation/auth.val.js"
const auth = new Hono()

auth.post("/login", validate(loginSchema), login)
auth.post("/register", validate(registerSchema), register)
auth.post("/logout", logout)
auth.get("/profile", getProfile)

auth.post("/forgot-password", forgotPassword)
auth.post("/reset-password", resetPassword)
auth.post("/verify-email", verifyEmail)
auth.post("/resend-verification-email", resendVerificationEmail)

export default auth
