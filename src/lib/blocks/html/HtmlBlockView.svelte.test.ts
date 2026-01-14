import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import HtmlBlockView from './HtmlBlockView.svelte';

const defaultProps = {
	metadata: {},
	properties: {},
	path: '/',
	blocksConfig: {}
};

describe('HtmlBlockView', () => {
	test('renders HTML content correctly using {@html} directive', () => {
		const data = {
			html: '<p class="test-paragraph">Hello World</p>'
		};

		const { container } = render(HtmlBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const wrapper = container.querySelector('div.block.html');
		expect(wrapper).toBeInTheDocument();

		const paragraph = container.querySelector('p.test-paragraph');
		expect(paragraph).toBeInTheDocument();
		expect(paragraph).toHaveTextContent('Hello World');
	});

	test('renders nothing when data.html is empty, undefined, or whitespace-only', () => {
		const emptyData = { html: '' };
		const { container: emptyContainer } = render(HtmlBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data: emptyData }
		});
		expect(emptyContainer.querySelector('div.block.html')).not.toBeInTheDocument();

		const undefinedData = {};
		const { container: undefinedContainer } = render(HtmlBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data: undefinedData }
		});
		expect(undefinedContainer.querySelector('div.block.html')).not.toBeInTheDocument();

		const whitespaceData = { html: '   \n\t  ' };
		const { container: whitespaceContainer } = render(HtmlBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data: whitespaceData }
		});
		expect(whitespaceContainer.querySelector('div.block.html')).not.toBeInTheDocument();
	});

	test('applies alignment class correctly', () => {
		const leftData = { html: '<p>Content</p>', styles: { align: 'left' } };
		const { container: leftContainer } = render(HtmlBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data: leftData }
		});
		expect(leftContainer.querySelector('div.has--align--left')).toBeInTheDocument();

		const centerData = { html: '<p>Content</p>', styles: { align: 'center' } };
		const { container: centerContainer } = render(HtmlBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data: centerData }
		});
		expect(centerContainer.querySelector('div.has--align--center')).toBeInTheDocument();

		const rightData = { html: '<p>Content</p>', styles: { align: 'right' } };
		const { container: rightContainer } = render(HtmlBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data: rightData }
		});
		expect(rightContainer.querySelector('div.has--align--right')).toBeInTheDocument();
	});

	test('defaults to left alignment when data.styles.align is not specified', () => {
		const data = { html: '<p>Content</p>' };
		const { container } = render(HtmlBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});
		expect(container.querySelector('div.has--align--left')).toBeInTheDocument();
	});

	test('appends custom CSS class from data.styles.customCss to class list', () => {
		const data = {
			html: '<p>Content</p>',
			styles: { align: 'center', customCss: 'my-custom-class' }
		};

		const { container } = render(HtmlBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const wrapper = container.querySelector('div.block.html');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveClass('block', 'html', 'has--align--center', 'my-custom-class');
	});
});
