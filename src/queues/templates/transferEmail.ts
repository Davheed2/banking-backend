import { baseTemplate } from './index';

export const transferEmail = (data: {
	name: string;
	otp: string;
	currency: string;
	amount: number;
	accountNumber: string;
}) => {
	// Assuming data.otp is the OTP string you want to send
	const formattedOtp = data.otp.split('').join('&nbsp;&nbsp;'); // Two non-breaking spaces between digits

	return baseTemplate(
		`<h2>Confirm your transfer</h2>
        <p>
            You requested a transfer of ${data.currency}${data.amount} to ${data.accountNumber}. Please enter the 6 digit code below to confirm your transfer.
        </p>

        <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                 <tr>
                    <td align="center">
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>
                                <span style="font-size: 24px; font-weight: bold;">
                                    ${formattedOtp}
                                </span>
                            </td>
                        </tr>
                    </table>
                    </td>
                 </tr>
                </table>
              </td>
            </tr>
        </table>
        
        <p>
            If you did not authorize this transfer, kindly contact our <a href="mailto:support@wise.com">customer care support team<a>.
        </p>
        <p>Thanks,<br />The Davheed Support Team</p>`
	);
};
