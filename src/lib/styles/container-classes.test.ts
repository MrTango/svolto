import { describe, test, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('Container Utility Classes', () => {
	let dom: JSDOM;
	let document: Document;
	let getComputedStyle: (element: Element) => CSSStyleDeclaration;

	beforeAll(async () => {
		const layoutVariablesPath = path.resolve(__dirname, './layout-variables.css');
		const layoutVariablesCss = fs.readFileSync(layoutVariablesPath, 'utf-8');

		const containerClassesCss = `
			/* Layout container - full-width elements like header/footer (1440px) */
			.container-layout {
				max-width: var(--layout-container-width);
				width: 100%;
				margin-left: auto;
				margin-right: auto;
				padding-inline: var(--container-padding-mobile);
			}

			/* Default container - standard content sections (940px) */
			.container-default {
				max-width: var(--default-container-width);
				width: 100%;
				margin-left: auto;
				margin-right: auto;
				padding-inline: var(--container-padding-mobile);
			}

			/* Narrow container - text-focused content like articles (620px) */
			.container-narrow {
				max-width: var(--narrow-container-width);
				width: 100%;
				margin-left: auto;
				margin-right: auto;
				padding-inline: var(--container-padding-mobile);
			}

			/* Full-width utility - breaks out of container constraints */
			.full-width {
				width: 100vw;
				margin-left: calc(-50vw + 50%);
			}

			/* Site wrapper - root layout container with flex column */
			.site-wrapper {
				display: flex;
				flex-direction: column;
				min-height: 100vh;
			}
		`;

		const combinedCss = `${layoutVariablesCss}\n${containerClassesCss}`;

		dom = new JSDOM(`
			<!DOCTYPE html>
			<html>
				<head>
					<style>${combinedCss}</style>
				</head>
				<body>
					<div class="container-layout" id="layout"></div>
					<div class="container-default" id="default"></div>
					<div class="container-narrow" id="narrow"></div>
					<div class="full-width" id="full-width"></div>
					<div class="site-wrapper" id="site-wrapper"></div>
				</body>
			</html>
		`);

		document = dom.window.document;
		getComputedStyle = dom.window.getComputedStyle;
	});

	test('.container-layout applies correct max-width of 1440px', () => {
		const element = document.getElementById('layout');
		const styles = getComputedStyle(element!);

		expect(styles.maxWidth).toBe('var(--layout-container-width)');
	});

	test('.container-default applies correct max-width of 940px', () => {
		const element = document.getElementById('default');
		const styles = getComputedStyle(element!);

		expect(styles.maxWidth).toBe('var(--default-container-width)');
	});

	test('.container-narrow applies correct max-width of 620px', () => {
		const element = document.getElementById('narrow');
		const styles = getComputedStyle(element!);

		expect(styles.maxWidth).toBe('var(--narrow-container-width)');
	});

	test('containers are horizontally centered with margin auto', () => {
		const layoutEl = document.getElementById('layout');
		const defaultEl = document.getElementById('default');
		const narrowEl = document.getElementById('narrow');

		const layoutStyles = getComputedStyle(layoutEl!);
		const defaultStyles = getComputedStyle(defaultEl!);
		const narrowStyles = getComputedStyle(narrowEl!);

		expect(layoutStyles.marginLeft).toBe('auto');
		expect(layoutStyles.marginRight).toBe('auto');
		expect(layoutStyles.width).toBe('100%');

		expect(defaultStyles.marginLeft).toBe('auto');
		expect(defaultStyles.marginRight).toBe('auto');
		expect(defaultStyles.width).toBe('100%');

		expect(narrowStyles.marginLeft).toBe('auto');
		expect(narrowStyles.marginRight).toBe('auto');
		expect(narrowStyles.width).toBe('100%');
	});

	test('.full-width applies viewport width for breakout behavior', () => {
		const element = document.getElementById('full-width');
		const styles = getComputedStyle(element!);

		expect(styles.width).toBe('100vw');
		expect(styles.marginLeft).toBe('calc(-50vw + 50%)');
	});

	test('.site-wrapper applies flex column layout for sticky footer', () => {
		const element = document.getElementById('site-wrapper');
		const styles = getComputedStyle(element!);

		expect(styles.display).toBe('flex');
		expect(styles.flexDirection).toBe('column');
		expect(styles.minHeight).toBe('100vh');
	});
});
