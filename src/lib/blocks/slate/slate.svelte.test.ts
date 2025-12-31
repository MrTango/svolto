import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import SlateBlockView from './SlateBlockView.svelte';

// Task Group 1: Paragraph and default element handling tests
describe('Slate Block - Paragraph Element', () => {
	test('renders paragraph with correct p element', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [{ text: 'Test paragraph content' }]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const paragraph = container.querySelector('p');
		expect(paragraph).toBeInTheDocument();
		expect(paragraph).toHaveTextContent('Test paragraph content');
	});

	test('paragraph has slate-paragraph CSS class', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [{ text: 'Styled paragraph' }]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const paragraph = container.querySelector('p.slate-paragraph');
		expect(paragraph).toBeInTheDocument();
	});

	test('paragraph serves as fallback for unknown node types', () => {
		const data = {
			value: [
				{
					type: 'unknown-type',
					children: [{ text: 'Fallback content' }]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Should render as paragraph (fallback)
		const paragraph = container.querySelector('p.slate-paragraph');
		expect(paragraph).toBeInTheDocument();
		expect(paragraph).toHaveTextContent('Fallback content');
	});

	test('nested children render correctly within paragraph', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{ text: 'Normal text ' },
						{
							type: 'strong',
							children: [{ text: 'bold text' }]
						},
						{ text: ' more text' }
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const paragraph = container.querySelector('p.slate-paragraph');
		expect(paragraph).toBeInTheDocument();
		expect(paragraph).toHaveTextContent('Normal text bold text more text');

		const strong = paragraph?.querySelector('strong');
		expect(strong).toBeInTheDocument();
		expect(strong).toHaveTextContent('bold text');
	});
});

