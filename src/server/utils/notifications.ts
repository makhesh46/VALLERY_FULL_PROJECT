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
        'Accept': 'application/json',
        // This line tricks Cloudflare into thinking Render is a real Google Chrome browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        access_key: accessKey.trim(), // .trim() removes any accidental spaces
        subject: 'New Product Request from your website',
        from_name: 'Vallery Notifications',
        email: requestData.email || 'no-reply@vallery.com',
        message: message,
      })
    });

    // Read as text first so it doesn't crash if Cloudflare blocks it again
    const textResponse = await response.text();
    
    try {
      const result = JSON.parse(textResponse);
      if (response.status === 200) {
        console.log(`Email sent successfully via Web3Forms!`);
      } else {
        console.error('Web3Forms email sending failed:', result);
      }
    } catch (parseError) {
      console.error(`Web3Forms returned an HTML error page (Status: ${response.status}).`);
      console.error('HTML Response preview:', textResponse.substring(0, 150));
    }
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
