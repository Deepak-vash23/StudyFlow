import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#c8c5c0] font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 lg:px-12 py-5 max-w-[1400px] mx-auto">
        <div className="text-xl font-black tracking-tight text-[#1a1a2e]">
          ✦ StudyFlow
        </div>
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-[#1a1a2e]/70">
          <a href="#features" className="hover:text-[#1a1a2e] transition-colors">Features</a>
          <a href="#about" className="hover:text-[#1a1a2e] transition-colors">About</a>
          <a href="#stats" className="hover:text-[#1a1a2e] transition-colors">Stats</a>
        </div>
        <Link to="/login" className="flex items-center gap-2 bg-[#1a1a2e] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#2a2a4e] transition-colors">
          <span>GET STARTED</span>
          <span>↗</span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="px-4 lg:px-8 max-w-[1400px] mx-auto pb-8">

        {/* Hero Card */}
        <div className="relative bg-[#d8d3f0] rounded-[2.5rem] overflow-hidden px-8 lg:px-16 pt-16 pb-8 min-h-[480px] flex flex-col justify-center items-center text-center">
          
          {/* Decorative corner brackets */}
          <div className="absolute top-16 left-12 hidden lg:block">
            <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
              <path d="M60 0 L60 4 L4 4 L4 80" stroke="#555" strokeWidth="1.5" fill="none"/>
              <circle cx="60" cy="0" r="4" fill="#888"/>
            </svg>
          </div>
          <div className="absolute top-12 left-1/3 hidden lg:block">
            <svg width="2" height="60" viewBox="0 0 2 60" fill="none">
              <line x1="1" y1="0" x2="1" y2="60" stroke="#555" strokeWidth="1.5"/>
              <circle cx="1" cy="0" r="4" fill="#888"/>
              <circle cx="1" cy="60" r="4" fill="#888"/>
            </svg>
          </div>
          <div className="absolute bottom-24 left-16 hidden lg:block">
            <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#888"/></svg>
          </div>

          {/* Subtitle */}
          <p className="text-[#444] text-xs font-semibold tracking-[0.2em] uppercase mb-6">[ SMART STUDY EXPERIENCE ]</p>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1a1a2e] leading-[1.05] mb-10 max-w-4xl">
            Start <span className="inline-flex items-center align-middle bg-[#1a1a2e] text-white rounded-2xl px-4 py-2 text-3xl md:text-5xl lg:text-6xl mx-1">📊</span> manage<br/>
            tasks with ease
          </h1>
          
          {/* CTA Button */}
          <Link to="/login" className="inline-flex items-center gap-3 bg-[#d4f240] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#c8e636] hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
            Get Started <span className="text-xl">↗</span>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4" id="stats">
          
          {/* Rating Card */}
          <div className="md:col-span-3 bg-[#5b6bea] rounded-[2rem] p-8 flex flex-col justify-between min-h-[220px] text-white">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase opacity-80">[ RATING ]</p>
            <div className="flex items-end gap-3">
              <span className="text-7xl font-black leading-none">4.9</span>
              <span className="text-3xl mb-2">⭐</span>
            </div>
          </div>

          {/* Quote Card */}
          <div className="md:col-span-4 bg-[#e8e6e1] rounded-[2rem] p-8 flex items-center min-h-[220px]" id="about">
            <p className="text-2xl lg:text-3xl font-bold text-[#1a1a2e] leading-snug">
              Use the time to your own advantage every day
            </p>
          </div>

          {/* Tasks Done Card */}
          <div className="md:col-span-5 bg-[#2a2a3e] rounded-[2rem] p-8 flex flex-col justify-between min-h-[220px] relative overflow-hidden" id="features">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/60">[ TASKS DONE ]</p>
              <div className="bg-[#3a3a50] text-white/80 text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-1">
                Week <span className="text-[10px]">▾</span>
              </div>
            </div>
            <div>
              <p className="text-6xl lg:text-7xl font-black text-white leading-none mb-4">+22%</p>
              {/* Chart lines */}
              <svg className="w-full h-16" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none">
                <path d="M0 50 C50 45, 100 40, 150 35 C200 30, 220 20, 260 25 C300 30, 340 15, 400 10" stroke="#5b6bea" strokeWidth="2.5" fill="none"/>
                <path d="M0 55 C80 50, 130 48, 180 42 C230 36, 280 38, 320 30 C360 22, 380 25, 400 20" stroke="#d4f240" strokeWidth="2.5" fill="none"/>
              </svg>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
