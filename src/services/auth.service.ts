import { sendOtpEmail } from '@/utils/email.js'
import { AppError } from '@/utils/logging.js'
import  { prisma } from '@/utils/prisma.js'
import { RegisterInput } from '@/validation/auth.val.js'
import { OTPPurpose } from '@prisma/client'
import bcrypt from 'bcrypt'
import { sign } from 'hono/jwt'

export async function loginService(email: string, password: string): Promise<string> {
  const user = await prisma.user.findUnique({ 
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      emailVerified: true
    }
  })

  if (!user) throw new AppError('User not found', 404)
  if (!user.emailVerified) throw new AppError('Email not verified', 403)

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new AppError('Invalid credentials', 401)

  const token = await sign(
    {
      id: user.id,
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
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
      }
    })

    const otp= Math.floor(100000 + Math.random() * 900000).toString()

    await prisma.oTPVerification.create({
      data: {
        otp,
        purpose:OTPPurpose.VERIFYEMAIL,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hours
      }
    })

    //send otp
    await sendOtpEmail(email, otp)
  } catch (error) {
  if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      throw new AppError('Email already registered', 409)
    }
    throw new AppError((error as Error).message || 'Internal server error', 400)
  }
}

export async function forgotPasswordService(email: string): Promise<void> {
  try {
    const user=await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        emailVerified: true
      }
    })
    if (!user) {
      throw new AppError('User not found', 404)
    }
    if (!user.emailVerified) {
      throw new AppError('Email not verified', 403)
    }
    //creating otp verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await prisma.oTPVerification.create({
      data:{
        otp,
        purpose:OTPPurpose.RESETPASS,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hours
      }
    })

    //send otp
    await sendOtpEmail(email, otp)
  } catch (error) {
      if (error instanceof AppError) {
        throw new AppError(error.message || 'Internal server error', error.status || 500)
      }
  }
}


export async function getProfileService(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        image_url: true
      }
    })
    if (!user) {
      throw new AppError('User not found', 404)
    }


    if (!user.emailVerified) {
      throw new AppError('Email not verified', 403)
    }

    return user
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError(error.message || 'Internal server error', error.status || 500)
    }
  }
}


export async function verifyOTPService(otp: string): Promise<void> {
  try {
    const date = new Date()
    const otpVerification = await prisma.oTPVerification.findUnique({
      where: {
        otp,
        expiresAt: {
          gt: date
        }
      },
      include:{
        user:{
          select:{
            emailVerified:true
          }
        }
      }
    })

    if (!otpVerification) {
      throw new AppError('Invalid OTP or OTP expired', 400)
    }



    await prisma.oTPVerification.update({
      where: { otp },
      data:{
        usedAt:new Date()
      }
    })

    if(!otpVerification.user.emailVerified && otpVerification.purpose ==='VERIFYEMAIL'){
      await prisma.user.update({
        where: { id: otpVerification.userId },
        data: { emailVerified: new Date() }
      })
    }
    await prisma.oTPVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(), 
        },
      },
    });
  } catch (error) {
    throw new AppError((error as Error).message || 'Internal server error', 400)
  }
}

export async function resetPasswordService(email: string, password: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.emailVerified) {
      throw new AppError('Email not verified', 403);
    }

    const otpVerification = await prisma.oTPVerification.findFirst({
      where: {
        userId: user.id,
        purpose: OTPPurpose.RESETPASS,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    if (
      !otpVerification?.usedAt ||
      otpVerification.usedAt < oneHourAgo ||
      otpVerification.expiresAt < new Date()
    ) {
      throw new AppError('Please verify your OTP within the last hour.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.oTPVerification.deleteMany({
      where: {
        userId: user.id,
        purpose: OTPPurpose.RESETPASS
      }
    });

  } catch (error) {
    throw new AppError((error as Error).message || 'Internal server error', 400);
  }
}
