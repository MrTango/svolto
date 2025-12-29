// Simple script to fetch page via SSR and look at full HTML
import http from 'http';

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Fetching http://localhost:5173/sample-page...\n');
    const html = await fetch('http://localhost:5173/sample-page');

    // Print a portion of the HTML
    console.log('=== FIRST 5000 CHARS OF HTML ===');
    console.log(html.substring(0, 5000));

    console.log('\n=== HTML LENGTH ===');
    console.log(html.length + ' characters');

    // Look for block.image class
    if (html.includes('block image')) {
      console.log('\n=== Found "block image" ===');
      const idx = html.indexOf('block image');
      console.log('Context: ' + html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 500)));
    }

    // Look for block teaser class
    if (html.includes('block teaser')) {
      console.log('\n=== Found "block teaser" ===');
      const idx = html.indexOf('block teaser');
      console.log('Context: ' + html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 500)));
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
