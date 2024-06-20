type ContactMailer = {
  email: string;
  service: string;
  host: string;
  port: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  message: string;
};

type User = {
  id: string;
  email: string;
};

type UserToken = {
  userId: string;
  iat: number;
  exp: number;
}

export module 'jsonwebtoken';
export module 'nodemailer';
export module 'svelte-filepond';
export module 'svelte-filepond/types/index.d.ts'