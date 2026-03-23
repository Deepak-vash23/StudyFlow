import fs from 'fs';

let content = fs.readFileSync('src/pages/Landing.jsx', 'utf8');

// The converted button tags lost their block/inline-block formatting when turned to Links.
// To fix the navbar buttons and other page CTA buttons being unclickable or misaligned:
content = content.replace(/className="bg-gradient-to-br/g, 'className="inline-block text-center bg-gradient-to-br');
content = content.replace(/<button([^>]*)type="submit"([^>]*)>Send Inquiry<\/button>/g, '<button$1type="button" onClick={(e) => { e.preventDefault(); alert("Thanks for the inquiry!"); }}$2>Send Inquiry</button>');

fs.writeFileSync('src/pages/Landing.jsx', content);
console.log('Fixed inline-block and forms');
