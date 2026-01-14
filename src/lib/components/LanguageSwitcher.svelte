<script lang="ts">
	import { goto } from '$app/navigation';
	import { langmap } from '$lib/utils/langmap';
	import { setLanguageCookieClient } from '$lib/utils/language-cookie';

	interface Translation {
		language: string;
		'@id': string;
	}

	interface Props {
		availableLanguages: string[];
		currentLang: string;
		translations?: Translation[];
		onSwitch?: (lang: string) => void;
	}

	let { availableLanguages, currentLang, translations = [], onSwitch }: Props = $props();

	let shouldRender = $derived(availableLanguages.length > 1);

	function getNativeName(langCode: string): string {
		const langInfo = langmap[langCode];
		return langInfo?.nativeName ?? langCode;
	}

	function getLanguageUrl(langCode: string): string {
		const translation = translations?.find((t) => t.language === langCode);
		if (translation) {
			try {
				const url = new URL(translation['@id']);
				return url.pathname.replace(/^\/Plone/, '') || '/';
			} catch {
				// If @id is not a valid absolute URL, try to use it directly
				const id = translation['@id'];
				if (id.startsWith('/')) {
					return id.replace(/^\/Plone/, '') || '/';
				}
				return `/${langCode}`;
			}
		}
		return `/${langCode}`;
	}

	async function handleClick(event: MouseEvent, langCode: string) {
		// Prevent default navigation to ensure cookie is set first
		event.preventDefault();

		// Set cookie synchronously before navigation
		setLanguageCookieClient(langCode);

		if (onSwitch) {
			onSwitch(langCode);
		}

		// Navigate after cookie is set using SvelteKit's goto
		const targetUrl = getLanguageUrl(langCode);
		try {
			await goto(targetUrl, { invalidateAll: true });
		} catch (error) {
			console.error('Navigation error:', error);
			// Fallback to direct navigation if goto fails
			window.location.href = targetUrl;
		}
	}
</script>

{#if shouldRender}
	<nav class="language-switcher flex items-center" aria-label="Language selection">
		{#each availableLanguages as lang, index}
			{@const isCurrentLang = lang === currentLang}
			{@const isLast = index === availableLanguages.length - 1}
			<a
				href={getLanguageUrl(lang)}
				class="lang-link"
				class:lang-link--current={isCurrentLang}
				class:lang-link--separator={!isLast}
				aria-current={isCurrentLang ? 'true' : undefined}
				aria-label={isCurrentLang
					? `Current language: ${getNativeName(lang)}`
					: `Switch to ${getNativeName(lang)}`}
				onclick={(event) => handleClick(event, lang)}
			>
				{getNativeName(lang)}
			</a>
		{/each}
	</nav>
{/if}

<style>
	.lang-link {
		color: var(--nav-panel-bg, #0097a7);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.lang-link:hover {
		color: var(--nav-active-indicator, #1f2937);
	}

	.lang-link:focus-visible {
		outline: 2px solid var(--nav-focus-color, #0097a7);
		outline-offset: 2px;
		border-radius: 4px;
	}

	.lang-link--current {
		font-weight: 600;
		color: var(--nav-active-indicator, #1f2937);
	}

	.lang-link--separator::after {
		content: '|';
		margin-inline: 0.375rem;
		font-weight: 400;
		color: var(--nav-panel-bg, #0097a7);
	}
</style>
