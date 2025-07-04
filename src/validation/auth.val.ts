import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(8, { message: 'Password minimal 8 karakter' }),
})

export const registerSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(8, { message: 'Password minimal 8 karakter' }),
  name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
})

export const resendOTPSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
})

export const verifyOTPSchema = z.object({
  otp: z.string().length(6, { message: 'OTP harus 6 digit' }),
})

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(8, { message: 'Password minimal 8 karakter' }),
  confirmPassword: z.string().min(8, { message: 'Konfirmasi password minimal 8 karakter' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password dan konfirmasi password harus sama',
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ResendOTPInput = z.infer<typeof resendOTPSchema>
