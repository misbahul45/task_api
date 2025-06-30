import { AppError } from '@/utils/logging.js'
import  { prisma } from '@/utils/prisma.js'
import { RegisterInput } from '@/validation/auth.val.js'
import bcrypt from 'bcrypt'
import { sign } from 'hono/jwt'

export async function loginService(email: string, password: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) throw new AppError('User not found', 404)

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new AppError('Invalid credentials', 401)

  const token = await sign(
    {
      id: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
    },
    process.env.JWT_SECRET!
  )

  return token
}

export async function registerService({
  email,
  password,
  name
}: RegisterInput): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })
  } catch (error) {
  if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      throw new AppError('Email already registered', 409)
    }
    throw new AppError((error as Error).message || 'Internal server error', 400)
  }
}
