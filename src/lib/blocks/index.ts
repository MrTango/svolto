import ImageBlockView from "./image/ImageBlockView.svelte";
import SlateBlockView from "./slate/SlateBlockView.svelte";


const blocks = {
    image: {
        id: 'image',
        title: 'Image',
        // icon: 'icon',
        // group: 'common',
        view: ImageBlockView,
        // edit: null,
        // restricted: false,
        // mostUsed: true,
        // sidebarTab: 1,
        // defaultEvent: ''
    },
    slate: {
        id: 'slate',
        title: 'Slate',
        // icon: 'icon',
        // group: 'common',
        view: SlateBlockView,
        // edit: null,
        // restricted: false,
        // mostUsed: true,
        // sidebarTab: 1,
        // defaultEvent: ''
    }
};

export default blocks;