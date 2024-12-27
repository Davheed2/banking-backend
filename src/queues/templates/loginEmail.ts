import { baseTemplate } from './index';

export const loginEmail = (data: { name: string; time: string }) => {
	return baseTemplate(
		`<h2>Welcome, ${data.name}!</h2>
        <p>
            There was a successful login to your Wise account. Please see login details below:
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
                                <span style="font-size: 18px; font-weight: bold;">
                                    ${data.time}
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
            If you did not login to your Wise account, kindly contact our <a href="mailto:support@wise.com">customer care support team<a>.
        </p>
        <p>Thanks,<br />The Davheed Support Team</p>`
	);
};
