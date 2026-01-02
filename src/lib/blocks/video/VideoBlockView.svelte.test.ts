import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import VideoBlockView from './VideoBlockView.svelte';

const defaultProps = {
	metadata: {},
	properties: {},
	path: '/',
	blocksConfig: {}
};

describe('VideoBlockView - YouTube Videos', () => {
	test('renders YouTube video as iframe with privacy-enhanced embed URL', () => {
		const data = {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const iframe = container.querySelector('iframe');
		expect(iframe).toBeInTheDocument();
		expect(iframe).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
		expect(iframe).toHaveAttribute('title', 'YouTube video player');
		expect(iframe).toHaveAttribute('allowfullscreen');
	});
});

describe('VideoBlockView - Vimeo Videos', () => {
	test('renders Vimeo video as iframe with correct embed URL', () => {
		const data = {
			url: 'https://vimeo.com/123456789'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const iframe = container.querySelector('iframe');
		expect(iframe).toBeInTheDocument();
		expect(iframe).toHaveAttribute('src', 'https://player.vimeo.com/video/123456789');
		expect(iframe).toHaveAttribute('title', 'Vimeo video player');
		expect(iframe).toHaveAttribute('allowfullscreen');
	});
});

describe('VideoBlockView - Self-Hosted Videos', () => {
	test('renders self-hosted video as HTML5 video element with controls', () => {
		const data = {
			url: 'https://example.com/videos/sample.mp4'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const video = container.querySelector('video');
		expect(video).toBeInTheDocument();
		expect(video).toHaveAttribute('src', 'https://example.com/videos/sample.mp4');
		expect(video).toHaveAttribute('controls');
	});

	test('renders self-hosted video with poster attribute when preview_image is provided', () => {
		const data = {
			url: 'https://example.com/videos/sample.mp4',
			preview_image: 'https://example.com/images/poster.jpg'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const video = container.querySelector('video');
		expect(video).toBeInTheDocument();
		expect(video).toHaveAttribute('poster', 'https://example.com/images/poster.jpg');
	});
});

describe('VideoBlockView - Edge Cases', () => {
	test('renders video block container even with missing URL', () => {
		const data = {};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const videoBlock = container.querySelector('.block.video');
		expect(videoBlock).toBeInTheDocument();
	});
});

describe('VideoBlockView - Alignment CSS Classes', () => {
	test('applies has--align--left class for left alignment', () => {
		const data = {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			align: 'left'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const videoBlock = container.querySelector('.block.video');
		expect(videoBlock).toHaveClass('has--align--left');
	});

	test('applies has--align--center class for center alignment', () => {
		const data = {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			align: 'center'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const videoBlock = container.querySelector('.block.video');
		expect(videoBlock).toHaveClass('has--align--center');
	});

	test('applies has--align--right class for right alignment', () => {
		const data = {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			align: 'right'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const videoBlock = container.querySelector('.block.video');
		expect(videoBlock).toHaveClass('has--align--right');
	});

	test('applies has--align--full class for full-width alignment (default)', () => {
		const data = {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const videoBlock = container.querySelector('.block.video');
		expect(videoBlock).toHaveClass('has--align--full');
	});

	test('reads alignment from data.styles.align when present', () => {
		const data = {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			styles: {
				align: 'right'
			}
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const videoBlock = container.querySelector('.block.video');
		expect(videoBlock).toHaveClass('has--align--right');
	});
});

describe('VideoBlockView - Video Wrapper Container', () => {
	test('wraps YouTube iframe in video-wrapper container', () => {
		const data = {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const wrapper = container.querySelector('.video-wrapper');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper?.querySelector('iframe')).toBeInTheDocument();
	});

	test('wraps Vimeo iframe in video-wrapper container', () => {
		const data = {
			url: 'https://vimeo.com/123456789'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const wrapper = container.querySelector('.video-wrapper');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper?.querySelector('iframe')).toBeInTheDocument();
	});

	test('wraps self-hosted video element in video-wrapper container', () => {
		const data = {
			url: 'https://example.com/videos/sample.mp4'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const wrapper = container.querySelector('.video-wrapper');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper?.querySelector('video')).toBeInTheDocument();
	});
});

describe('VideoBlockView - Iframe Attributes', () => {
	test('YouTube iframe has correct allow attribute for permissions', () => {
		const data = {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const iframe = container.querySelector('iframe');
		expect(iframe).toHaveAttribute('allow');
		const allowAttr = iframe?.getAttribute('allow') || '';
		expect(allowAttr).toContain('accelerometer');
		expect(allowAttr).toContain('autoplay');
		expect(allowAttr).toContain('encrypted-media');
	});

	test('YouTube iframe has frameborder="0" attribute', () => {
		const data = {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
		};

		const { container } = render(VideoBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'test-id', data }
		});

		const iframe = container.querySelector('iframe');
		expect(iframe).toHaveAttribute('frameborder', '0');
	});
});
