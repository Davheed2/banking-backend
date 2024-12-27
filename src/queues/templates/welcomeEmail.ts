import { baseTemplate } from './index';

export const welcomeEmail = (data: {verificationLink: string }) => {
	return baseTemplate(
		`<p>Hello,</p>
		<h2 style="color: #000; line-height: 1.5; font-weight: 400; font-size: 30px">To continue opening your account, confirm your email address</h2>
		<p style="line-height: 2; font-size: 15px;">Confirm that we've got the right email address for you. This makes sure you'll receive important emails about your account.</p>
		<table style="margin-top: 1.5rem; margin-bottom: 1.5rem;" class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
			<tr>
				<td align="center">
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td align="center" width="100%">
								<table border="0" cellspacing="0" cellpadding="0">
									<tr>
										<td style="width: 100%; max-width: 600px;">
											<a href="${data.verificationLink}" class="button" target="_blank">Confirm email address</a>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		<p>Thanks,</p>
		<p>The Wise team</p>`
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
