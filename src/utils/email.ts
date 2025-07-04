export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const subject = 'Your OTP Code'
  const text = `Your OTP code is: ${otp}`
  console.log(`Sending OTP email to ${to}: ${text}, otp: ${otp}`)
}
