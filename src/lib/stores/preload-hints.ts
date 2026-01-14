import { writable } from 'svelte/store';

export interface PreloadHint {
	srcset: string;
	sizes: string;
	src: string;
}

function createPreloadHintsStore() {
	const { subscribe, set, update } = writable<PreloadHint[]>([]);

	return {
		subscribe,
		addHint(hint: PreloadHint) {
			update((hints) => {
				if (hints.some((h) => h.src === hint.src)) {
					return hints;
				}
				return [...hints, hint];
			});
		},
		reset() {
			set([]);
		}
	};
}

export const preloadHints = createPreloadHintsStore();

export function addPreloadHint(srcset: string, sizes: string, src: string): void {
	preloadHints.addHint({ srcset, sizes, src });
}
