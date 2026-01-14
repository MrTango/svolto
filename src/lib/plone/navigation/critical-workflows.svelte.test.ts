import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, fireEvent } from '@testing-library/svelte';
import MegaNav from './MegaNav.svelte';
import MobileNav from './MobileNav.svelte';
import type { NavItem } from './types';

const mockNavigation: NavItem[] = [
	{
		href: '/research',
		title: 'Research',
		items: [
			{
				href: '/research/projects',
				title: 'Projects',
				items: [
					{ href: '/research/projects/ai', title: 'AI Research' },
					{ href: '/research/projects/climate', title: 'Climate Studies' }
				]
			},
			{
				href: '/research/publications',
				title: 'Publications',
				items: [
					{ href: '/research/publications/journals', title: 'Journals' },
					{ href: '/research/publications/reports', title: 'Reports' }
				]
			}
		]
	},
	{
		href: '/about',
		title: 'About',
		items: [
			{
				href: '/about/team',
				title: 'Team',
				items: [{ href: '/about/team/leadership', title: 'Leadership' }]
			}
		]
	},
	{
		href: '/contact',
		title: 'Contact'
	}
];

describe('Critical Navigation Workflows', () => {
	test('click outside mega menu panel closes it', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		);
		await fireEvent.click(researchButton!);
		expect(researchButton).toHaveAttribute('aria-expanded', 'true');

		// Simulate click outside the nav element (on document body)
		await fireEvent.click(document.body);

		// Panel should be closed
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');
		const panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).not.toBeInTheDocument();
	});

	test('deep path correctly highlights Level 1 ancestor item', () => {
		const { container } = render(MegaNav, {
			props: {
				navigation: mockNavigation,
				currentPath: '/research/projects/ai'
			}
		});

		// Research should be active even though we're on a deeply nested page
		const activeItem = container.querySelector('.nav-mega__item--active');
		expect(activeItem).toBeInTheDocument();
		expect(activeItem).toHaveTextContent('Research');

		// About and Contact should NOT be active
		const allItems = container.querySelectorAll('.nav-mega__item');
		const aboutItem = Array.from(allItems).find((el) => el.textContent?.includes('About'));
		const contactItem = Array.from(allItems).find((el) => el.textContent?.includes('Contact'));
		expect(aboutItem).not.toHaveClass('nav-mega__item--active');
		expect(contactItem).not.toHaveClass('nav-mega__item--active');
	});

	test('mega menu panel renders Level 2 headers and Level 3 items correctly', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		);
		await fireEvent.click(researchButton!);

		const panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).toBeInTheDocument();

		// Verify Level 2 headers are rendered
		const l2Headers = panel?.querySelectorAll('.nav-mega__l2-header');
		expect(l2Headers?.length).toBe(2);
		expect(l2Headers?.[0]).toHaveTextContent('Projects');
		expect(l2Headers?.[1]).toHaveTextContent('Publications');

		// Verify Level 3 items are rendered under correct headers
		const columns = panel?.querySelectorAll('.nav-mega__column');
		expect(columns?.length).toBe(2);

		// First column (Projects) should have 2 L3 items
		const projectsL3Items = columns?.[0].querySelectorAll('.nav-mega__l3-item');
		expect(projectsL3Items?.length).toBe(2);
		expect(projectsL3Items?.[0]).toHaveTextContent('AI Research');
		expect(projectsL3Items?.[1]).toHaveTextContent('Climate Studies');

		// Second column (Publications) should have 2 L3 items
		const pubsL3Items = columns?.[1].querySelectorAll('.nav-mega__l3-item');
		expect(pubsL3Items?.length).toBe(2);
		expect(pubsL3Items?.[0]).toHaveTextContent('Journals');
		expect(pubsL3Items?.[1]).toHaveTextContent('Reports');
	});

	test('mobile accordion expands multiple levels deep (nested drill-down)', async () => {
		const { container, getByRole } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		await fireEvent.click(getByRole('button', { name: /toggle navigation/i }));

		// Expand Research (Level 1)
		const researchButton = container.querySelector('[data-nav-item="/research"]');
		expect(researchButton).toBeInTheDocument();
		await fireEvent.click(researchButton!);

		// Level 2 list should appear
		let level2List = container.querySelector('.nav-mobile__list--level-2');
		expect(level2List).toBeInTheDocument();

		// Now expand Projects (Level 2)
		const projectsButton = container.querySelector('[data-nav-item="/research/projects"]');
		expect(projectsButton).toBeInTheDocument();
		await fireEvent.click(projectsButton!);

		// Level 3 list should appear
		const level3List = container.querySelector('.nav-mobile__list--level-3');
		expect(level3List).toBeInTheDocument();

		// Verify Level 3 items are visible
		const aiLink = container.querySelector('a[href="/research/projects/ai"]');
		expect(aiLink).toBeInTheDocument();
		expect(aiLink).toHaveTextContent('AI Research');

		const climateLink = container.querySelector('a[href="/research/projects/climate"]');
		expect(climateLink).toBeInTheDocument();
		expect(climateLink).toHaveTextContent('Climate Studies');
	});

	test('mobile menu closes and resets accordion state when toggled off', async () => {
		const { container, getByRole } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		const trigger = getByRole('button', { name: /toggle navigation/i });
		await fireEvent.click(trigger);

		// Expand Research
		const researchButton = container.querySelector('[data-nav-item="/research"]');
		await fireEvent.click(researchButton!);

		// Verify expanded
		expect(container.querySelector('.nav-mobile__list--level-2')).toBeInTheDocument();

		// Close menu
		await fireEvent.click(trigger);
		expect(container.querySelector('.nav-mobile__overlay')).not.toBeInTheDocument();

		// Reopen menu
		await fireEvent.click(trigger);
		expect(container.querySelector('.nav-mobile__overlay')).toBeInTheDocument();

		// Accordion state should be reset - no Level 2 visible
		expect(container.querySelector('.nav-mobile__list--level-2')).not.toBeInTheDocument();

		// Chevron should not be in expanded state
		const chevron = container
			.querySelector('[data-nav-item="/research"]')
			?.querySelector('.nav-mobile__chevron');
		expect(chevron).not.toHaveClass('nav-mobile__chevron--expanded');
	});
});
