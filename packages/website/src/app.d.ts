// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			code: number,
			message: string,
		}
		interface Locals {
			session: Session | undefined;
			user: User | undefined;
		}		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'jsonwebtoken';
declare module 'nodemailer';
declare module 'svelte-filepond';

export { };
