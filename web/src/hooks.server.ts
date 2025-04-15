import type { Handle, ServerInit } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import DB from '$lib/server/db';
import GeneralManager from '$lib/server/generalManager';

export const init: ServerInit = async () => {
	const db = new DB();
	await db.init();
}

const authorizationHandle: Handle = async ({ event, resolve }) => {
	console.log(event.url.pathname);
	if (!event.url.pathname.startsWith('/voca'))
		return await resolve(event);

	const session = await event.locals.auth();
	// console.log(session?.user);

	if (session) {
		if (session?.user?.email !== undefined) {
			const user = (await GeneralManager.getUserByEmail(String(session.user.email)));
			if (user == null) {
				await GeneralManager.addNewUserByEmail(String(session.user.email));
				redirect(303, '/voca');
			} else {
				event.locals.user = user;
			}

		}
	} else {
		redirect(303, '/auth/signin');
	}

	const response = await resolve(event);
	return response;
};

export const handle = sequence(authenticationHandle, authorizationHandle);