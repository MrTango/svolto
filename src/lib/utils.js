import { PUBLIC_PLONE_BASE_URL } from '$env/static/public';

export function extractPageData(data) {
	let pageData = {};
	// console.log('raw data:')
	// console.log(data)
	let defaultPage = data.hasOwnProperty('@components') ? data['@components'].default_page : null;
	pageData['title'] = defaultPage && defaultPage.title ? defaultPage.title : data.title;
	pageData['description'] =
		defaultPage && defaultPage.description ? defaultPage.description : data.description;
	pageData['text'] =
		defaultPage && defaultPage.text && defaultPage.text.data
			? defaultPage.text.data
			: (data.text && data.text.data) || '';
	pageData['image'] = defaultPage && defaultPage.image ? defaultPage.image : data.image;
	pageData['@type'] = data['@type'];
	pageData['@id'] = data['@id'];
	pageData['href'] = data['@id'];
	pageData['href'] = backend2FrontendUrl(pageData['href']);
	if (pageData['image']) {
		pageData['image'].download = backend2FrontendUrl(pageData['image'].download);
		for (const scale in pageData['image']['scales']) {
			pageData['image']['scales'][scale].download = backend2FrontendUrl(
				pageData['image']['scales'][scale].download
			);
		}
	}
	if (data.hasOwnProperty('@components')) {
		if (data['@components'].hasOwnProperty('navigation') && data['@components'].navigation.items) {
			data['@components'].navigation.items.forEach((item) => {
				item['href'] = backend2FrontendUrl(item['@id']);
			});
			pageData['navigation'] = data['@components'].navigation.items;
		}
		if (data['@components'].contextnavigation.items) {
			data['@components'].contextnavigation.url = backend2FrontendUrl(
				data['@components'].contextnavigation.url
			);
			data['@components'].contextnavigation.items.forEach((item) => {
				item['href'] = backend2FrontendUrl(item['@id']);
			});
			backend2FrontendUrlInNavtree(data['@components'].contextnavigation.items);
			pageData['contextnavigation'] = data['@components'].contextnavigation;
		}
		if (data['@components'].breadcrumbs.items) {
			data['@components'].breadcrumbs.items.forEach((item) => {
				item['href'] = backend2FrontendUrl(item['@id']);
			});
			pageData['breadcrumbs'] = data['@components'].breadcrumbs.items;
		}
	}
	pageData['items'] = (defaultPage && defaultPage.items) || data.items;
	if (pageData['items']) {
		pageData['items'].forEach((item) => {
			item['href'] = backend2FrontendUrl(item['@id']);
		});
		// pageData['items'] = data['@components'].breadcrumbs.items;
	}

	// console.log("final data: ",pageData);
	return pageData;
}

export function backend2FrontendUrlInNavtree(items) {
	items.forEach((item) => {
		item.href = backend2FrontendUrl(item.href);
		// console.log(item.href)
		if (item.items) {
			// console.log("traverse items of: ", item.href)
			backend2FrontendUrlInNavtree(item.items);
		}
	});
}

export function backend2FrontendUrl(url) {
	if (!url) {
		return url;
	}
	// console.log(`url: ${url}`)
	const frontendUrl = url.replace(PUBLIC_PLONE_BASE_URL, '');
	// console.log(`url: ${frontendUrl}`)
	return frontendUrl;
}

export function backend2FrontendSlug(url) {
	let slug = url.replace(PUBLIC_PLONE_BASE_URL, '').replace(/^\/|\/$/g, '');
	return slug;
}
