/**
 * Debug script to check how the Plone API handles b_size parameter
 * Run with: node tests/debug/check-api-batch.mjs
 */

const API_PATH = process.env.API_PATH || 'http://localhost:8080/Plone';

async function checkApiResponse() {
  console.log(`Testing API at: ${API_PATH}\n`);

  // First, get the home page to see listing blocks
  try {
    const homeRes = await fetch(`${API_PATH}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!homeRes.ok) {
      console.error(`Failed to fetch home page: ${homeRes.status}`);
      return;
    }

    const homeData = await homeRes.json();
    console.log('=== Home Page Blocks ===');

    const blocks = homeData.blocks || {};
    const blocksLayout = homeData.blocks_layout?.items || [];

    // Find listing blocks
    for (const blockId of blocksLayout) {
      const block = blocks[blockId];
      if (block?.['@type'] === 'listing') {
        console.log(`\nListing Block: ${blockId}`);
        console.log(`  Headline: ${block.headline || 'None'}`);
        console.log(`  Variation: ${block.variation || 'default'}`);
        console.log(`  b_size (direct): ${block.b_size}`);
        console.log(`  b_size (in querystring): ${block.querystring?.b_size}`);
        console.log(`  limit (in querystring): ${block.querystring?.limit}`);
        console.log(`  Query:`, JSON.stringify(block.querystring?.query, null, 2));

        // Now fetch the listing data with b_size
        if (block.querystring?.query?.length > 0) {
          const bSize = block.b_size || block.querystring?.b_size || 10;
          console.log(`\n  Using batch size: ${bSize}`);

          // Make the querystring-search API call
          const searchRes = await fetch(`${API_PATH}/@querystring-search`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: block.querystring.query,
              b_start: 0,
              b_size: bSize,
              ...(block.querystring.sort_on && { sort_on: block.querystring.sort_on }),
              ...(block.querystring.sort_order && { sort_order: block.querystring.sort_order }),
              ...(block.querystring.limit && { limit: block.querystring.limit })
            })
          });

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            console.log(`  API returned ${searchData.items?.length || 0} items`);
            console.log(`  Total results: ${searchData.items_total || searchData.total || 'unknown'}`);
            console.log(`  Items titles:`);
            (searchData.items || []).forEach((item, i) => {
              console.log(`    ${i + 1}. ${item.title}`);
            });

            // Compare with expected
            if ((searchData.items?.length || 0) > bSize) {
              console.log(`\n  ⚠️  WARNING: API returned MORE items (${searchData.items.length}) than b_size (${bSize})!`);
            } else if ((searchData.items?.length || 0) <= bSize) {
              console.log(`\n  ✓ API correctly returned ${searchData.items?.length || 0} items (b_size: ${bSize})`);
            }
          } else {
            console.log(`  Failed to fetch search results: ${searchRes.status}`);
          }
        }
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkApiResponse();
