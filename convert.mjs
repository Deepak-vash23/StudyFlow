import fs from 'fs';

const html = fs.readFileSync('homepage.html', 'utf8');

let jsx = html;

// Extract body inner content
const bodyMatch = jsx.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) throw new Error("No body found");
let bodyContent = bodyMatch[1];
const bodyTagMatch = jsx.match(/<body([^>]*)>/i);
const bodyAttrs = bodyTagMatch ? bodyTagMatch[1] : '';

// Function to convert attributes
function convertAttrs(str) {
    str = str.replace(/class="/g, 'className="');
    str = str.replace(/for="/g, 'htmlFor="');
    
    // Close unclosed tags
    str = str.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
    str = str.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
    str = str.replace(/<br>/g, '<br />');
    
    return str;
}

bodyContent = convertAttrs(bodyContent);

// Add prefix l- to Tailwind colors used in homepage.html
const colorClasses = [
    'primary', 'secondary', 'tertiary', 'surface',
    'surface-container-high', 'surface-container-low', 'surface-container-lowest',
    'surface-container-highest', 'surface-bright', 'surface-variant',
    'on-surface', 'on-surface-variant', 'outline', 'outline-variant', 'background'
];

// Regex to replace all tailwind color classes with l- prefixed
colorClasses.forEach(color => {
    const rx = new RegExp(`(text|bg|border|from|to|via|ring)-(${color})([^\\w\\-])`, 'g');
    bodyContent = bodyContent.replace(rx, `$1-l-$2$3`);
    // Also replace alpha channels like bg-primary/10
    const rx2 = new RegExp(`(text|bg|border|from|to|via|ring)-(${color})/(\\d+)`, 'g');
    bodyContent = bodyContent.replace(rx2, `$1-l-$2/$3`);
});

const out = `import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-l-background text-l-on-surface antialiased selection:bg-l-primary/30 selection:text-l-primary" style={{
        backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(167, 139, 250, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.03) 0%, transparent 50%)',
        fontFamily: "'Inter', sans-serif"
    }}>
      <style>{\`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .royal-glow {
            box-shadow: 0 0 50px -12px rgba(99, 102, 241, 0.3);
        }
        .glass-panel {
            background: rgba(22, 22, 53, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
      \`}</style>
      ${bodyContent}
    </div>
  );
}
`;

// Replace HTML comments to JSX comments
let finalized = out.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

// Replace standard links
finalized = finalized.replace(/<a href="#"/g, '<Link to="/login"');
finalized = finalized.replace(/<\/a>/g, '</Link>');

fs.writeFileSync('src/pages/Landing.jsx', finalized);
console.log("Written to src/pages/Landing.jsx");
