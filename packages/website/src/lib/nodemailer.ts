import nodemailer from 'nodemailer';
import { email } from './email';

export const mailer = async (data: ContactMailer) => {
  const Transporter = nodemailer.createTransport({
    service: data.service,
    host: data.host,
    port: data.port,
    secure: true,
    auth: {
      user: data.username,
      pass: data.password
    }
  });

  const mailOptions = {
    from: 'fastlab@newcastle.edu.au',
    to: 'fastlab@newcastle.edu.au',
    subject: `You have received an enquiry from someone on Penny, penny.soci.org.au.`,
    html: email(data),
  };

  Transporter.sendMail(mailOptions)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
