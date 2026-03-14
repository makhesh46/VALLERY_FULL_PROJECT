import nodemailer from 'nodemailer';

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

  // Send Email
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: 'New Product Request',
      text: message,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
