import type { Actions } from './$types';
import { mailer } from '$lib/utils/nodemailer';
import { fail } from '@sveltejs/kit';
import { Config } from 'sst/node/config';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const firstName: string | undefined = data.get('firstName')?.toString();
    const lastName: string | undefined = data.get('lastName')?.toString();
    const email: string | undefined = data.get('email')?.toString();
    const phone: string | undefined = data.get('phone')?.toString();
    const message: string | undefined = data.get('message')?.toString();

    try {
      const result = await mailer({
        email: String(email),
        firstname: String(firstName),
        lastname: String(lastName),
        phone: String(phone),
        message: String(message),
        service: Config.EMAIL_SERVICE,
        host: Config.EMAIL_HOST,
        port: Number(Config.EMAIL_PORT),
        username: Config.EMAIL_USER,
        password: Config.EMAIL_APP_PASS
      });

      return {
        result
      };
    } catch (err) {
      if (typeof err === 'string') {
        return fail(400, {
          message: err
        });
      } else if (err instanceof Error) {
        return fail(400, {
          message: err.message
        });
      }
    }
  }
};
