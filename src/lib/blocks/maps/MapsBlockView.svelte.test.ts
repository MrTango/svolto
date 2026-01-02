import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import MapsBlockView from './MapsBlockView.svelte';

const defaultProps = {
	metadata: {},
	properties: {},
	path: '/',
	blocksConfig: {}
};

describe('MapsBlockView - Iframe Rendering', () => {
	test('renders iframe with correct src from data.url', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const iframe = container.querySelector('iframe');
		expect(iframe).toBeInTheDocument();
		expect(iframe).toHaveAttribute('src', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345');
	});

	test('iframe has required attributes (loading="lazy", referrerpolicy, allowfullscreen, title)', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18',
			title: 'Office Location'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const iframe = container.querySelector('iframe');
		expect(iframe).toBeInTheDocument();
		expect(iframe).toHaveAttribute('loading', 'lazy');
		expect(iframe).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade');
		expect(iframe).toHaveAttribute('allowfullscreen');
		expect(iframe).toHaveAttribute('title', 'Office Location');
	});
});

describe('MapsBlockView - Alignment CSS Classes', () => {
	test('applies has--align--full class as default alignment', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const mapsBlock = container.querySelector('.block.maps');
		expect(mapsBlock).toBeInTheDocument();
		expect(mapsBlock).toHaveClass('has--align--full');
	});

	test('applies correct alignment classes (left, center, right)', () => {
		const alignments = ['left', 'center', 'right'];

		for (const align of alignments) {
			const data = {
				url: 'https://www.google.com/maps/embed?pb=!1m18',
				align
			};

			const { container } = render(MapsBlockView, {
				props: { ...defaultProps, key: 'test-key', id: `test-id-${align}`, data }
			});

			const mapsBlock = container.querySelector('.block.maps');
			expect(mapsBlock).toHaveClass(`has--align--${align}`);
		}
	});

	test('reads alignment from data.styles.align with fallback to data.align', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18',
			align: 'left',
			styles: {
				align: 'right'
			}
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const mapsBlock = container.querySelector('.block.maps');
		expect(mapsBlock).toHaveClass('has--align--right');
	});
});

describe('MapsBlockView - Wrapper Container', () => {
	test('maps-wrapper container wraps the iframe', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const wrapper = container.querySelector('.maps-wrapper');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper?.querySelector('iframe')).toBeInTheDocument();
	});
});

describe('MapsBlockView - Accessibility Features', () => {
	test('skip link and target anchor render with correct id pattern', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-block-id', data }
		});

		const skipLink = container.querySelector('a.skip-map-link');
		expect(skipLink).toBeInTheDocument();
		expect(skipLink).toHaveAttribute('href', '#after-map-test-block-id');

		const targetAnchor = container.querySelector('#after-map-test-block-id');
		expect(targetAnchor).toBeInTheDocument();
	});
});

describe('MapsBlockView - CSS Class Application', () => {
	test('block.maps element receives correct alignment class', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18',
			align: 'center'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const mapsBlock = container.querySelector('.block.maps');
		expect(mapsBlock).toBeInTheDocument();
		expect(mapsBlock).toHaveClass('block');
		expect(mapsBlock).toHaveClass('maps');
		expect(mapsBlock).toHaveClass('has--align--center');
	});

	test('maps-wrapper element is present inside block.maps', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const mapsBlock = container.querySelector('.block.maps');
		expect(mapsBlock).toBeInTheDocument();

		const wrapper = mapsBlock?.querySelector('.maps-wrapper');
		expect(wrapper).toBeInTheDocument();
	});
});

describe('MapsBlockView - Fallback Behaviors', () => {
	test('uses default title fallback when data.title is missing', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const iframe = container.querySelector('iframe');
		expect(iframe).toHaveAttribute('title', 'Google Maps embed');
	});

	test('uses default aria-label fallback when data.title is missing', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const wrapper = container.querySelector('.maps-wrapper');
		expect(wrapper).toHaveAttribute('aria-label', 'Map location');
	});

	test('block container renders even with empty data', () => {
		const data = {};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const mapsBlock = container.querySelector('.block.maps');
		expect(mapsBlock).toBeInTheDocument();
		expect(mapsBlock).toHaveClass('has--align--full');
	});
});

describe('MapsBlockView - Noscript Fallback', () => {
	test('noscript element is present in the component', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18',
			title: 'Our Office'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const noscript = container.querySelector('noscript');
		expect(noscript).toBeInTheDocument();
	});
});

describe('MapsBlockView - Security Attributes', () => {
	test('iframe has referrerpolicy for security', () => {
		const data = {
			url: 'https://www.google.com/maps/embed?pb=!1m18'
		};

		const { container } = render(MapsBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const iframe = container.querySelector('iframe');
		expect(iframe).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade');
	});
});
