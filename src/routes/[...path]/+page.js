// import { error } from '@sveltejs/kit';
// import { PUBLIC_PLONE_BASE_URL } from '$env/static/public';
// import { extractPageData } from "$lib/utils"

export const prerender = true;

// /** @type {import('./$types').PageLoad} */
// export async function load(event) {
// 	console.log("path: " + event.params.path);
// 	let headers = new Headers();
// 	// headers.set('Content-type', 'application/json');
// 	headers.set('Accept', 'application/json');
// 	// headers.set('X-Requested-With', 'Fetch');
// 	const method = 'GET';
// 	const apiUrl =
// 		PUBLIC_PLONE_BASE_URL +
// 		'/' +
// 		event.params.path +
// 		'?expand=default_page&expand=navigation&expand=contextnavigation&expand.contextnavigation.topLevel=0&expand.contextnavigation.bottomLevel=6&expand.contextnavigation.name=Menu';
// 	console.log("apiURL: " + apiUrl);
// 	const response = await event.fetch(apiUrl, { method, headers });
// 	const data = await response.json();
// 	console.log(data);
//   return await extractPageData(data)
// 	// throw error(404, 'Not found');
// }
