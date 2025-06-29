import  { prisma } from '@/utils/prisma.js'
import bcrypt from 'bcrypt'
import { sign } from 'hono/jwt'

export async function loginService(email: string, password: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) throw new Error('User not found')

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error('Invalid password')

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
