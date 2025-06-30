import { Context } from 'hono'
import { loginSchema, registerSchema } from '@/validation/auth.val.js'
import { loginService, registerService } from '@/services/auth.service.js'
import { successResponse } from '@/utils/response.js'
import { log } from '@/utils/logging.js'


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
  return c.json(successResponse('Registration successful'))
}


export const logout = (c: Context) => {
  return c.json({ message: 'Logout endpoint is not implemented yet' })
}

export const getProfile = (c: Context) => {
  return c.json({ message: 'Get Profile endpoint is not implemented yet' })
}

export const forgotPassword = (c: Context) => {
  return c.json({ message: 'Forgot Password endpoint is not implemented yet' })
}

export const resetPassword = (c: Context) => {
  return c.json({ message: 'Reset Password endpoint is not implemented yet' })
}

export const verifyEmail = (c: Context) => {
  return c.json({ message: 'Verify Email endpoint is not implemented yet' })
}

export const resendVerificationEmail = (c: Context) => {
  return c.json({ message: 'Resend Verification Email endpoint is not implemented yet' })
}
