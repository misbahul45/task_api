import { Context } from 'hono'
import { loginSchema } from '@/validation/auth.val.js'
import { loginService } from '@/services/auth.service.js'
import { successResponse, errorResponse } from '@/utils/response.js'

export const login = async (c: Context): Promise<Response> => {
  const body = await c.req.json()
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return c.json(errorResponse('Validation failed', parsed.error.flatten()), 400)
  }

  const { email, password } = parsed.data

  try {
    const token = await loginService(email, password)
    return c.json(successResponse('Login successful', { token }))
  } catch (err: any) {
    const isNotFound = err.message === 'User not found'
    const isInvalidPass = err.message === 'Invalid password'
    return c.json(errorResponse(err.message), isNotFound ? 404 : isInvalidPass ? 401 : 500)
  }
}


export const register = (c: Context) => {
  return c.json({ message: 'Register endpoint is not implemented yet' })
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
