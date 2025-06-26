import templete from "./template.js";

export function accountDelete(otp: number) {
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
      <p>We have received your request to delete your <strong>Native Node</strong> account. To proceed with the account deletion, please use the following One-Time Password (OTP) to confirm your request. This OTP is valid for <strong>10 minutes</strong> only.</p>
      <span class="otp-code">${otp}</span>
      <p>If you did not request to delete your account, please ignore this email or contact our support team immediately.</p>
      <p>Once your account is deleted, all your data will be permanently removed and cannot be recovered.</p>
    </div>
    `
  })
}
