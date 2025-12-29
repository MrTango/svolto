import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import DescriptionBlockView from './DescriptionBlockView.svelte';

describe('DescriptionBlockView', () => {
	test('renders description from properties.description', () => {
		render(DescriptionBlockView, {
			props: {
				id: 'test-block',
				data: {},
				properties: { description: 'Test description from properties' }
			}
		});

		const paragraph = screen.getByText('Test description from properties');
		expect(paragraph).toBeInTheDocument();
		expect(paragraph).toHaveClass('documentDescription');
		expect(paragraph.tagName).toBe('P');
	});

	test('renders description from metadata.description (takes precedence over properties)', () => {
		render(DescriptionBlockView, {
			props: {
				id: 'test-block',
				data: {},
				metadata: { description: 'Description from metadata' },
				properties: { description: 'Description from properties' }
			}
		});

		expect(screen.getByText('Description from metadata')).toBeInTheDocument();
		expect(screen.queryByText('Description from properties')).not.toBeInTheDocument();
	});

	test('renders empty paragraph when no description is provided', () => {
		const { container } = render(DescriptionBlockView, {
			props: {
				id: 'test-block',
				data: {},
				properties: {}
			}
		});

		const paragraph = container.querySelector('p.documentDescription');
		expect(paragraph).toBeInTheDocument();
		expect(paragraph?.textContent).toBe('');
	});

	test('truncates description at word boundary when maxLength is set', () => {
		render(DescriptionBlockView, {
			props: {
				id: 'test-block',
				data: { maxLength: 20 },
				properties: { description: 'This is a longer description that should be truncated' }
			}
		});

		const paragraph = screen.getByRole('paragraph');
		expect(paragraph.textContent).toBe('This is a longer...');
	});

	test('truncates at character limit when no word boundary found', () => {
		render(DescriptionBlockView, {
			props: {
				id: 'test-block',
				data: { maxLength: 10 },
				properties: { description: 'Averylongwordwithnospaces' }
			}
		});

		const paragraph = screen.getByRole('paragraph');
		expect(paragraph.textContent).toBe('Averylongw...');
	});

	test('falls back to properties when metadata is undefined', () => {
		render(DescriptionBlockView, {
			props: {
				id: 'test-block',
				data: {},
				metadata: undefined,
				properties: { description: 'Fallback to properties' }
			}
		});

		expect(screen.getByText('Fallback to properties')).toBeInTheDocument();
	});

	test('does not truncate when description is shorter than maxLength', () => {
		render(DescriptionBlockView, {
			props: {
				id: 'test-block',
				data: { maxLength: 100 },
				properties: { description: 'Short text' }
			}
		});

		const paragraph = screen.getByRole('paragraph');
		expect(paragraph.textContent).toBe('Short text');
	});
});
