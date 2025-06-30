// middlewares/validate.ts
import { Context, Next } from 'hono'
import { ZodSchema } from 'zod'
import { AppError } from './logging.js'


export const validate =
  (schema: ZodSchema) =>
  async (c: Context, next: Next) => {
    const body = await c.req.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      throw new AppError('Validation failed', 400, result.error.flatten())
    }

    c.set('validatedBody', result.data)
    await next()
  }