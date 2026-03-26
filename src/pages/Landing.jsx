import React from 'react';
import { Link } from 'react-router-dom';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';

export default function Landing() {
  return (
    <div className="bg-l-background text-l-on-surface antialiased selection:bg-l-primary/30 selection:text-l-primary" style={{
        backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(167, 139, 250, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.03) 0%, transparent 50%)',
        fontFamily: "'Inter', sans-serif"
    }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
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
      `}</style>
      
{/* TopNavBar */}
<nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 glass-panel rounded-full px-8 py-3 shadow-[0px_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300">
<div className="flex justify-between items-center max-w-7xl mx-auto">
<div className="text-2xl font-black tracking-tighter text-l-on-surface font-headline">
            StudyFlow
        </div>
<div className="hidden md:flex items-center gap-10 font-body font-medium text-sm tracking-wide">
<a className="text-l-on-surface-variant font-bold border-b-2 border-transparent hover:text-l-primary hover:border-l-primary pb-1 transition-all duration-300" href="#">Home</a>
<a className="text-l-on-surface-variant font-bold border-b-2 border-transparent hover:text-l-primary hover:border-l-primary pb-1 transition-all duration-300" href="#about">About</a>
</div>
<Link to="/login" className="inline-block text-center bg-gradient-to-br from-l-primary to-l-secondary text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 transition-all duration-300">Get Started</Link>
</div>
</nav>
<main className="pt-32">
{/* Hero Section */}
<section className="relative px-8 py-20 lg:py-40 max-w-7xl mx-auto">
<div className="grid lg:grid-cols-2 gap-20 items-center">
<div className="z-10">
<h1 className="text-6xl lg:text-8xl font-black tracking-tight text-l-on-surface mb-8 leading-[1.1] font-headline">
                The Master’s <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-l-primary via-l-secondary to-l-tertiary">Focus Tool</span>
</h1>
<p className="text-xl text-l-on-surface-variant mb-12 max-w-xl leading-relaxed font-light">
                Elevate your academic performance with StudyFlow. A premium digital sanctuary meticulously crafted for deep work and intellectual mastery.
            </p>
<div className="flex flex-wrap gap-6">
<Link to="/login" className="inline-block text-center bg-gradient-to-br from-l-primary to-l-secondary text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] active:scale-95 transition-all">Start Your Journey</Link>
<button className="bg-l-surface-container-high border border-l-outline-variant text-l-on-surface px-10 py-5 rounded-full font-bold text-lg hover:bg-l-surface-bright transition-all">
                    The Philosophy
                </button>
</div>
</div>
<div className="relative group perspective-1000">
<div className="absolute -inset-10 bg-l-primary/10 blur-[100px] rounded-full group-hover:bg-l-primary/20 transition-all duration-1000"></div>
<div className="relative animate-float">
<img alt="StudyFlow Interface" className="w-full rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] transform rotate-2 hover:rotate-0 transition-transform duration-700" src="/hero-interface.png"/>

</div>
</div>
</div>
</section>
{/* Features Section */}
<section className="px-8 py-32 bg-l-surface-container-lowest border-y border-l-outline-variant/30">
<div className="max-w-7xl mx-auto">
<div className="mb-24 text-center">
<h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-6 font-headline">The Royal Workflow</h2>
<p className="text-l-on-surface-variant text-xl font-light">Elegance meets efficiency in every feature.</p>
</div>
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
{/* Feature 1 */}
<div className="p-10 bg-l-surface border border-l-outline-variant/40 rounded-[2.5rem] hover:border-l-primary/50 transition-all group royal-glow">
<div className="w-16 h-16 bg-l-primary/10 rounded-2xl flex items-center justify-center text-l-primary mb-10 group-hover:scale-110 transition-transform">
<CalendarMonthOutlinedIcon sx={{ fontSize: 36 }} />
</div>
<h3 className="text-2xl font-bold mb-4 font-headline text-l-on-surface">Task Planning</h3>
<p className="text-l-on-surface-variant leading-relaxed">Curate your schedule with sovereign precision and priority tagging.</p>
</div>
{/* Feature 2 */}
<div className="p-10 bg-l-surface border border-l-outline-variant/40 rounded-[2.5rem] hover:border-l-tertiary/50 transition-all group royal-glow">
<div className="w-16 h-16 bg-l-tertiary/10 rounded-2xl flex items-center justify-center text-l-tertiary mb-10 group-hover:scale-110 transition-transform">
<TimerOutlinedIcon sx={{ fontSize: 36 }} />
</div>
<h3 className="text-2xl font-bold mb-4 font-headline text-l-on-surface">Focus Timer</h3>
<p className="text-l-on-surface-variant leading-relaxed">Immerse yourself in work with our distractions-free interval master.</p>
</div>
{/* Feature 3 */}
<div className="p-10 bg-l-surface border border-l-outline-variant/40 rounded-[2.5rem] hover:border-l-secondary/50 transition-all group royal-glow">
<div className="w-16 h-16 bg-l-secondary/10 rounded-2xl flex items-center justify-center text-l-secondary mb-10 group-hover:scale-110 transition-transform">
<InsightsOutlinedIcon sx={{ fontSize: 36 }} />
</div>
<h3 className="text-2xl font-bold mb-4 font-headline text-l-on-surface">Analytics</h3>
<p className="text-l-on-surface-variant leading-relaxed">Visualize your intellectual growth with deep-data productivity reports.</p>
</div>
{/* Feature 4 */}
<div className="p-10 bg-l-surface border border-l-outline-variant/40 rounded-[2.5rem] hover:border-l-on-surface-variant transition-all group royal-glow">
<div className="w-16 h-16 bg-l-outline/10 rounded-2xl flex items-center justify-center text-l-on-surface-variant mb-10 group-hover:scale-110 transition-transform">
<CloudOffOutlinedIcon sx={{ fontSize: 36 }} />
</div>
<h3 className="text-2xl font-bold mb-4 font-headline text-l-on-surface">Offline Sanctuary</h3>
<p className="text-l-on-surface-variant leading-relaxed">Your focus shouldn't depend on a connection. Work anywhere, anytime.</p>
</div>
</div>
</div>
</section>
{/* About Section */}
<section className="px-8 py-32 max-w-7xl mx-auto" id="about">
<div className="grid lg:grid-cols-2 gap-24 items-center">
<div className="order-2 lg:order-1 relative">
<div className="absolute -inset-4 bg-gradient-to-tr from-l-primary to-l-secondary opacity-20 blur-3xl rounded-[3rem]"></div>
<img alt="Student studying in a focused environment" className="relative rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] filter grayscale brightness-75 hover:grayscale-0 transition-all duration-1000 border border-white/5" data-alt="A focused student studying in a modern minimalist room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApFOUYvCoYz8OWEz-okSWvXd7NS9up-D6oy4fV53Y15mOZEeBmsBiulNEP1hxprTGimK5f0MrAPBfwsd74_spY7Onwy9JfzQIodo7v5WCRhpuLSkyiynOoVZq0kbNAXvU8vZHhyQfVbrdG1G4iZ1jh0yJLoUllV6xzTHMQ14pp3lBVQB9iJg5Q4hm1IoMYtHCS1uJKD5GaMRxjTk34c3y6woGUuY6MHZeWdVgvHQN4PNQzGVGU-bLR3dQyL5qmNf9sf6ZDVNvD_g8"/>
<div className="absolute -bottom-10 -right-10 bg-l-surface-container-high border border-l-primary/30 p-8 rounded-[2rem] shadow-2xl hidden md:block backdrop-blur-xl">
<p className="text-l-primary font-black text-4xl font-headline">98%</p>
<p className="text-l-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Focus Rate Improvement</p>
</div>
</div>
<div className="order-1 lg:order-2">
<h2 className="text-5xl font-black mb-10 leading-tight font-headline">The StudyFlow <br/>Manifesto</h2>
<p className="text-l-on-surface-variant text-xl leading-relaxed mb-8 font-light">
                StudyFlow was born from the realization that modern students are besieged by tools that demand more attention than the work itself.
            </p>
<p className="text-l-on-surface-variant text-xl leading-relaxed mb-12 font-light">
                We believe in the nobility of deep work. Our platform is designed as an invisible companion—providing structure without noise, and power without complexity.
            </p>
<div className="flex items-center gap-8">
<div className="h-px flex-1 bg-gradient-to-r from-transparent to-l-outline-variant"></div>
<span className="text-l-tertiary font-headline text-xl italic tracking-widest">Noble Focus.</span>
<div className="h-px flex-1 bg-gradient-to-l from-transparent to-l-outline-variant"></div>
</div>
</div>
</div>
</section>
{/* How It Works Section (Bento Style) */}
<section className="px-8 py-32 bg-l-surface-container-low border-t border-l-outline-variant/20">
<div className="max-w-7xl mx-auto">
<h2 className="text-5xl font-black text-center mb-24 font-headline">The Path to Sovereignty</h2>
<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
{/* Step 1 */}
<div className="bg-l-surface p-12 rounded-[2.5rem] border border-l-outline-variant/30 flex flex-col justify-between min-h-[350px] royal-glow hover:translate-y-[-8px] transition-transform">
<span className="text-7xl font-black text-l-outline-variant/10 font-headline">I</span>
<div>
<h3 className="text-2xl font-bold mb-4 font-headline">Intellectual Capture</h3>
<p className="text-l-on-surface-variant">Release the burden of memory. Record every objective with ease.</p>
</div>
</div>
{/* Step 2 */}
<div className="bg-l-surface-container-high p-12 rounded-[2.5rem] border border-l-primary/20 flex flex-col justify-between min-h-[350px] shadow-2xl hover:translate-y-[-8px] transition-transform">
<span className="text-7xl font-black text-l-primary/10 font-headline">II</span>
<div>
<h3 className="text-2xl font-bold mb-4 font-headline">Strategic Alignment</h3>
<p className="text-l-on-surface-variant">Map your day. Command your hours before they command you.</p>
</div>
</div>
{/* Step 3 */}
<div className="bg-l-surface p-12 rounded-[2.5rem] border border-l-outline-variant/30 flex flex-col justify-between min-h-[350px] royal-glow hover:translate-y-[-8px] transition-transform">
<span className="text-7xl font-black text-l-outline-variant/10 font-headline">III</span>
<div>
<h3 className="text-2xl font-bold mb-4 font-headline">Deep Engagement</h3>
<p className="text-l-on-surface-variant">Enter the state of Flow. Total immersion until the work is complete.</p>
</div>
</div>
{/* Step 4 */}
<div className="bg-l-surface p-12 rounded-[2.5rem] border border-l-outline-variant/30 flex flex-col justify-between min-h-[350px] royal-glow hover:translate-y-[-8px] transition-transform">
<span className="text-7xl font-black text-l-outline-variant/10 font-headline">IV</span>
<div>
<h3 className="text-2xl font-bold mb-4 font-headline">Retrospect</h3>
<p className="text-l-on-surface-variant">Reflect on your progress and refine your pursuit of excellence.</p>
</div>
</div>
</div>
</div>
</section>
{/* CTA Section */}
<section className="px-8 py-40">
<div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/5 rounded-[4rem] p-16 lg:p-24 text-center relative overflow-hidden shadow-[0_100px_100px_-50px_rgba(0,0,0,0.8)]">
<div className="absolute top-0 right-0 w-96 h-96 bg-l-primary/20 blur-[120px] rounded-full -mr-48 -mt-48"></div>
<div className="absolute bottom-0 left-0 w-96 h-96 bg-l-secondary/10 blur-[120px] rounded-full -ml-48 -mb-48"></div>
<h2 className="text-4xl lg:text-7xl font-black mb-12 leading-tight font-headline">Reclaim your attention. <br/>Master your craft.</h2>
<Link to="/login" className="inline-block text-center bg-gradient-to-br from-l-primary via-l-secondary to-l-primary text-white px-12 py-6 rounded-full font-bold text-2xl hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] transition-all transform hover:scale-105 active:scale-95">Ascend with StudyFlow</Link>
</div>
</section>
{/* Contact Section */}
<section className="px-8 py-32 max-w-6xl mx-auto" id="contact">
<div className="grid lg:grid-cols-2 gap-24">
<div>
<h2 className="text-5xl font-black mb-8 font-headline">Inquiries</h2>
<p className="text-l-on-surface-variant text-xl mb-12 leading-relaxed font-light">
                Our team of success specialists is ready to assist you in architecting your ultimate study environment.
            </p>
<div className="space-y-8">
<div className="flex items-center gap-6">
<div className="w-14 h-14 bg-l-surface-container-highest rounded-2xl flex items-center justify-center text-l-primary royal-glow">
<MailOutlinedIcon sx={{ fontSize: 24 }} />
</div>
<span className="text-xl font-medium text-l-on-surface">concierge@studyflow.app</span>
</div>
</div>
</div>
<form className="space-y-8 glass-panel rounded-[3rem] p-12 border border-white/10 shadow-2xl">
<div className="space-y-2">
<label className="block text-xs font-bold uppercase tracking-widest text-l-on-surface-variant ml-2">Name</label>
<input className="w-full bg-l-surface-container-highest/50 border border-white/5 rounded-2xl px-6 py-4 text-l-on-surface focus:ring-2 focus:ring-l-primary focus:border-transparent transition-all" placeholder="Your full name" type="text"/>
</div>
<div className="space-y-2">
<label className="block text-xs font-bold uppercase tracking-widest text-l-on-surface-variant ml-2">Email</label>
<input className="w-full bg-l-surface-container-highest/50 border border-white/5 rounded-2xl px-6 py-4 text-l-on-surface focus:ring-2 focus:ring-l-primary focus:border-transparent transition-all" placeholder="your@institution.edu" type="email"/>
</div>
<div className="space-y-2">
<label className="block text-xs font-bold uppercase tracking-widest text-l-on-surface-variant ml-2">Message</label>
<textarea className="w-full bg-l-surface-container-highest/50 border border-white/5 rounded-2xl px-6 py-4 text-l-on-surface focus:ring-2 focus:ring-l-primary focus:border-transparent transition-all" placeholder="Describe your vision..." rows="4"></textarea>
</div>
<button className="w-full bg-gradient-to-r from-l-primary to-l-secondary text-white py-5 rounded-2xl font-bold text-lg hover:shadow-lg active:scale-[0.98] transition-all" type="button" onClick={(e) => { e.preventDefault(); alert("Thanks for the inquiry!"); }}>Send Inquiry</button>
</form>
</div>
</section>
</main>
{/* Footer */}
<footer className="bg-l-surface-container-lowest border-t border-l-outline-variant/30 w-full py-20 px-8">
<div className="flex flex-col md:flex-row justify-between items-center gap-12 max-w-7xl mx-auto">
<div className="text-3xl font-black text-l-on-surface font-headline">StudyFlow</div>
<div className="flex flex-wrap justify-center gap-12 font-body text-sm font-medium text-l-on-surface-variant">
<a className="hover:text-l-primary transition-colors" href="#">Home</a>
<a className="hover:text-l-primary transition-colors" href="#about">About</a>
<Link className="hover:text-l-primary transition-colors" to="/login">Privacy</Link>
<Link className="hover:text-l-primary transition-colors" to="/login">Terms</Link>
<Link className="hover:text-l-primary transition-colors" to="/login">Twitter</Link>
</div>
<div className="text-l-on-surface-variant text-xs tracking-widest text-center md:text-right font-light">
            © 2024 STUDYFLOW. THE DISTRACTIONLESS SANCTUARY.
        </div>
</div>
</footer>

    </div>
  );
}
