import { baseTemplate } from './index';

export const debitEmail = (data: {
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
		`<h2>Hello ${data.name},</h2>
        <p>
            This is to notify you of a successful ${data.transactionType} transaction on your account with the following details:
        </p>

        <table class="transaction-details" align="center" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px 0;">
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Account Number:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.accountNumber}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.date}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Amount:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.amount.toFixed(2)}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Currency:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.currency}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Description:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.description}</td>
            </tr>
            
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Transaction Reference:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.transactionReference}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Balance:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.balance.toFixed(2)}</td>
            </tr>
        </table>
        
        <p>
            For further enquiries, feel free to <a href="mailto:support@wise.com">email our customer support team</a>.
        </p>
        <br />

        <p>Thank you for choosing Wise.</p>
        <p>The Wise Team</p>`
	);
};
