import { Context } from 'hono'
import { loginSchema, registerSchema } from '@/validation/auth.val.js'
import { getProfileService, loginService, registerService, resetPasswordService, verifyOTPService } from '@/services/auth.service.js'
import { successResponse } from '@/utils/response.js'
import { log } from '@/utils/logging.js'
import { prisma } from '@/utils/prisma.js'


export const login = async (c: Context): Promise<Response> => {
  const { email, password } = c.get('validatedBody')
  const token = await loginService(email, password)
  log('User logged in', { email })
  return c.json(successResponse('Login successful', { token }))
}

export const register = async (c: Context): Promise<Response> => {
  const { email, password, name } = c.get('validatedBody')
  await registerService({ email, password, name })
  log('User registered', { email })
  return c.json(successResponse('Registration successful, please check your email for OTP verification'))
}


export const logout = async (c: Context): Promise<Response> => {
  log('User logged out')
  return c.json(successResponse('Logout successful'))
}

export const getProfile = async(c: Context): Promise<Response> => {
  const payload = c.get('jwtPayload');
  const userId = payload?.id!;
  const user = await getProfileService(userId);
  console.log('User profile:', user);
  return c.json(successResponse('Profile fetched successfully',{ ...user }))
}

export const forgotPassword = (c: Context) => {
  return c.json({ message: 'Forgot Password endpoint is not implemented yet' })
}

export const resetPassword = async (c: Context): Promise<Response> => {
  const { email, password } = c.get('validatedBody')
   await resetPasswordService(email, password)
  log('Password reset requested', { email })
  return c.json(successResponse('Password reset successful'))
}

export const verifyOTP = async (c: Context) => {
  const date= new Date()
  const { otp } = c.get('validatedBody')
  await verifyOTPService(otp)
  return c.json(successResponse('OTP verified successfully'))
}

export const resendOTP = (c: Context) => {
  return c.json({ message: 'Resend OTP endpoint is not implemented yet' })
}
