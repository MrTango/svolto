import ploneClient from '@plone/client';

const client = ploneClient.initialize({
  apiPath: 'http://backend:8080/Plone'
});

console.log('Client initialized');

const { getContent } = client;

const timeoutPromise = (promise, ms) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );
  return Promise.race([promise, timeout]);
};

try {
  console.log('Fetching content...');
  const data = await timeoutPromise(getContent({ path: '/' }), 10000);
  console.log('Response received, title:', data.title);
  console.log('Has blocks:', !!data.blocks);
  console.log('Block count:', Object.keys(data.blocks || {}).length);

  // Check for listing blocks
  const listingBlocks = [];
  for (const [blockId, blockData] of Object.entries(data.blocks || {})) {
    if (blockData['@type'] === 'listing') {
      listingBlocks.push({ blockId, querystring: blockData.querystring });
    }
  }
  console.log('Listing blocks found:', listingBlocks.length);
  if (listingBlocks.length > 0) {
    console.log('First listing block:', JSON.stringify(listingBlocks[0], null, 2));
  }
} catch (err) {
  console.error('Error:', err.message);
}
