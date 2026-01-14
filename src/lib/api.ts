import { PUBLIC_API_PATH } from '$env/static/public';
import ploneClient from '@plone/client';

export const client = ploneClient.initialize({
	apiPath: PUBLIC_API_PATH
});

export function createClient(apiPath: string) {
	return ploneClient.initialize({ apiPath });
}
