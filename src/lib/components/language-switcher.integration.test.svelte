<script lang="ts">
	import type { NavItem } from '$lib/plone/navigation';
	import { SiteHeader, LanguageSwitcher } from '$lib/components';

	interface Translation {
		language: string;
		'@id': string;
	}

	interface Props {
		navigation: NavItem[];
		currentPath: string;
		availableLanguages: string[];
		currentLang: string;
		translations: Translation[];
		onSwitch?: (lang: string) => void;
	}

	let {
		navigation,
		currentPath,
		availableLanguages,
		currentLang,
		translations,
		onSwitch
	}: Props = $props();

	let isMultilingual = $derived(availableLanguages.length > 1);
</script>

<SiteHeader {navigation} {currentPath}>
	{#snippet utility()}
		{#if isMultilingual}
			<LanguageSwitcher {availableLanguages} {currentLang} {translations} {onSwitch} />
		{/if}
	{/snippet}
</SiteHeader>
