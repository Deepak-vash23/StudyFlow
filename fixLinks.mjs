import fs from 'fs';

let content = fs.readFileSync('src/pages/Landing.jsx', 'utf8');

// The original convert script blindly replaced all </a> with </Link>.
// We need to revert all </Link> to </a>, except where we actually want <Link>.

content = content.replace(/<\/Link>/g, '</a>');

// Now we manually replace the 'Home' and 'Login' links to use <Link>
// At line 32: <a className="..." href="#">Home</a>
content = content.replace(/<a([^>]*)href="#"([^>]*)>Home<\/a>/g, '<Link$1to="/"$2>Home</Link>');

// At line 35, 52, 185, we have <button> tags that we can make navigate to /login
content = content.replace(/<button([^>]*)>\s*Get Started\s*<\/button>/g, '<Link to="/login"$1>Get Started</Link>');
content = content.replace(/<button([^>]*)>\s*Start Your Journey\s*<\/button>/g, '<Link to="/login"$1>Start Your Journey</Link>');
content = content.replace(/<button([^>]*)>\s*Ascend with StudyFlow\s*<\/button>/g, '<Link to="/login"$1>Ascend with StudyFlow</Link>');

// Replace other generic <a href="#"> with <Link to="/login">
content = content.replace(/<a([^>]*)href="#"([^>]*)>/g, '<Link$1to="/login"$2>');
content = content.replace(/<Link([^>]*)to="\/login"([^>]*)>(.*?)<\/a>/g, '<Link$1to="/login"$2>$3</Link>');

// Remove style tag and instead rely on the global CSS (or leave it since it's scoped, but 'style' tag inside div is fine)
// We also need to change class= to className= for standard React if it was missed, but my previous script did that.

fs.writeFileSync('src/pages/Landing.jsx', content);
console.log('Fixed links in Landing.jsx');
