import nodemailer from 'nodemailer';
import { email } from './email';
import type { ContactMailer } from '../../ambient';

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
    from: 'me@michaelcuneo.com.au',
    to: 'michael.cuneo@newcastle.edu.au, paul.egglestone@newcastle.edu.au, heidi.axelsen@newcastle.edu.au',
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
