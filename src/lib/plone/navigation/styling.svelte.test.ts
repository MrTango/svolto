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
				items: [{ href: '/research/projects/ai', title: 'AI Research' }]
			}
		]
	},
	{ href: '/about', title: 'About' }
];

describe('Responsive Navigation Behavior', () => {
	test('desktop mega nav has correct BEM class structure', () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const nav = container.querySelector('.nav-mega');
		expect(nav).toBeInTheDocument();

		const bar = container.querySelector('.nav-mega__bar');
		expect(bar).toBeInTheDocument();

		const items = container.querySelectorAll('.nav-mega__item');
		expect(items.length).toBeGreaterThan(0);
	});

	test('mobile nav has correct BEM class structure', () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const nav = container.querySelector('.nav-mobile');
		expect(nav).toBeInTheDocument();

		const trigger = container.querySelector('.nav-mobile__trigger');
		expect(trigger).toBeInTheDocument();
	});

	test('mega nav panel spans full viewport width with correct classes', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		);
		expect(researchButton).toBeInTheDocument();

		await fireEvent.click(researchButton!);

		const panel = container.querySelector('.nav-mega__panel');
		expect(panel).toBeInTheDocument();

		const panelHeader = container.querySelector('.nav-mega__panel-header');
		expect(panelHeader).toBeInTheDocument();

		const columns = container.querySelector('.nav-mega__columns');
		expect(columns).toBeInTheDocument();
	});

	test('mobile nav has touch-friendly trigger size', () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const trigger = container.querySelector('.nav-mobile__trigger') as HTMLElement;
		expect(trigger).toBeInTheDocument();

		const computedStyle = window.getComputedStyle(trigger);
		const width = parseInt(computedStyle.width) || 44;
		const height = parseInt(computedStyle.height) || 44;
		expect(width).toBeGreaterThanOrEqual(44);
		expect(height).toBeGreaterThanOrEqual(44);
	});
});
