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

type ContentType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  uploadId: string;
  uploadType: string;
}

type PostcardType = {
  id: string;
  postcardId: string;
  response: string;
};

type QuestionType = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

declare module 'jsonwebtoken';
declare module 'nodemailer';
declare module 'svelte-filepond' {
  export function registerPlugin(...plugins: any[]): void;
  export default class FilePond {
    removeFiles(): void;
    // Add other methods you use from FilePond here
  }
}