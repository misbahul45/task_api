import { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";


export const authMiddleware: MiddlewareHandler = jwt({
  secret: process.env.JWT_SECRET!,
})