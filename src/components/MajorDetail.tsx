import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bookmark, BriefcaseBusiness, Check, CircleHelp, Columns2, ExternalLink, GraduationCap, Info, Sparkles, X } from 'lucide-react';
import { allInterests, currency, schoolInfo, type InterestKey, type InterestProfile, type School, type ScoredMajor } from '../data/majors';
import { MajorIcon, SchoolMark } from './Brand';
import { Modal } from './Modal';
import { handleTabKeys } from '../utils/keyboard';

export function MajorDetail({ major, profile, personalized, saved, compared, compareCount, onSave, onCompare, onClose, onMethodology, onInterests }: { major: ScoredMajor; profile: InterestProfile; personalized: boolean; saved: boolean; compared: boolean; compareCount: number; onSave: () => void; onCompare: () => void; onClose: () => void; onMethodology: () => void; onInterests: () => void }) {
  const [tab, setTab] = useState<'overview' | 'careers' | 'schools'>('overview');
  const relevant = (Object.entries(major.interests) as [InterestKey, number][]).sort((a, b) => b[1] - a[1]);
  const fitLabel = major.passion >= 80 ? 'This could be your kind of thing.' : major.passion >= 60 ? 'There is something here for you.' : 'A different direction to explore.';
  return <Modal title={`${major.name} major details`} onClose={onClose} drawer>
    <div className="detail-header"><div className="detail-top"><MajorIcon category={major.category} large /><div className="detail-category"><span>{major.category}</span><span>#{major.rank} in your ranking</span></div><button className="icon-button" aria-label="Close major details" onClick={onClose}><X size={21} /></button></div><h2>{major.name}</h2><p>{major.description}</p>{major.admissionNote && <p className="detail-admission"><Info size={15} />{major.admissionNote}</p>}</div>
    <div className="detail-tabs" role="tablist" aria-label="Major details" onKeyDown={handleTabKeys}>
      {(['overview', 'careers', 'schools'] as const).map(value => <button key={value} role="tab" tabIndex={tab === value ? 0 : -1} aria-selected={tab === value} aria-controls="major-detail-panel" id={`detail-tab-${value}`} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}>{value === 'overview' ? 'Overview' : value === 'careers' ? 'Careers & skills' : 'University fit'}</button>)}
    </div>
    <div className="detail-body" role="tabpanel" id="major-detail-panel" aria-labelledby={`detail-tab-${tab}`}>
      {tab === 'overview' && <>
        <div className="match-feature"><div className="match-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="#e7ece2" strokeWidth="5" /><motion.circle cx="50" cy="50" r="42" fill="none" stroke="#5a8151" strokeWidth="5" strokeLinecap="round" strokeDasharray={264} initial={{ strokeDashoffset: 264 }} animate={{ strokeDashoffset: 264 * (1 - major.passion / 100) }} transition={{ duration: .8 }} transform="rotate(-90 50 50)" /></svg><strong>{major.passion}<small>%</small></strong></div><div><span className="eyebrow">PASSION ALIGNMENT</span><h3>{fitLabel}</h3><p>{personalized ? 'Based on your saved interest profile.' : 'Based on a sample interest profile.'}</p>{!personalized && <button className="text-button" onClick={onInterests}>Make it personal<ArrowRight size={13} /></button>}</div></div>
        <div className="detail-section-title"><h3>A look at the outlook</h3><button className="text-button" onClick={onMethodology}><Info size={13} />Planning estimates</button></div>
        <div className="detail-metrics">
          <div><span>Job market demand</span><strong>{major.demand}<small>%</small></strong><p>Relative need score</p></div>
          <div><span>AI disruption</span><strong className={major.ai > 55 ? 'amber-text' : ''}>{major.ai}<small>%</small></strong><p>Task exposure, not job loss</p></div>
          <div><span>Average starting salary</span><strong>{currency(major.average)}</strong><p>Annual U.S. base-pay estimate</p></div>
          <div><span>Median starting salary</span><strong>{currency(major.median)}</strong><p>Annual U.S. base-pay estimate</p></div>
        </div>
        <div className="detail-school-pick"><div><GraduationCap size={17} /><span>Our university pick</span></div><SchoolMark school={major.bestSchool} full large /><p>{major.schoolReason}</p><button className="text-button" onClick={() => setTab('schools')}>See the university comparison<ArrowRight size={14} /></button></div>
        <section className="interest-connections"><div className="detail-section-title"><h3>What connects you</h3><Sparkles size={15} /></div><p>Your interests that matter most for this major.</p>{relevant.map(([key, weight]) => <div className="connection" key={key}><div><span>{allInterests.find(interest => interest.key === key)?.label}</span><span>{profile[key]}%<small>weight {weight}/5</small></span></div><div className="connection-track"><span style={{ width: `${profile[key]}%` }} /></div></div>)}</section>
      </>}
      {tab === 'careers' && <>
        <div className="detail-section-title"><h3>Where this major could take you</h3><span className="muted-label">{major.careers.length} paths</span></div><p className="detail-section-intro">A degree is a starting point. These are some of the roles and everyday skills it can lead to.</p>
        <div className="career-list">{major.careers.map((career, index) => <section className="career-item" key={career.title}><span className="career-index">0{index + 1}</span><div><h4>{career.title}</h4><span className="career-skills-label">SKILLS YOU'LL USE</span><ul>{career.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>{career.qualification && <p className="qualification"><Info size={13} />{career.qualification}</p>}</div></section>)}</div>
        <div className="career-note"><BriefcaseBusiness size={18} /><p>Hiring requirements vary. A portfolio, internship, certification, or additional education may help you move into these roles.{major.id === 'psychology' && ' These roles do not qualify you to practice as a licensed psychologist; that requires further education and licensure.'}</p></div>
        <a className="button button-secondary full" href="https://www.bls.gov/ooh/" target="_blank" rel="noreferrer">Explore official occupation profiles<ExternalLink size={14} /></a>
      </>}
      {tab === 'schools' && <>
        <div className="detail-section-title"><h3>Find the right academic home</h3></div><p className="detail-section-intro">An editorial program-fit recommendation, not an institutional quality ranking.</p>
        {([major.bestSchool, major.bestSchool === 'osu' ? 'uo' : 'osu'] as School[]).map(school => {
          const direct = major.schools.includes(school);
          const recommended = major.bestSchool === school;
          return <section className="detail-university" key={school}><div className="detail-university-label">{recommended ? <><Check size={13} />RECOMMENDED FOR THIS PATH</> : direct ? 'ALSO A DIRECT OPTION' : 'A RELATED, DIFFERENT PATH'}</div><SchoolMark school={school} full large /><p className="detail-university-program">{direct ? major.programNames?.[school] || major.name : 'No equivalent named undergraduate major'}</p><p>{recommended ? major.schoolReason : direct ? `${schoolInfo[school].name} also offers this major. Explore its curriculum, electives, learning environment, and costs before deciding which program fits you.` : major.alternativeNote}</p><a className="text-button" href={schoolInfo[school].url} target="_blank" rel="noreferrer">Explore the official catalog<ExternalLink size={13} /></a></section>;
        })}
        <div className="career-note"><CircleHelp size={18} /><p>Catalogs and requirements can change. Ask each university about admission, accreditation, available concentrations, and any graduate study your goal requires.</p></div>
      </>}
    </div>
    <div className="detail-footer"><button className={`button button-secondary ${compared ? 'is-compared' : ''}`} disabled={!compared && compareCount >= 3} onClick={onCompare}>{compared ? <Check size={16} /> : <Columns2 size={16} />}{compared ? 'Added to compare' : 'Add to compare'}</button><button className="button button-primary" onClick={onSave}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved to shortlist' : 'Save this major'}</button></div>
  </Modal>;
}