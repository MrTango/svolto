import { describe, test, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('Layout Design Tokens', () => {
	let document: Document;
	let rootStyles: CSSStyleDeclaration;

	beforeAll(async () => {
		const cssPath = path.resolve(__dirname, './layout-variables.css');
		const cssContent = fs.readFileSync(cssPath, 'utf-8');

		const dom = new JSDOM(`
			<!DOCTYPE html>
			<html>
				<head>
					<style>${cssContent}</style>
				</head>
				<body>
					<div class="test-container"></div>
				</body>
			</html>
		`);

		document = dom.window.document;
		rootStyles = dom.window.getComputedStyle(document.documentElement);
	});

	test('container width variables are defined', () => {
		const layoutWidth = rootStyles.getPropertyValue('--layout-container-width').trim();
		const defaultWidth = rootStyles.getPropertyValue('--default-container-width').trim();
		const narrowWidth = rootStyles.getPropertyValue('--narrow-container-width').trim();

		expect(layoutWidth).toBe('1440px');
		expect(defaultWidth).toBe('940px');
		expect(narrowWidth).toBe('620px');
	});

	test('responsive padding variables are defined', () => {
		const mobilePadding = rootStyles.getPropertyValue('--container-padding-mobile').trim();
		const tabletPadding = rootStyles.getPropertyValue('--container-padding-tablet').trim();
		const desktopPadding = rootStyles.getPropertyValue('--container-padding-desktop').trim();

		expect(mobilePadding).toBe('16px');
		expect(tabletPadding).toBe('24px');
		expect(desktopPadding).toBe('32px');
	});

	test('layout spacing variables are defined', () => {
		const headerHeight = rootStyles.getPropertyValue('--header-height').trim();
		const footerPadding = rootStyles.getPropertyValue('--footer-padding').trim();
		const sectionSpacing = rootStyles.getPropertyValue('--section-spacing').trim();

		expect(headerHeight).toBe('auto');
		expect(footerPadding).toBe('2rem');
		expect(sectionSpacing).toBe('2rem');
	});

	test('gradient color tokens are defined with WCAG AA compliant values', () => {
		const headerGradientStart = rootStyles.getPropertyValue('--header-gradient-start').trim();
		const headerGradientEnd = rootStyles.getPropertyValue('--header-gradient-end').trim();
		const footerGradientStart = rootStyles.getPropertyValue('--footer-gradient-start').trim();
		const footerGradientEnd = rootStyles.getPropertyValue('--footer-gradient-end').trim();
		const headerTextColor = rootStyles.getPropertyValue('--header-text-color').trim();
		const footerTextColor = rootStyles.getPropertyValue('--footer-text-color').trim();

		// WCAG AA compliant colors (≥4.5:1 contrast with white text)
		expect(headerGradientStart).toBe('#006570');
		expect(headerGradientEnd).toBe('#005a63');
		expect(footerGradientStart).toBe('#006570');
		expect(footerGradientEnd).toBe('#005a63');
		expect(headerTextColor).toBe('#ffffff');
		expect(footerTextColor).toBe('#ffffff');
	});
});