// Task Group 2: Heading component tests
describe('Slate Block - Heading Elements', () => {
	test('H4 renders with correct h4 element and class', () => {
		const data = {
			value: [
				{
					type: 'h4',
					children: [{ text: 'Heading 4 content' }]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const heading = container.querySelector('h4.slate-h4');
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent('Heading 4 content');
	});

	test('H5 renders with correct h5 element and class', () => {
		const data = {
			value: [
				{
					type: 'h5',
					children: [{ text: 'Heading 5 content' }]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const heading = container.querySelector('h5.slate-h5');
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent('Heading 5 content');
	});

	test('H6 renders with correct h6 element and class', () => {
		const data = {
			value: [
				{
					type: 'h6',
					children: [{ text: 'Heading 6 content' }]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const heading = container.querySelector('h6.slate-h6');
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent('Heading 6 content');
	});

	test('existing H2 and H3 have slate classes', () => {
		const data = {
			value: [
				{
					type: 'h2',
					children: [{ text: 'Heading 2' }]
				},
				{
					type: 'h3',
					children: [{ text: 'Heading 3' }]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		expect(container.querySelector('h2.slate-h2')).toBeInTheDocument();
		expect(container.querySelector('h3.slate-h3')).toBeInTheDocument();
	});
});

// Task Group 3: Inline formatting tests
describe('Slate Block - Inline Text Formatting', () => {
	test('Underline renders u element with slate-underline class', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{
							type: 'underline',
							children: [{ text: 'underlined text' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const underline = container.querySelector('u.slate-underline');
		expect(underline).toBeInTheDocument();
		expect(underline).toHaveTextContent('underlined text');
	});

	test('Strikethrough renders s element with slate-strikethrough class', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{
							type: 'strikethrough',
							children: [{ text: 'strikethrough text' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const strikethrough = container.querySelector('s.slate-strikethrough');
		expect(strikethrough).toBeInTheDocument();
		expect(strikethrough).toHaveTextContent('strikethrough text');
	});

	test('Del renders del element with slate-del class', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{
							type: 'del',
							children: [{ text: 'deleted text' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const del = container.querySelector('del.slate-del');
		expect(del).toBeInTheDocument();
		expect(del).toHaveTextContent('deleted text');
	});

	test('Del with nested content renders correctly', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{
							type: 'del',
							children: [
								{ text: 'deleted ' },
								{
									type: 'strong',
									children: [{ text: 'bold' }]
								},
								{ text: ' text' }
							]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const del = container.querySelector('del.slate-del');
		expect(del).toBeInTheDocument();
		expect(del).toHaveTextContent('deleted bold text');

		const strongInsideDel = del?.querySelector('strong.slate-strong');
		expect(strongInsideDel).toBeInTheDocument();
		expect(strongInsideDel).toHaveTextContent('bold');
	});

	test('Sub renders sub element with slate-sub class', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{ text: 'H' },
						{
							type: 'sub',
							children: [{ text: '2' }]
						},
						{ text: 'O' }
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const sub = container.querySelector('sub.slate-sub');
		expect(sub).toBeInTheDocument();
		expect(sub).toHaveTextContent('2');
	});

	test('Sup renders sup element with slate-sup class', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{ text: 'E=mc' },
						{
							type: 'sup',
							children: [{ text: '2' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const sup = container.querySelector('sup.slate-sup');
		expect(sup).toBeInTheDocument();
		expect(sup).toHaveTextContent('2');
	});

	test('Code renders code element with slate-code class', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{ text: 'Use ' },
						{
							type: 'code',
							children: [{ text: 'console.log()' }]
						},
						{ text: ' for debugging' }
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const code = container.querySelector('code.slate-code');
		expect(code).toBeInTheDocument();
		expect(code).toHaveTextContent('console.log()');
	});

	test('existing Strong and Em have slate classes', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{
							type: 'strong',
							children: [{ text: 'bold' }]
						},
						{
							type: 'em',
							children: [{ text: 'italic' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		expect(container.querySelector('strong.slate-strong')).toBeInTheDocument();
		expect(container.querySelector('em.slate-em')).toBeInTheDocument();
	});
});

// Task Group 4: Blockquote and Link tests
describe('Slate Block - Blockquote and Links', () => {
	test('Blockquote renders blockquote element with slate-blockquote class', () => {
		const data = {
			value: [
				{
					type: 'blockquote',
					children: [
						{
							type: 'p',
							children: [{ text: 'A famous quote' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const blockquote = container.querySelector('blockquote.slate-blockquote');
		expect(blockquote).toBeInTheDocument();
		expect(blockquote).toHaveTextContent('A famous quote');
	});

	test('external links render with correct href', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{
							type: 'link',
							data: { url: 'https://example.com' },
							children: [{ text: 'External link' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const link = container.querySelector('a.slate-link');
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', 'https://example.com');
		expect(link).toHaveTextContent('External link');
	});

	test('email links render with mailto protocol', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{
							type: 'link',
							data: { url: 'mailto:test@example.com' },
							children: [{ text: 'Email us' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const link = container.querySelector('a.slate-link');
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', 'mailto:test@example.com');
	});

	test('internal links resolve resolveuid URLs', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{
							type: 'link',
							data: {
								url: '../resolveuid/abc123',
								link: {
									internal: {
										internal_link: [
											{
												'@id': 'http://localhost:8080/Plone/my-page',
												token: 'abc123'
											}
										]
									}
								}
							},
							children: [{ text: 'Internal link' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const link = container.querySelector('a.slate-link');
		expect(link).toBeInTheDocument();
		// Should resolve to the path from internal_link
		expect(link).toHaveAttribute('href', '/my-page');
	});
});

// Task Group 5: List tests and integration
describe('Slate Block - Lists', () => {
	test('ordered list renders with slate-ol class', () => {
		const data = {
			value: [
				{
					type: 'ol',
					children: [
						{
							type: 'li',
							children: [{ text: 'First item' }]
						},
						{
							type: 'li',
							children: [{ text: 'Second item' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const ol = container.querySelector('ol.slate-ol');
		expect(ol).toBeInTheDocument();

		const items = container.querySelectorAll('li.slate-li');
		expect(items.length).toBe(2);
	});

	test('unordered list renders with slate-ul class', () => {
		const data = {
			value: [
				{
					type: 'ul',
					children: [
						{
							type: 'li',
							children: [{ text: 'Bullet item' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const ul = container.querySelector('ul.slate-ul');
		expect(ul).toBeInTheDocument();
	});

	test('nested list structures render correctly', () => {
		const data = {
			value: [
				{
					type: 'ul',
					children: [
						{
							type: 'li',
							children: [
								{ text: 'Parent item' },
								{
									type: 'ul',
									children: [
										{
											type: 'li',
											children: [{ text: 'Nested item' }]
										}
									]
								}
							]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const outerUl = container.querySelector('ul.slate-ul');
		expect(outerUl).toBeInTheDocument();

		const nestedUl = outerUl?.querySelector('ul.slate-ul');
		expect(nestedUl).toBeInTheDocument();
	});

	test('complete Slate block with multiple element types renders correctly', () => {
		const data = {
			value: [
				{
					type: 'h2',
					children: [{ text: 'Document Title' }]
				},
				{
					type: 'p',
					children: [
						{ text: 'This is a ' },
						{
							type: 'strong',
							children: [{ text: 'bold' }]
						},
						{ text: ' paragraph with ' },
						{
							type: 'link',
							data: { url: 'https://example.com' },
							children: [{ text: 'a link' }]
						}
					]
				},
				{
					type: 'ul',
					children: [
						{
							type: 'li',
							children: [{ text: 'List item' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		expect(container.querySelector('h2.slate-h2')).toBeInTheDocument();
		expect(container.querySelector('p.slate-paragraph')).toBeInTheDocument();
		expect(container.querySelector('strong.slate-strong')).toBeInTheDocument();
		expect(container.querySelector('a.slate-link')).toBeInTheDocument();
		expect(container.querySelector('ul.slate-ul')).toBeInTheDocument();
		expect(container.querySelector('li.slate-li')).toBeInTheDocument();
	});
});

// Task Group 6: Strategic gap-filling tests for complex scenarios
describe('Slate Block - Integration & Edge Cases', () => {
	test('nested inline formatting (bold within italic) renders correctly', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{
							type: 'em',
							children: [
								{ text: 'italic ' },
								{
									type: 'strong',
									children: [{ text: 'and bold' }]
								}
							]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const em = container.querySelector('em.slate-em');
		expect(em).toBeInTheDocument();

		const strongInsideEm = em?.querySelector('strong.slate-strong');
		expect(strongInsideEm).toBeInTheDocument();
		expect(strongInsideEm).toHaveTextContent('and bold');
	});

	test('formatted text inside blockquote renders correctly', () => {
		const data = {
			value: [
				{
					type: 'blockquote',
					children: [
						{
							type: 'p',
							children: [
								{ text: 'A quote with ' },
								{
									type: 'strong',
									children: [{ text: 'bold' }]
								},
								{ text: ' and ' },
								{
									type: 'em',
									children: [{ text: 'italic' }]
								}
							]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const blockquote = container.querySelector('blockquote.slate-blockquote');
		expect(blockquote).toBeInTheDocument();
		expect(blockquote?.querySelector('strong.slate-strong')).toBeInTheDocument();
		expect(blockquote?.querySelector('em.slate-em')).toBeInTheDocument();
	});

	test('mixed list nesting (ul within ol) renders correctly', () => {
		const data = {
			value: [
				{
					type: 'ol',
					children: [
						{
							type: 'li',
							children: [
								{ text: 'Ordered item' },
								{
									type: 'ul',
									children: [
										{
											type: 'li',
											children: [{ text: 'Unordered nested' }]
										}
									]
								}
							]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const ol = container.querySelector('ol.slate-ol');
		expect(ol).toBeInTheDocument();

		const nestedUl = ol?.querySelector('ul.slate-ul');
		expect(nestedUl).toBeInTheDocument();
	});

	test('empty data value renders without errors', () => {
		const data = {
			value: []
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const slateBlock = container.querySelector('.block.slate');
		expect(slateBlock).toBeInTheDocument();
		expect(slateBlock?.children.length).toBe(0);
	});

	test('link with formatted text inside renders correctly', () => {
		const data = {
			value: [
				{
					type: 'p',
					children: [
						{
							type: 'link',
							data: { url: 'https://example.com' },
							children: [
								{
									type: 'strong',
									children: [{ text: 'Bold link text' }]
								}
							]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const link = container.querySelector('a.slate-link');
		expect(link).toBeInTheDocument();

		const strongInsideLink = link?.querySelector('strong.slate-strong');
		expect(strongInsideLink).toBeInTheDocument();
		expect(strongInsideLink).toHaveTextContent('Bold link text');
	});

	test('list items with inline formatting render correctly', () => {
		const data = {
			value: [
				{
					type: 'ul',
					children: [
						{
							type: 'li',
							children: [
								{ text: 'Item with ' },
								{
									type: 'code',
									children: [{ text: 'inline code' }]
								}
							]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const li = container.querySelector('li.slate-li');
		expect(li).toBeInTheDocument();

		const codeInsideLi = li?.querySelector('code.slate-code');
		expect(codeInsideLi).toBeInTheDocument();
		expect(codeInsideLi).toHaveTextContent('inline code');
	});

	test('heading with inline formatting renders correctly', () => {
		const data = {
			value: [
				{
					type: 'h3',
					children: [
						{ text: 'Heading with ' },
						{
							type: 'em',
							children: [{ text: 'emphasis' }]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const h3 = container.querySelector('h3.slate-h3');
		expect(h3).toBeInTheDocument();

		const emInsideH3 = h3?.querySelector('em.slate-em');
		expect(emInsideH3).toBeInTheDocument();
		expect(emInsideH3).toHaveTextContent('emphasis');
	});

	test('deeply nested structure renders correctly', () => {
		const data = {
			value: [
				{
					type: 'blockquote',
					children: [
						{
							type: 'ul',
							children: [
								{
									type: 'li',
									children: [
										{
											type: 'p',
											children: [
												{
													type: 'strong',
													children: [
														{
															type: 'em',
															children: [{ text: 'deeply nested' }]
														}
													]
												}
											]
										}
									]
								}
							]
						}
					]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const blockquote = container.querySelector('blockquote.slate-blockquote');
		expect(blockquote).toBeInTheDocument();

		const ul = blockquote?.querySelector('ul.slate-ul');
		expect(ul).toBeInTheDocument();

		const em = ul?.querySelector('em.slate-em');
		expect(em).toBeInTheDocument();
		expect(em).toHaveTextContent('deeply nested');
	});
});
