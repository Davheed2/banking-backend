import { baseTemplate } from './index';

export const creditEmail = (data: {
	name: string;
	date: string;
	amount: number;
	description: string;
	currency: string;
	accountNumber: string;
	transactionReference: string;
	transactionType: string;
	balance: number;
}) => {
	return baseTemplate(
		`<h2>Welcome, ${data.name}!</h2>
        <p>
            We’re thrilled to have you on board. To complete your registration on <strong>Davheed</strong>, please click the link below to verify your email address:
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
                                    ${data.date}
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
            If you have any questions, feel free to <a href="mailto:support@davheed.com">email our customer support team<a>.
        </p>
        <p>Thanks,<br />The Davheed Support Team</p>`
	);
};
