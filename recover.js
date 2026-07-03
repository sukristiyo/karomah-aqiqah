const fs = require('fs');
const lines = fs.readFileSync('C:\\Users\\sukristiyo\\.gemini\\antigravity\\brain\\06df3991-db8e-451a-9059-a4c5a27d2608\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');

let bestMatch = "";
for (const line of lines) {
  if (line.includes('cat src/app/globals.css') && line.includes('Output:')) {
    try {
      const data = JSON.parse(line);
      const output = data.content;
      if (output && output.includes('Output:') && output.includes('.hero {')) {
         bestMatch = output.split('Output:')[1].trim();
      }
    } catch(e) {}
  }
}
if (bestMatch) {
  fs.writeFileSync('recovered2.css', bestMatch);
  console.log('Saved to recovered2.css! Length:', bestMatch.length);
} else {
  console.log('Not found');
}
