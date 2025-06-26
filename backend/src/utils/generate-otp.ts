
function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000)
  console.log(otp)
  return otp
}

export default generateOtp
