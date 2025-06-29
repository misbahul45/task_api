import { Hono } from "hono"
import { login, register, logout, getProfile, forgotPassword, resetPassword, verifyEmail, resendVerificationEmail } from "@/controllers/auth.controller.js"
const auth = new Hono()

auth.post("/login", login)
auth.post("/register", register)
auth.post("/logout", logout)
auth.get("/profile", getProfile)

auth.post("/forgot-password", forgotPassword)
auth.post("/reset-password", resetPassword)
auth.post("/verify-email", verifyEmail)
auth.post("/resend-verification-email", resendVerificationEmail)

export default auth
