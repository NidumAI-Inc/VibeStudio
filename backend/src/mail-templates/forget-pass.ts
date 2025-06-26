import templete from "./template.js";

export function forgetPassTemp(otp: number) {
  return templete({
    headStyle: `
    .otp-code {
      display: block;
      text-align: center;
      font-size: 2em;
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
      <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your password. This code is valid for <strong>10 minutes</strong>.</p>
      <span class="otp-code">${otp}</span>
      <p>If you did not request a password reset, please ignore this email or contact our support team immediately at <a href="mailto:info@nidum.ai" style="color: #2261e9;">info@nidum.ai</a>.</p>
      <p>Thank you for using <strong>Native Node</strong>.</p>
    </div>
    `
  })
}
