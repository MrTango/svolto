import { PUBLIC_PLONE_BASE_URL } from '$env/static/public';

interface NavItem {
	'@id': string;
	href?: string;
	title?: string;
	items?: NavItem[];
}

interface PloneData {
	'@type'?: string;
	'@id'?: string;
	title?: string;
	description?: string;
	text?: { data?: string };
	image?: {
		download?: string;
		scales?: Record<string, { download?: string }>;
	};
	items?: NavItem[];
	'@components'?: {
		default_page?: {
			title?: string;
			description?: string;
			text?: { data?: string };
			image?: {
				download?: string;
				scales?: Record<string, { download?: string }>;
			};
			items?: NavItem[];
		};
		navigation?: { items?: NavItem[] };
		contextnavigation?: {
			url?: string;
			items?: NavItem[];
		};
		breadcrumbs?: { items?: NavItem[] };
	};
}

interface PageData {
	[key: string]: unknown;
}

export function extractPageData(data: PloneData): PageData {
	const pageData: PageData = {};
	const defaultPage = data.hasOwnProperty('@components') ? data['@components']?.default_page : null;
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
	pageData['href'] = backend2FrontendUrl(pageData['href'] as string);
	if (pageData['image']) {
		const image = pageData['image'] as { download?: string; scales?: Record<string, { download?: string }> };
		image.download = backend2FrontendUrl(image.download);
		for (const scale in image['scales']) {
			image['scales'][scale].download = backend2FrontendUrl(
				image['scales'][scale].download
			);
		}
	}
	if (data.hasOwnProperty('@components') && data['@components']) {
		if (data['@components'].hasOwnProperty('navigation') && data['@components'].navigation?.items) {
			data['@components'].navigation.items.forEach((item: NavItem) => {
				item['href'] = backend2FrontendUrl(item['@id']);
			});
			pageData['navigation'] = data['@components'].navigation.items;
		}
		if (data['@components'].contextnavigation?.items) {
			data['@components'].contextnavigation.url = backend2FrontendUrl(
				data['@components'].contextnavigation.url
			);
			data['@components'].contextnavigation.items.forEach((item: NavItem) => {
				item['href'] = backend2FrontendUrl(item['@id']);
			});
			backend2FrontendUrlInNavtree(data['@components'].contextnavigation.items);
			pageData['contextnavigation'] = data['@components'].contextnavigation;
		}
		if (data['@components'].breadcrumbs?.items) {
			data['@components'].breadcrumbs.items.forEach((item: NavItem) => {
				item['href'] = backend2FrontendUrl(item['@id']);
			});
			pageData['breadcrumbs'] = data['@components'].breadcrumbs.items;
		}
	}
	pageData['items'] = (defaultPage && defaultPage.items) || data.items;
	if (pageData['items']) {
		(pageData['items'] as NavItem[]).forEach((item: NavItem) => {
			item['href'] = backend2FrontendUrl(item['@id']);
		});
	}

	return pageData;
}

export function backend2FrontendUrlInNavtree(items: NavItem[]): void {
	items.forEach((item: NavItem) => {
		item.href = backend2FrontendUrl(item.href);
		if (item.items) {
			backend2FrontendUrlInNavtree(item.items);
		}
	});
}

export function backend2FrontendUrl(url: string | undefined): string {
	if (!url) {
		return url || '';
	}
	const frontendUrl = url.replace(PUBLIC_PLONE_BASE_URL, '');
	return frontendUrl;
}

export function backend2FrontendSlug(url: string): string {
	const slug = url.replace(PUBLIC_PLONE_BASE_URL, '').replace(/^\/|\/$/g, '');
	return slug;
}
