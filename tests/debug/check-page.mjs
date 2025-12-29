// Simple script to fetch page via SSR and look for image issues
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

    // Find picture and img elements
    const pictureRegex = /<picture[^>]*>[\s\S]*?<\/picture>/gi;
    const imgRegex = /<img[^>]*>/gi;
    const sourceRegex = /<source[^>]*>/gi;

    const pictures = html.match(pictureRegex) || [];
    const imgs = html.match(imgRegex) || [];
    const sources = html.match(sourceRegex) || [];

    console.log('=== PICTURE ELEMENTS (' + pictures.length + ') ===');
    pictures.forEach((p, i) => {
      console.log('Picture ' + (i + 1) + ':\n' + p + '\n---');
    });

    console.log('\n=== IMG ELEMENTS (' + imgs.length + ') ===');
    imgs.forEach((img, i) => {
      console.log('Img ' + (i + 1) + ': ' + img);
    });

    console.log('\n=== SOURCE ELEMENTS (' + sources.length + ') ===');
    sources.forEach((src, i) => {
      console.log('Source ' + (i + 1) + ': ' + src);
    });

    // Check for error messages
    if (html.includes('error') || html.includes('Error')) {
      console.log('\n=== Potential errors found in HTML ===');
      const lines = html.split('\n');
      lines.forEach((line, i) => {
        if (line.toLowerCase().includes('error')) {
          console.log('Line ' + (i + 1) + ': ' + line.trim().substring(0, 200));
        }
      });
    }

    // Look for image-related class names
    if (html.includes('block image') || html.includes('teaser-image')) {
      console.log('\n=== Found image-related classes ===');
      if (html.includes('block image')) console.log('- Found "block image" class');
      if (html.includes('teaser-image')) console.log('- Found "teaser-image" class');
      if (html.includes('image-wrapper')) console.log('- Found "image-wrapper" class');
    }

    // Check for srcset attribute
    const srcsetMatch = html.match(/srcset="([^"]*)"/gi);
    if (srcsetMatch) {
      console.log('\n=== SRCSET ATTRIBUTES ===');
      srcsetMatch.forEach((s, i) => {
        console.log('Srcset ' + (i + 1) + ': ' + s);
      });
    }

    // Check for img src attribute
    const srcMatch = html.match(/src="([^"]*)"/gi);
    if (srcMatch) {
      console.log('\n=== SRC ATTRIBUTES (' + srcMatch.length + ') ===');
      srcMatch.slice(0, 20).forEach((s, i) => {
        if (s.includes('image') || s.includes('@@images') || s.includes('.jpg') || s.includes('.png') || s.includes('.jpeg')) {
          console.log('Src ' + (i + 1) + ': ' + s);
        }
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
