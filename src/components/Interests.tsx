import { useMemo, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Atom, Check, ChevronDown, CircleHelp, Code2, Compass, FlaskConical, HandHeart, Hammer, Heart, Lightbulb, MessageCircle, Palette, PenLine, RotateCcw, Search, ShieldCheck, Sigma, Sprout, Target, Users, BriefcaseBusiness } from 'lucide-react';
import { allInterests, interestGroups, rankMajors, type InterestProfile, type RankingMode } from '../data/majors';
import { MajorIcon } from './Brand';

const icons = { problemSolving: Lightbulb, technology: Code2, numbers: Sigma, research: Search, creativity: Palette, design: Target, writing: PenLine, communication: MessageCircle, helping: HandHeart, socialImpact: Heart, nature: Sprout, science: Atom, handsOn: Hammer, leadership: Users, business: BriefcaseBusiness, structure: ShieldCheck };

function InterestRadar({ profile }: { profile: InterestProfile }) {
  const values = [
    (profile.problemSolving + profile.numbers + profile.research) / 3,
    (profile.technology + profile.handsOn) / 2,
    (profile.creativity + profile.design + profile.writing) / 3,
    (profile.helping + profile.communication + profile.leadership) / 3,
    (profile.socialImpact + profile.nature) / 2,
    (profile.science + profile.research) / 2,
  ];
  const labels = ['Analytical', 'Technical', 'Creative', 'People', 'Purpose', 'Discovery'];
  const point = (i: number, radius: number) => ({ x: 140 + Math.cos((i * 60 - 90) * Math.PI / 180) * radius, y: 107 + Math.sin((i * 60 - 90) * Math.PI / 180) * radius });
  const polygon = (scale: number) => values.map((_, i) => { const p = point(i, 71 * scale); return `${p.x},${p.y}`; }).join(' ');
  const active = values.map((v, i) => { const p = point(i, v * .71); return `${p.x},${p.y}`; }).join(' ');
  return <svg viewBox="0 0 280 215" className="interest-radar" role="img" aria-label={`Your interest shape: ${labels.map((label, i) => `${label} ${Math.round(values[i])}%`).join(', ')}`}>
    {[.25, .5, .75, 1].map(scale => <polygon key={scale} points={polygon(scale)} fill="none" stroke="#dce4d8" strokeWidth=".8" />)}
    {labels.map((label, i) => { const p = point(i, 71); const labelPoint = point(i, 96); return <g key={label}><line x1="140" y1="107" x2={p.x} y2={p.y} stroke="#e2e8de" strokeWidth=".8" /><text x={labelPoint.x} y={labelPoint.y + 3} textAnchor="middle" fontSize="10" fill="#778171">{label}</text></g>; })}
    <motion.polygon animate={{ points: active }} transition={{ duration: .25 }} fill="#709468" fillOpacity=".19" stroke="#557c4e" strokeWidth="1.6" />
    {values.map((v, i) => { const p = point(i, v * .71); return <circle key={i} cx={p.x} cy={p.y} r="2.7" fill="#557c4e" stroke="#f7f9f2" strokeWidth="1.3" />; })}
  </svg>;
}

