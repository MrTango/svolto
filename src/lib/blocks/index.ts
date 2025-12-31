import DescriptionBlockView from './description/DescriptionBlockView.svelte';
import GridBlockView from './grid/GridBlockView.svelte';
import ImageBlockView from './image/ImageBlockView.svelte';
import IntroductionBlockView from './introduction/IntroductionBlockView.svelte';
import ListingBlockView from './listing/ListingBlockView.svelte';
import SlateBlockView from './slate/SlateBlockView.svelte';
import SlateTableBlockView from './slateTable/SlateTableBlockView.svelte';
import TeaserBlockView from './teaser/TeaserBlockView.svelte';
import TitleBlockView from './title/TitleBlockView.svelte';
import VideoBlockView from './video/VideoBlockView.svelte';

const blocks = {
	description: {
		id: 'description',
		title: 'Description',
		view: DescriptionBlockView
	},
	gridBlock: {
		id: 'gridBlock',
		title: 'Grid',
		view: GridBlockView
	},
	image: {
		id: 'image',
		title: 'Image',
		view: ImageBlockView
	},
	introduction: {
		id: 'introduction',
		title: 'Introduction',
		view: IntroductionBlockView
	},
	listing: {
		id: 'listing',
		title: 'Listing',
		view: ListingBlockView
	},
	slate: {
		id: 'slate',
		title: 'Slate',
		view: SlateBlockView
	},
	slateTable: {
		id: 'slateTable',
		title: 'Slate Table',
		view: SlateTableBlockView
	},
	teaser: {
		id: 'teaser',
		title: 'Teaser',
		view: TeaserBlockView
	},
	title: {
		id: 'title',
		title: 'Title',
		view: TitleBlockView
	},
	video: {
		id: 'video',
		title: 'Video',
		view: VideoBlockView
	}
};

export default blocks;
