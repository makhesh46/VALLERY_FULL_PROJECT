export const sendNotification = async (requestData: any, adminEmail: string) => {
  const message = `
    New Product Request:
    Customer Name: ${requestData.customerName}
    Product: ${requestData.productName}
    Phone Number: ${requestData.phoneNumber}
    Address: ${requestData.address}
    Email: ${requestData.email}
    Message: ${requestData.message || 'N/A'}
  `;

  // Send Email using Web3Forms API (Bypasses Render's SMTP block)
  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey) {
      console.error('WEB3FORMS_ACCESS_KEY is missing in environment variables!');
      return;
    }

    console.log(`Attempting to send email via Web3Forms to: ${adminEmail}`);

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: 'New Product Request from your website',
        from_name: 'Vallery Notifications',
        to: adminEmail,
        message: message,
      })
    });

    const result = await response.json();
    
    if (response.status === 200) {
      console.log(`Email sent successfully via Web3Forms!`);
    } else {
      console.error('Web3Forms email sending failed:', result);
    }
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
