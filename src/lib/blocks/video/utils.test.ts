import { describe, test, expect } from 'vitest';
import {
	detectVideoSource,
	extractYouTubeId,
	extractVimeoId,
	buildYouTubeEmbedUrl,
	buildVimeoEmbedUrl
} from './utils';

describe('Video URL Utilities', () => {
	test('detects YouTube URLs in various formats', () => {
		expect(detectVideoSource('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube');
		expect(detectVideoSource('https://youtu.be/dQw4w9WgXcQ')).toBe('youtube');
		expect(detectVideoSource('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('youtube');
	});

	test('extracts YouTube video IDs from all URL formats', () => {
		expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
		expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
		expect(extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
		expect(extractYouTubeId('https://youtube.com/watch?v=abc123XYZ_-')).toBe('abc123XYZ_-');
	});

	test('detects Vimeo URLs and extracts IDs', () => {
		expect(detectVideoSource('https://vimeo.com/123456789')).toBe('vimeo');
		expect(extractVimeoId('https://vimeo.com/123456789')).toBe('123456789');
		expect(extractVimeoId('https://www.vimeo.com/987654321')).toBe('987654321');
	});

	test('detects self-hosted video files by extension', () => {
		expect(detectVideoSource('https://example.com/video.mp4')).toBe('self-hosted');
		expect(detectVideoSource('https://example.com/video.webm')).toBe('self-hosted');
		expect(detectVideoSource('https://example.com/video.ogg')).toBe('self-hosted');
	});

	test('builds privacy-enhanced YouTube embed URLs', () => {
		expect(buildYouTubeEmbedUrl('dQw4w9WgXcQ')).toBe(
			'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'
		);
	});

	test('builds Vimeo player embed URLs', () => {
		expect(buildVimeoEmbedUrl('123456789')).toBe('https://player.vimeo.com/video/123456789');
	});

	test('returns null for invalid or empty URLs in extraction functions', () => {
		expect(extractYouTubeId('')).toBe(null);
		expect(extractYouTubeId('https://example.com/not-youtube')).toBe(null);
		expect(extractVimeoId('')).toBe(null);
		expect(extractVimeoId('https://example.com/not-vimeo')).toBe(null);
	});

	test('handles empty URL in detectVideoSource', () => {
		expect(detectVideoSource('')).toBe('self-hosted');
	});
});
