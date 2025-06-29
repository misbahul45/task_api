export type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T | null
  error?: any
}

export function successResponse<T>(message: string, data?: T): ApiResponse<T> {
  return { success: true, message, data: data ?? null }
}

export function errorResponse(message: string, error?: any): ApiResponse<null> {
  return { success: false, message, data: null, error }
}
