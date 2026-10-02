import { motion, useReducedMotion } from 'framer-motion';
import { Brain, ChartNoAxesCombined, Code2, Cog, FlaskConical, Leaf, PenTool } from 'lucide-react';
import { schoolInfo, type Category, type School } from '../data/majors';

export function Brand({ compact = false }: { compact?: boolean }) {
  return <span className="brand">
    <span className="brand-symbol"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 3.5 19.8 12.2 28.5 16 19.8 19.8 16 28.5 12.2 19.8 3.5 16 12.2 12.2 16 3.5Z" fill="currentColor" /><path d="m16 10 2 6-2 6-2-6 2-6Z" fill="#294D3E" /></svg></span>
    {!compact && <span className="brand-word">wayfinder<span className="brand-period">.</span></span>}
  </span>;
}

const categoryIcons = { Technology: Code2, Engineering: Cog, Business: ChartNoAxesCombined, Environment: Leaf, 'Natural sciences': FlaskConical, 'People & society': Brain, 'Arts & design': PenTool };
export const categoryClass = (category: Category) => ({ Technology: 'technology', Engineering: 'engineering', Business: 'business', Environment: 'environment', 'Natural sciences': 'science', 'People & society': 'people', 'Arts & design': 'design' })[category];

export function MajorIcon({ category, large = false }: { category: Category; large?: boolean }) {
  const Icon = categoryIcons[category];
  return <span className={`major-icon ${categoryClass(category)} ${large ? 'large' : ''}`}><Icon size={large ? 26 : 19} strokeWidth={1.65} /></span>;
}

export function SchoolMark({ school, full = false, large = false }: { school: School; full?: boolean; large?: boolean }) {
  return <span className={`school-display ${large ? 'large' : ''}`}>
    <span className={`school-mark ${school}`} aria-hidden="true">{school === 'osu' ? 'OSU' : 'O'}</span>
    {full && <span>{large ? schoolInfo[school].name : schoolInfo[school].short}</span>}
    {!full && <span className="sr-only">{schoolInfo[school].name}</span>}
  </span>;
}

export function CompassArt() {
  const reducedMotion = useReducedMotion();
  return <svg className="compass-art" viewBox="0 0 380 170" fill="none" aria-hidden="true">
    <defs><filter id="compass-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#294d3e" floodOpacity=".08" /></filter></defs>
    <g stroke="#CCD8C7" strokeWidth=".8" opacity=".8">
      <path d="M16 161c24-12 5-58 48-75s58 28 91 5S155 9 213-5s81 28 109 9 39-12 64 2" />
      <path d="M3 148c23-12 9-66 54-77s61 28 87 2S145-3 206-18s96 28 125 9" />
      <path d="M27 181c32-15 1-63 50-78s59 24 90 1 4-73 54-89 78 32 108 11 52-15 70 3" />
      <path d="M56 188c28-29 12-56 51-62s42 11 69-9 15-68 58-73 59 18 90 0 56-7 79 19" />
      <path d="M80 194c34-25 11-49 49-53s47 0 67-25 9-50 46-50 49 15 79 0 59 5 75 28" />
      <path d="M182 184c-12-22 17-32 26-52s8-44 34-43 36 8 64-4 67 14 82 34" />
      <path d="M204 185c-12-22 17-28 26-48s2-29 28-25 31-13 58-6 43 17 53 36" />
    </g>
    <path d="M62 171c-18-22 7-47 29-43 49 9 44-47 89-40" stroke="#F5F7F0" strokeWidth="13" />
    <path d="M62 171c-18-22 7-47 29-43 49 9 44-47 89-40" stroke="#6E8975" strokeWidth="1.8" strokeDasharray="4 5" strokeLinecap="round" />
    <motion.g animate={reducedMotion ? {} : { rotate: [-5, -1, -5], y: [0, -3, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '239px 82px' }}>
      <circle cx="239" cy="82" r="66" fill="#F9FAF4" stroke="#D7DFD0" filter="url(#compass-shadow)" />
      <circle cx="239" cy="82" r="57" stroke="#D5DDCF" strokeWidth=".8" />
      {Array.from({ length: 24 }, (_, i) => <line key={i} x1="239" y1="29" x2="239" y2={i % 3 === 0 ? '36' : '32'} stroke="#A1B19C" strokeWidth={i % 3 === 0 ? 1.2 : .7} transform={`rotate(${i * 15} 239 82)`} />)}
      <text x="239" y="48" textAnchor="middle" fontSize="10" fontFamily="sans-serif" fill="#3E5A45">N</text>
      <path d="m239 49 10 33-10 33-10-33 10-33Z" fill="#CDD8C5" transform="rotate(35 239 82)" />
      <path d="m239 49 10 33h-20l10-33Z" fill="#345640" transform="rotate(35 239 82)" />
      <path d="m239 49 0 33h-10l10-33Z" fill="#688269" transform="rotate(35 239 82)" />
      <circle cx="239" cy="82" r="4" fill="#F9FAF4" stroke="#557053" strokeWidth="1.5" />
      <text x="239" y="125" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#8D9B83">FIND YOUR WAY</text>
    </motion.g>
    <path d="m131 38 2.5 7.5L141 48l-7.5 2.5L131 58l-2.5-7.5L121 48l7.5-2.5L131 38Z" fill="#92A587" />
    <circle cx="338" cy="121" r="3" fill="#A5B497" />
  </svg>;
}

export function SidebarLandscape() {
  return <svg viewBox="0 0 180 78" fill="none" aria-hidden="true" className="sidebar-landscape">
    <path d="M1 65 45 26 70 49 96 12l42 45 20-18 23 26" stroke="#BEC9B9" strokeWidth="1.1" strokeLinejoin="round" />
    <path d="m79 37 17-25 15 16-9 1-6-6-7 14-10 0Z" fill="#EFF2E9" stroke="#BEC9B9" strokeWidth=".8" />
    <path d="M0 73c36-12 47 11 79 0s51-5 101-2" stroke="#CCD3C6" strokeWidth="1" />
    <path d="M84 74c-18-12 31-19 13-31" stroke="#91A384" strokeWidth="1" strokeDasharray="2 3" />
    <circle cx="96" cy="42" r="2.5" fill="#829874" />
    <path d="m21 48-7 12h14l-7-12Zm0 6-9 15h18l-9-15Z" fill="#E6EDE0" stroke="#ABBDA0" strokeWidth=".8" /><path d="M21 66v7" stroke="#ABBDA0" />
    <path d="m149 53-6 10h12l-6-10Zm0 5-8 13h16l-8-13Z" fill="#E6EDE0" stroke="#ABBDA0" strokeWidth=".8" /><path d="M149 69v4" stroke="#ABBDA0" />
  </svg>;
}