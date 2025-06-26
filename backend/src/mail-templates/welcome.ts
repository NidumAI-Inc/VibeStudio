import templete from "./template.js";

export function welcome() {
  return templete({
    headStyle: `
    .cta-button {
      display: block;
      text-align: center;
      margin: 30px 0;
    }
    .cta-button a {
      background-color: #2261e9;
      color: #ffffff;
      padding: 15px 25px;
      text-decoration: none;
      border-radius: 8px;
      font-size: 1.1em;
      font-weight: bold;
    }
    .cta-button a:hover {
      background-color: #e60000;
    }
    .social-links {
      text-align: center;
      margin-top: 30px;
    }
    .social-links a {
      margin: 0 10px;
      text-decoration: none;
    }
    .social-icon {
      width: 40px;
      height: 40px;
    }
    `,
    content: `
    <div class="content">
      <p>Dear User,</p>
      <p>Welcome to the <strong>Native Node Ecosystem</strong>! We are thrilled to have you join our innovative community.</p>
      <p>We invite you to explore our platform, engage with our community, and enjoy the tools and opportunities available within our ecosystem.</p>
      <div class="cta-button">
        <a href="https://nativenode.tech" target="_blank">Get Started</a>
      </div>
      <p>Thank you for choosing <strong>Native Node</strong> to be part of your journey.</p>
    </div>
    `
  })
}
