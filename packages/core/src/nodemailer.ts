import nodemailer from 'nodemailer';
import { email } from './email';

import { Config } from 'sst/node/config';

type Mailer = {
  email: string;
  authUrl: string;
};

export const mailer = async (data: Mailer) => {
  const Transporter = nodemailer.createTransport({
    service: Config.EMAIL_SERVICE,
    host: Config.EMAIL_HOST,
    port: Number(Config.EMAIL_PORT),
    secure: true,
    auth: {
      user: Config.EMAIL_USER,
      pass: Config.EMAIL_APP_PASS
    }
  });

  const mailOptions = {
    from: Config.EMAIL_USER,
    to: data.email,
    subject: `Hello, here is your Login Link for ${Config.PROJECT_NAME}`,
    html: email(data.authUrl, Config.PROJECT_NAME)
  };

  return Transporter.sendMail(mailOptions)
    .then((res) => res)
    .catch((err) => err);
};
