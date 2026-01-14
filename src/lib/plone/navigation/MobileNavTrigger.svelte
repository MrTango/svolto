<script lang="ts">
	interface Props {
		isOpen: boolean;
		onclick: () => void;
	}

	let { isOpen, onclick }: Props = $props();
</script>

<button
	type="button"
	class="nav-mobile__trigger"
	class:nav-mobile__trigger--open={isOpen}
	aria-expanded={isOpen}
	aria-label="Toggle navigation menu"
	{onclick}
>
	<span class="nav-mobile__trigger-icon" aria-hidden="true">
		<span class="nav-mobile__trigger-line nav-mobile__trigger-line--1"></span>
		<span class="nav-mobile__trigger-line nav-mobile__trigger-line--2"></span>
		<span class="nav-mobile__trigger-line nav-mobile__trigger-line--3"></span>
	</span>
</button>

<style>
	.nav-mobile__trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		position: relative;
		z-index: var(--nav-mobile-trigger-z-index, 1001);
	}

	.nav-mobile__trigger:focus-visible {
		outline: 2px solid var(--nav-mobile-trigger-color, #0097a7);
		outline-offset: 2px;
		border-radius: 4px;
	}

	.nav-mobile__trigger--open:focus-visible {
		outline-color: var(--nav-mobile-trigger-color-open, #ffffff);
	}

	.nav-mobile__trigger-icon {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 24px;
		height: 18px;
		position: relative;
	}

	.nav-mobile__trigger-line {
		display: block;
		width: 100%;
		height: 2px;
		background-color: var(--nav-mobile-trigger-color, #0097a7);
		border-radius: 1px;
		transition:
			transform 0.3s ease,
			opacity 0.3s ease,
			background-color 0.3s ease;
		position: absolute;
		left: 0;
	}

	.nav-mobile__trigger-line--1 {
		top: 0;
	}

	.nav-mobile__trigger-line--2 {
		top: 50%;
		transform: translateY(-50%);
	}

	.nav-mobile__trigger-line--3 {
		bottom: 0;
	}

	/* Hamburger to X transformation - also change color when open */
	.nav-mobile__trigger--open .nav-mobile__trigger-line {
		background-color: var(--nav-mobile-trigger-color-open, #ffffff);
	}

	.nav-mobile__trigger--open .nav-mobile__trigger-line--1 {
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
	}

	.nav-mobile__trigger--open .nav-mobile__trigger-line--2 {
		opacity: 0;
	}

	.nav-mobile__trigger--open .nav-mobile__trigger-line--3 {
		bottom: 50%;
		transform: translateY(50%) rotate(-45deg);
	}

	/* Hide on desktop */
	@media (min-width: 1024px) {
		.nav-mobile__trigger {
			display: none;
		}
	}
</style>