export function Interests({ profile, mode, onSave, onMethodology }: { profile: InterestProfile; mode: RankingMode; onSave: (profile: InterestProfile, mode: RankingMode) => void; onMethodology: () => void }) {
  const [draft, setDraft] = useState<InterestProfile>({ ...profile });
  const [draftMode, setDraftMode] = useState<RankingMode>(mode);
  const [preset, setPreset] = useState('');
  const [reset, setReset] = useState(false);
  const ranked = useMemo(() => rankMajors(draft, draftMode), [draft, draftMode]);

  function applyPreset(value: string) {
    setPreset(value);
    if (!value) return;
    const next = Object.fromEntries(allInterests.map(({ key }) => [key, 50])) as InterestProfile;
    const presets: Record<string, Partial<InterestProfile>> = {
      builder: { technology: 95, problemSolving: 95, handsOn: 95, numbers: 85, science: 85, design: 75, structure: 70 },
      creative: { creativity: 100, design: 95, writing: 90, communication: 90, research: 65, handsOn: 70 },
      changemaker: { socialImpact: 100, helping: 95, nature: 85, communication: 90, leadership: 80, science: 70, research: 75 },
      analyst: { numbers: 100, problemSolving: 95, research: 95, technology: 85, structure: 85, business: 80 },
    };
    setDraft({ ...next, ...presets[value] });
    setReset(false);
  }

  return <motion.div initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
    <div className="page-heading">
      <div><div className="eyebrow">YOUR INTEREST PROFILE</div><h1>Good direction starts with you.</h1><p>Forget what you should like. Tell us what actually lights you up.</p></div>
      <button className="button button-secondary" onClick={() => { setDraft(Object.fromEntries(allInterests.map(({ key }) => [key, 50])) as InterestProfile); setPreset(''); setReset(true); }}><RotateCcw size={15} />Reset sliders</button>
    </div>
    <div className="interest-intro">
      <div><span className="intro-icon"><Compass size={21} strokeWidth={1.5} /></span><div><strong>No right answers. Just your interests.</strong><p>Slide from 0 (not for me) to 100 (I love it). You can change your mind anytime.</p></div></div>
      <div className="select-wrap"><select value={preset} onChange={event => applyPreset(event.target.value)} aria-label="Start with an interest preset"><option value="">Need a starting point?</option><option value="builder">The builder</option><option value="creative">The creative</option><option value="changemaker">The changemaker</option><option value="analyst">The analyst</option></select><ChevronDown size={14} /></div>
    </div>
    {reset && <p className="inline-status" role="status"><Check size={14} />All interests reset to 50. Save your profile below to apply these changes.</p>}
    <div className="interest-layout">
      <div className="interest-groups">
        {interestGroups.map((group, groupIndex) => <section className="interest-group" key={group.title} aria-labelledby={`interest-group-${groupIndex}`}>
          <div className="interest-group-title"><span className="group-number">0{groupIndex + 1}</span><div><h2 id={`interest-group-${groupIndex}`}>{group.title}</h2><p>{group.description}</p></div></div>
          {group.interests.map(interest => {
            const Icon = icons[interest.key];
            return <div className="interest-control" key={interest.key}>
              <div className="slider-label"><label htmlFor={`interest-${interest.key}`}><Icon size={16} strokeWidth={1.65} />{interest.label}</label><output htmlFor={`interest-${interest.key}`}>{draft[interest.key]}<span>%</span></output></div>
              <p id={`description-${interest.key}`}>{interest.description}</p>
              <input id={`interest-${interest.key}`} aria-describedby={`description-${interest.key}`} type="range" min="0" max="100" step="5" value={draft[interest.key]} onChange={event => { setDraft(current => ({ ...current, [interest.key]: Number(event.target.value) })); setPreset(''); setReset(false); }} style={{ '--range-progress': `${draft[interest.key]}%` } as CSSProperties} />
            </div>;
          })}
        </section>)}
        <div className="interest-reassurance"><FlaskConical size={17} /><p>This is a conversation starter, not an aptitude test. Your interests can grow, and your path can change.</p></div>
      </div>
      <aside className="profile-preview">
        <div className="preview-eyebrow"><span />YOUR DIRECTION, LIVE</div>
        <h2>A shape that's all you.</h2>
        <InterestRadar profile={draft} />
        <div className="preview-matches-title">Your top directions<span>Match</span></div>
        {ranked.slice(0, 3).map(major => <div className="preview-match" key={major.id}><MajorIcon category={major.category} /><span>{major.name}</span><strong>{major.passion}%</strong></div>)}
        <label className="ranking-label" htmlFor="ranking-mode">What should guide your ranking?</label>
        <div className="select-wrap full"><select id="ranking-mode" value={draftMode} onChange={event => setDraftMode(event.target.value as RankingMode)}><option value="balanced">A little of everything</option><option value="passion">Follow my passion</option><option value="outlook">Prioritize career outlook</option></select><ChevronDown size={14} /></div>
        <p className="preview-caption">{draftMode === 'balanced' ? '60% interests, with room for demand, salary, and AI resilience.' : draftMode === 'passion' ? '85% interests. Put what you love at the heart of your next step.' : '30% interests, with more weight on demand, salary, and AI resilience.'}</p>
        <button className="button button-primary full" onClick={() => onSave(draft, draftMode)}>Save & see my matches<ArrowRight size={16} /></button>
        <button className="text-button preview-help" onClick={onMethodology}><CircleHelp size={13} />How are matches calculated?</button>
      </aside>
    </div>
  </motion.div>;
}