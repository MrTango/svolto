import { API_PATH } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname.includes('@@images') || pathname.includes('@@download')) {
		const backendUrl = `${API_PATH}${pathname}`;

		try {
			const response = await fetch(backendUrl);

			if (!response.ok) {
				return new Response(null, { status: response.status });
			}

			return new Response(response.body, {
				status: response.status,
				headers: {
					'content-type': response.headers.get('content-type') || 'application/octet-stream',
					'cache-control': response.headers.get('cache-control') || 'public, max-age=31536000'
				}
			});
		} catch {
			return new Response(null, { status: 502 });
		}
	}

	return resolve(event);
};
