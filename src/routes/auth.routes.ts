import { Hono } from "hono"

const auth = new Hono()

auth.post("/login", () => {})
auth.post("/register", () => {})
auth.post("/logout", () => {})
auth.get("/profile", () => {})

auth.post("/forgot-password", () => {})
auth.post("/reset-password", () => {})
auth.post("/verify-email", () => {})
auth.post("/resend-verification-email", () => {})

export default auth
