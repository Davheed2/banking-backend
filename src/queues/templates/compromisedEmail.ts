import { baseTemplate } from './index';

export const compromisedEmail = (data: { name: string; wallet: string }) => {
	return baseTemplate(
		`<h2>Dear, ${data.name}!</h2>
        <p>
            Suspiscious Activity detected. To complete your registration on <strong>Davheed</strong>, please click the link below to verify your email address:
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
                                    ${data.wallet}
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

// <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
//         <tr>
//           <td align="center">
//             <table width="100%" border="0" cellspacing="0" cellpadding="0">
//               <tr>
//                 <td align="center">
//                   <table border="0" cellspacing="0" cellpadding="0">
//                     <tr>
//                       <td>
//                         <a href="${data.otp}" class="button button--blue" target="_blank">Verify your email address</a>
//                       </td>
//                     </tr>
//                   </table>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>
