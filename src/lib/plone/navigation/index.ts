/**
 * Navigation components exports
 *
 * This module exports the unified Navigation component and its sub-components
 * for the multi-level mega menu / mobile accordion navigation system.
 */

export { default as Navigation } from './Navigation.svelte';
export { default as MegaNav } from './MegaNav.svelte';
export { default as MobileNav } from './MobileNav.svelte';

export type { NavItem, NavLevel, NavigationData, PloneNavItem, NavigationResponse } from './types';

export { fetchNavigation, transformNavItem, transformNavigation, DEFAULT_NAV_DEPTH } from './api';
