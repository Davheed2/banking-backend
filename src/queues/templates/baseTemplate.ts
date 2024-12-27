export const baseTemplate = (template: string): string => {
	return `<!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Wise</title>
    <style type="text/css" rel="stylesheet" media="all">
      /* Base Styles */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        font-family: 'Inter', Helvetica, Arial, sans-serif;
        background-color: #F2F4F6;
        color: #51545E;
      }
      a {
        color: #9FE870;
      }
      /* Email Container */
      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: #F2F4F6;
      }
      .email-content {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      /* Masthead */
      .email-masthead {
        padding: 25px 0 10px 0;
        text-align: center;
        background-color: #fff;
      }
      /* Email Body */
      .email-body {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .email-body_inner {
        width: 570px;
        margin: 0 auto;
        padding: 0;
        background-color: #fff;
        
      }
      .content-cell {
        padding: 45px 40px;
      }
      .content-cell-footer {
        padding: 30px 40px;
      }
      /* Footer */
      .email-footer {
        width: 570px;
        margin: 0 auto;
        padding: 0;
        text-align: center;
        background-color: #163300;
      }
      .email-footer p {
        color: #fff;
      }
      /* Buttons */
      .button {
        background-color: #9FE870;
        border-radius: 20px;
        color: #163300;
        display: block;
        text-decoration: none;
        padding: 1.5rem 6rem;
        width: 100%;
        box-sizing: border-box;
        text-align: center;
        margin: 0 auto;
        max-width: 600px;
      }
      .button--green {
        background-color: #22BC66;
      }
      .button--red {
        background-color: #FF6136;
      }
      /* Media Queries */
      @media only screen and (max-width: 600px) {
        .email-body_inner,
        .email-footer {
          width: 100% !important;
        }
        .button {
          padding: 1rem 5rem;
          white-space: normal;
          word-wrap: break-word;
        }
      }
    </style>
  </head>


  <body>
    <table class="email-wrapper" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="email-masthead">
                <img src="https://res.cloudinary.com/dnhu3eqn5/image/upload/v1731809529/Vector_e2bgl1.png" alt="Wise logo" width="100" height="auto" style="display: block; margin: 0 auto;">
              </td>            
            </tr>



            <!-- Email Body -->
            <tr>
              <td class="email-body" cellpadding="0" cellspacing="0">
                <table class="email-body_inner" align="center" cellpadding="0" cellspacing="0" role="presentation">
                  <!-- Body content -->
                  <tr>
                    <td class="content-cell">
                      ${template}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>





            <!-- Footer -->
            <tr>
              <td>
                <table class="email-footer" align="center" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
        <td class="content-cell-footer">
          <p style="color: #F2F4F6; line-height: 1.5; font-size: 14px; margin: 0; font-weight: 500;">
  Want to change what we get in touch about? Go to your 
  <a href="https://vigoplace.com" style="color: #9FE870; text-decoration: underline; font-size: 12px;">Notification Settings</a>. 
  We can't receive replies to this email address. But if you'd like some support, please visit our 
</p>
<p style="text-align: center; margin: 0 auto 10px auto; font-size: 12px; font-weight: 500;">
  <a href="https://helpcenter.com" style="color: #9FE870; text-decoration: underline; display: inline-block;">Help Center</a>
</p>

<p style="color: #F2F4F6; line-height: 1.5; font-size: 11px; margin: 0; font-weight: 500;">
  This email was sent to you by Wise. By using our services, you agree to our
</p>
<p style="text-align: center; margin: 5px auto; font-size: 11px; font-weight: 500;">
  <a href="https://helpcenter.com" style="color: #9FE870; text-decoration: underline; display: inline-block;">customer agreements</a>
</p>


          <p style="color: #F2F4F6; font-size: 11px; font-weight:500; margin: 0;">
  &copy; Wise ${new Date().getFullYear()}. All rights reserved.
</p>

        </td>
      </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
};
