import { writable } from 'svelte/store';

function createLcpTracker() {
	const { subscribe, set, update } = writable(false);

	return {
		subscribe,
		claim(): boolean {
			let claimed = false;
			update((alreadyClaimed) => {
				if (!alreadyClaimed) {
					claimed = true;
					return true;
				}
				return alreadyClaimed;
			});
			return claimed;
		},
		reset() {
			set(false);
		}
	};
}

export const lcpImageClaimed = createLcpTracker();
