import { client } from '$lib/api';
import blocks from '$lib/blocks';
import config from '@plone/registry';

export const prerender = false;
// export const ssr = false;
// export const csr = false;
export const trailingSlash = 'always';

const applyConfig = (config) => {
	config.blocks.blocksConfig = {
		...config.blocks.blocksConfig,
		...blocks
	};
	return config;
};
let myConfig = applyConfig(config);

/** @type {import('./$types').PageLoad} */
export async function load(event) {
	// let headers = new Headers();
	// headers.set('Accept', 'application/json');
	// headers.set('X-Requested-With', 'Fetch');
	let currentPath = '/';
	if (event.params.path != undefined) {
		currentPath = event.params.path;
	}
	console.log(currentPath);

	const { getContent } = client;

	const data = await getContent({ path: currentPath });
	console.log(await data);
	return data;
}
