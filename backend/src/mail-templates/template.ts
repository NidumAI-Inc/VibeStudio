
type props = {
  headStyle?: string
  content: string
}
function templete({ headStyle, content }: props) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Native Node</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #2261e9;
        background-color: #000;
        padding: 15px 0;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }
      .header img {
        max-width: 140px;
        background-color: #000;
      }
      .header h2 {
        color: #ffffff;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .footer {
        margin-top: 40px;
        text-align: center;
        color: #888;
        font-size: 0.9em;
      }
      .footer p {
        margin: 8px 0;
      }
      .content {
        margin-top: 25px;
        line-height: 1.7;
        color: #333333;
      }
      ${headStyle}
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header" style="text-align: center; border-bottom: 2px solid #2261e9; background-color: #000000 !important; background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); background-repeat: no-repeat; background-size: cover; padding: 15px 0; border-top-left-radius: 12px; border-top-right-radius: 12px; color-scheme: light only;">
        <img src="https://nativenode.link.nativenode.host:5633/static/icon.png" alt="Native Node Logo">
        <h2>Native Node</h2>
      </div>

     ${content}
      
     <div class="footer">
        <p>&copy; 2024 nativenode.tech. All Rights Reserved.</p>
        <p>For any questions, please visit <a href="https://nativenode.tech" style="color: #2261e9;">nativenode.tech</a> or contact us
          at <a href="mailto:info@nativenode.tech" style="color: #2261e9;">info@nativenode.tech</a>.</p>
        <p><em>Please do not reply to this email.</em></p>
      </div>
    </div>
  </body>
  </html>
  `
}

export default templete