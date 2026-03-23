import fs from 'fs';

let content = fs.readFileSync('src/pages/Landing.jsx', 'utf8');

// Replace the specific navbar block
content = content.replace(
    /<div className="hidden md:flex items-center gap-10 font-body font-medium text-sm tracking-wide">[\s\S]*?<\/div>/,
    `<div className="hidden md:flex items-center gap-10 font-body font-medium text-sm tracking-wide">
<a className="text-l-on-surface-variant font-bold border-b-2 border-transparent hover:text-l-primary hover:border-l-primary pb-1 transition-all duration-300" href="#">Home</a>
<a className="text-l-on-surface-variant font-bold border-b-2 border-transparent hover:text-l-primary hover:border-l-primary pb-1 transition-all duration-300" href="#about">About</a>
</div>`
);

// Replace the footer home link
content = content.replace(
    /<Link className="hover:text-l-primary transition-colors" to="\/">Home<\/Link>/g,
    `<a className="hover:text-l-primary transition-colors" href="#">Home</a>`
);

fs.writeFileSync('src/pages/Landing.jsx', content);
console.log('Fixed nav links');
