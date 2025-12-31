export type VideoSource = 'youtube' | 'vimeo' | 'self-hosted';

export function detectVideoSource(url: string): VideoSource {
	if (!url) return 'self-hosted';

	if (
		url.includes('youtube.com/watch') ||
		url.includes('youtu.be/') ||
		url.includes('youtube.com/embed/')
	) {
		return 'youtube';
	}

	if (url.includes('vimeo.com/')) {
		return 'vimeo';
	}

	return 'self-hosted';
}

export function extractYouTubeId(url: string): string | null {
	if (!url) return null;

	// Handle youtube.com/watch?v=ID format
	const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
	if (watchMatch) return watchMatch[1];

	// Handle youtu.be/ID format
	const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
	if (shortMatch) return shortMatch[1];

	// Handle youtube.com/embed/ID format
	const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
	if (embedMatch) return embedMatch[1];

	return null;
}

export function extractVimeoId(url: string): string | null {
	if (!url) return null;

	const match = url.match(/vimeo\.com\/(\d+)/);
	return match ? match[1] : null;
}

export function buildYouTubeEmbedUrl(videoId: string): string {
	return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function buildVimeoEmbedUrl(videoId: string): string {
	return `https://player.vimeo.com/video/${videoId}`;
}
