import templete from "./template.js"

type params = {
  otp: number
}

export function registerOtp({ otp }: params) {
  return templete({
    headStyle: `
    .otp-code {
      display: block;
      text-align: center;
      font-size: 2.2em;
      font-weight: bold;
      color: #2261e9;
      background-color: #f9f9f9;
      border-radius: 10px;
      padding: 18px;
      margin: 25px 0;
      letter-spacing: 4px;
    }
    `,
    content: `
    <div class="content">
      <p>Dear User,</p>
      <p>Use the following One-Time Password (OTP) to verify your account. This code is valid for <strong>10 minutes</strong> only. Do not share it with anyone.</p>
      <span class="otp-code">${otp}</span>
      <p>If you did not request this, please ignore this email or contact our support team if you have any concerns.</p>
      <p>Thank you for choosing <strong>Native Node</strong>.</p>
    </div>
    `
  })
}
