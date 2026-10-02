import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ArrowDown, ArrowDownToLine, ArrowRight, ArrowUp, ArrowUpRight, Bookmark, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, CircleHelp, Columns2, Compass, Database, GraduationCap, LayoutGrid, Menu, Search, Settings2, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { categories, currency, defaultInterests, majors, rankMajors, type Category, type InterestProfile, type RankingMode, type School, type ScoredMajor } from './data/majors';
import { Brand, CompassArt, MajorIcon, SchoolMark, SidebarLandscape } from './components/Brand';
import { Interests } from './components/Interests';
import { Comparison, Methodology, Universities, WorkspaceInfo } from './components/InfoPanels';
import { MajorDetail } from './components/MajorDetail';
import { useWorkspace } from './hooks/useWorkspace';
import { handleTabKeys } from './utils/keyboard';
import { defaultDirection, sortLabels, sortMajors, type SortDirection, type SortField } from './utils/sortMajors';

type View = 'explore' | 'interests' | 'saved' | 'universities';
type ActiveModal = 'methodology' | 'comparison' | 'workspace' | null;
const viewLabels = { explore: 'Explore majors', interests: 'My interests', saved: 'Saved majors', universities: 'University guide' };

export default function App() {
  const { profile, setProfile, personalized, setPersonalized, saved, setSaved, mode, setMode, storageError } = useWorkspace();
  const [view, setView] = useState<View>('explore');
  const [mobileNav, setMobileNav] = useState(false);
  const [mobileScreen, setMobileScreen] = useState(() => window.matchMedia('(max-width: 900px)').matches);
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState<School | 'all'>('all');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [sort, setSort] = useState<SortField>('recommended');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [topOnly, setTopOnly] = useState(false);
  const [minSalary, setMinSalary] = useState(0);
  const [maxAi, setMaxAi] = useState(100);
  const [minPassion, setMinPassion] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const ranked = useMemo(() => rankMajors(profile, mode), [profile, mode]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    const result = ranked.filter(major => {
      const searchText = [major.name, major.category, major.description, ...Object.values(major.programNames ?? {}), ...major.careers.flatMap(career => [career.title, ...career.skills])].join(' ').toLowerCase();
      return (view !== 'saved' || saved.includes(major.id)) && (!normalizedQuery || searchText.includes(normalizedQuery)) && (school === 'all' || major.schools.includes(school)) && (category === 'all' || major.category === category) && (!topOnly || major.passion >= 80) && major.median >= minSalary && major.ai <= maxAi && major.passion >= minPassion;
    });
    return sortMajors(result, sort, sortDirection);
  }, [ranked, query, view, saved, school, category, topOnly, minSalary, maxAi, minPassion, sort, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleMajors = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginationPages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(number => number >= 1 && number <= totalPages))].sort((a, b) => a - b);
  const selectedMajor = ranked.find(major => major.id === selectedId);
  const compareMajors = compareIds.map(id => ranked.find(major => major.id === id)).filter((major): major is ScoredMajor => Boolean(major));
  const advancedCount = Number(minSalary > 0) + Number(maxAi < 100) + Number(minPassion > 0);
  const anyFilters = Boolean(query || school !== 'all' || category !== 'all' || advancedCount || topOnly);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const update = () => { setMobileScreen(media.matches); if (!media.matches) setMobileNav(false); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!mobileNav || !mobileScreen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.querySelector<HTMLButtonElement>('#workspace-navigation button')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [mobileNav, mobileScreen]);
  useEffect(() => { setPage(1); }, [query, school, category, sort, sortDirection, pageSize, topOnly, minSalary, maxAi, minPassion, view, profile, mode]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) && !target.isContentEditable && !activeModal && !selectedId && (view === 'explore' || view === 'saved')) { event.preventDefault(); searchRef.current?.focus(); }
      if (event.key === 'Escape') { setFiltersOpen(false); setMobileNav(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeModal, selectedId, view]);
  useEffect(() => {
    if (!filtersOpen) return;
    const onOutside = (event: MouseEvent) => { if (!filterRef.current?.contains(event.target as Node)) setFiltersOpen(false); };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [filtersOpen]);

  function resetFilters() { setQuery(''); setSchool('all'); setCategory('all'); setTopOnly(false); setMinSalary(0); setMaxAi(100); setMinPassion(0); }
  function changeSort(field: SortField) {
    if (sort === field) setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    else { setSort(field); setSortDirection(defaultDirection(field)); }
  }
  function sortIcon(field: SortField) {
    return sort === field ? sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} /> : <ChevronsUpDown size={11} />;
  }
  function ariaSort(field: SortField | SortField[]) {
    return (Array.isArray(field) ? field.includes(sort) : field === sort) ? sortDirection === 'asc' ? 'ascending' as const : 'descending' as const : undefined;
  }
  function changePage(nextPage: number) {
    setPage(nextPage);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function navigate(next: View) { setView(next); setMobileNav(false); setPage(1); setFiltersOpen(false); resetFilters(); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function showToast(message: string) { setToast({ message }); }
  function toggleSaved(id: string) {
    const name = majors.find(major => major.id === id)?.name;
    const wasSaved = saved.includes(id);
    setSaved(current => wasSaved ? current.filter(value => value !== id) : [...current, id]);
    showToast(wasSaved ? `${name} removed from your shortlist.` : `${name} saved to your shortlist.`);
  }
  function toggleCompare(id: string) {
    if (compareIds.includes(id)) { setCompareIds(current => current.filter(value => value !== id)); return; }
    if (compareIds.length >= 3) { showToast('Compare up to 3 majors. Remove one to add another.'); return; }
    setCompareIds(current => [...current, id]); setSelectMode(true);
  }
  function openMethodology() { setSelectedId(null); setMobileNav(false); setActiveModal('methodology'); }
  function saveProfile(next: InterestProfile, nextMode: RankingMode) { setProfile(next); setMode(nextMode); setPersonalized(true); navigate('explore'); setSort('recommended'); setSortDirection('desc'); showToast('Your profile is saved. Meet your new major matches.'); }
  function exportShortlist() {
    const records = ranked.filter(major => saved.includes(major.id));
    const rows = [['Wayfinder shortlist: salary, demand, and AI figures are illustrative planning estimates, not observed outcomes.'], ['Rank', 'Major', 'Recommended school', 'Passion match %', 'Demand score %', 'AI task exposure %', 'Estimated average annual starting pay USD', 'Estimated median annual starting pay USD', 'Career paths', 'Skills']];
    for (const major of records) rows.push([String(major.rank), major.name, major.bestSchool === 'osu' ? 'Oregon State University' : 'University of Oregon', String(major.passion), String(major.demand), String(major.ai), String(major.average), String(major.median), major.careers.map(career => career.title).join('; '), [...new Set(major.careers.flatMap(career => career.skills))].join('; ')]);
    const csv = rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'wayfinder-shortlist.csv'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); showToast('Your shortlist has been exported.');
  }
  function resetWorkspace() {
    setProfile({ ...defaultInterests }); setPersonalized(false); setSaved([]); setMode('balanced'); setCompareIds([]); setSelectMode(false); setSelectedId(null); setActiveModal(null); setSort('recommended'); setSortDirection('desc'); navigate('explore'); showToast('A fresh start. Your workspace has been reset.');
  }

  return <MotionConfig reducedMotion="user">
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {mobileNav && <button className="mobile-backdrop" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`} id="workspace-navigation" inert={mobileScreen && !mobileNav}>
        <button className="brand-button" onClick={() => navigate('explore')} aria-label="Wayfinder home"><Brand /></button>
        <div className="sidebar-main">
          <div className="nav-section-label">YOUR NEXT CHAPTER</div>
          <nav aria-label="Main navigation">
            <button className={`nav-item ${view === 'explore' ? 'active' : ''}`} onClick={() => navigate('explore')} aria-current={view === 'explore' ? 'page' : undefined}><LayoutGrid size={18} /><span>Explore majors</span></button>
            <button className={`nav-item ${view === 'interests' ? 'active' : ''}`} onClick={() => navigate('interests')} aria-current={view === 'interests' ? 'page' : undefined}><SlidersHorizontal size={18} /><span>My interests</span>{personalized && <span className="nav-complete"><Check size={12} /></span>}</button>
            <button className={`nav-item ${view === 'saved' ? 'active' : ''}`} onClick={() => navigate('saved')} aria-current={view === 'saved' ? 'page' : undefined}><Bookmark size={18} /><span>Saved majors</span>{saved.length > 0 && <span className="nav-count">{saved.length}</span>}</button>
          </nav>
          <div className="nav-divider" />
          <div className="nav-section-label">A LITTLE PERSPECTIVE</div>
          <nav aria-label="Resources">
            <button className={`nav-item ${view === 'universities' ? 'active' : ''}`} onClick={() => navigate('universities')} aria-current={view === 'universities' ? 'page' : undefined}><GraduationCap size={19} /><span>University guide</span></button>
            <button className="nav-item" onClick={openMethodology}><Database size={17} /><span>Data & methodology</span></button>
          </nav>
        </div>
        <div className="sidebar-bottom"><div className="sidebar-message"><SidebarLandscape /><p>You don't need every answer.<br /><strong>Just a place to start.</strong></p></div><button className="workspace-button" onClick={() => { setMobileNav(false); setActiveModal('workspace'); }}><span className="workspace-avatar">Y</span><span><strong>Your workspace</strong><small>{storageError ? 'Saved for this session' : 'Saved on this device'}</small></span><Settings2 size={16} /></button></div>
      </aside>

      <div className="main-shell" inert={mobileScreen && mobileNav}>
        <header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-menu" aria-label="Open navigation" aria-expanded={mobileNav} aria-controls="workspace-navigation" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button><Compass size={16} strokeWidth={1.5} /><span>Your workspace</span><ChevronRight size={13} /><strong>{viewLabels[view]}</strong></div><div className="topbar-right"><span className="oregon-caption"><span />A little Oregon perspective</span><div className="school-pair"><SchoolMark school="osu" /><SchoolMark school="uo" /></div><span className="topbar-divider" /><button className="icon-button" aria-label="How Wayfinder works" onClick={openMethodology}><CircleHelp size={18} /></button></div></header>
        <main id="main-content" className={`main-content ${selectMode ? 'with-comparison' : ''}`}>
          {(view === 'explore' || view === 'saved') && <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
            <div className="page-heading explorer-heading">
              <div>
                <h1>{view === 'saved' ? 'Keep the possibilities close.' : 'Find your next chapter.'}</h1>
                <p>{view === 'saved' ? 'The majors that caught your eye. A little closer to your next step.' : `Explore ${majors.length} undergraduate majors across Oregon State and the University of Oregon.`}</p>
              </div>
              <div className="heading-actions">
                {view === 'saved' && saved.length > 0 && <button className="button button-secondary export-button" aria-label="Export shortlist as CSV" onClick={exportShortlist}><ArrowDownToLine size={15} /><span>Export shortlist</span></button>}
                <button className={`button button-secondary ${selectMode ? 'selected-button' : ''}`} aria-label={compareIds.length >= 2 ? `Compare ${compareIds.length} majors` : 'Select majors to compare'} onClick={() => { if (compareIds.length >= 2) setActiveModal('comparison'); else setSelectMode(!selectMode); }}>
                  <Columns2 size={16} /><span>{compareIds.length >= 2 ? `Compare (${compareIds.length})` : selectMode ? 'Selecting majors' : 'Compare majors'}</span>
                </button>
              </div>
            </div>
            {view === 'explore' && <section className="profile-banner" aria-label="Personalize your major matches">
              <div className="profile-banner-copy">
                <h2>Your future should feel like you.</h2>
                <p>{personalized ? 'Your interests are shaping your matches. Keep following your curiosity.' : 'Start with sample matches. Add your interests to find a direction that is truly you.'}</p>
                <button className="button banner-button" onClick={() => navigate('interests')}><SlidersHorizontal size={14} />{personalized ? 'Refine my interests' : 'Personalize my matches'}<ArrowRight size={14} /></button>
              </div>
              <CompassArt />
            </section>}

            <section className="explorer-section" ref={resultsRef} aria-label={view === 'saved' ? 'Saved major list' : 'Explore and rank majors'}>
              <div className="explorer-tabs">
                <div className="major-tabs" role="tablist" aria-label="Major groups" onKeyDown={handleTabKeys}>
                  {view === 'explore' ? <>
                    <button role="tab" id="all-major-tab" aria-controls="major-results" tabIndex={!topOnly ? 0 : -1} aria-selected={!topOnly} className={!topOnly ? 'active' : ''} onClick={() => setTopOnly(false)}>All majors<span className="tab-count">{majors.length}</span></button>
                    <button role="tab" id="match-major-tab" aria-controls="major-results" tabIndex={topOnly ? 0 : -1} aria-selected={topOnly} className={topOnly ? 'active' : ''} onClick={() => setTopOnly(true)}><Sparkles size={14} />Best matches</button>
                  </> : <button role="tab" id="shortlist-tab" aria-controls="major-results" aria-selected="true" className="active">Your shortlist<span className="tab-count">{saved.length}</span></button>}
                </div>
                <button className="text-button ranking-help" onClick={openMethodology} title="All salary, demand, and AI figures are illustrative planning estimates"><CircleHelp size={14} />Estimates & scoring</button>
              </div>
              <div id="major-results" role="tabpanel" aria-labelledby={view === 'saved' ? 'shortlist-tab' : topOnly ? 'match-major-tab' : 'all-major-tab'}>
              <div className="explorer-toolbar">
                <div className="search-input"><Search size={16} /><input ref={searchRef} type="search" value={query} placeholder="Search majors, careers, skills..." aria-label="Search majors, careers, and skills" onChange={event => setQuery(event.target.value)} />{query ? <button className="clear-search" onClick={() => { setQuery(''); searchRef.current?.focus(); }} aria-label="Clear search"><X size={14} /></button> : <kbd>/</kbd>}</div>
                <div className="select-wrap university-filter"><select value={school} onChange={event => setSchool(event.target.value as School | 'all')} aria-label="Filter by university"><option value="all">Both universities</option><option value="osu">Oregon State</option><option value="uo">University of Oregon</option></select><ChevronDown size={14} /></div>
                <div className="select-wrap category-filter"><select value={category} onChange={event => setCategory(event.target.value as Category | 'all')} aria-label="Filter by field of study"><option value="all">All fields of study</option>{categories.map(value => <option value={value} key={value}>{value}</option>)}</select><ChevronDown size={14} /></div>
                <div className="advanced-filter" ref={filterRef}><button className={`filter-button ${advancedCount || filtersOpen ? 'active' : ''}`} aria-label={`Additional filters${advancedCount ? `, ${advancedCount} active` : ''}`} aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16} />{advancedCount > 0 && <span>{advancedCount}</span>}</button><AnimatePresence>{filtersOpen && <motion.div className="filter-popover" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} role="region" aria-label="Additional major filters"><div className="filter-popover-title"><h3>A little more specific</h3><button className="icon-button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X size={16} /></button></div><label htmlFor="salary-filter">Minimum median starting pay<strong>{minSalary === 0 ? 'Any' : currency(minSalary)}</strong></label><input id="salary-filter" type="range" min="0" max="90000" step="5000" value={minSalary} onChange={event => setMinSalary(Number(event.target.value))} style={{ '--range-progress': `${minSalary / 900}%` } as CSSProperties} /><label htmlFor="ai-filter">Maximum AI exposure<strong>{maxAi}%</strong></label><input id="ai-filter" type="range" min="0" max="100" step="5" value={maxAi} onChange={event => setMaxAi(Number(event.target.value))} style={{ '--range-progress': `${maxAi}%` } as CSSProperties} /><label htmlFor="passion-filter">Minimum passion match<strong>{minPassion}%</strong></label><input id="passion-filter" type="range" min="0" max="100" step="5" value={minPassion} onChange={event => setMinPassion(Number(event.target.value))} style={{ '--range-progress': `${minPassion}%` } as CSSProperties} /><div className="filter-popover-footer"><button className="text-button" onClick={() => { setMinSalary(0); setMaxAi(100); setMinPassion(0); }}>Reset</button><button className="button button-primary" onClick={() => setFiltersOpen(false)}>Show {filtered.length} majors<ArrowRight size={14} /></button></div></motion.div>}</AnimatePresence></div>
                <div className="toolbar-spacer" />
                <div className="sort-control">
                  <label htmlFor="sort-majors">Sort by</label>
                  <div className="select-wrap">
                    <select id="sort-majors" value={sort} onChange={event => changeSort(event.target.value as SortField)}>
                      {(Object.entries(sortLabels) as [SortField, string][]).map(([field, label]) => <option value={field} key={field}>{label}</option>)}
                    </select>
                    <ChevronDown size={13} />
                  </div>
                  <button className="sort-direction" onClick={() => setSortDirection(current => current === 'asc' ? 'desc' : 'asc')} aria-label={`Switch to ${sort === 'name' ? sortDirection === 'asc' ? 'Z to A' : 'A to Z' : sortDirection === 'asc' ? 'high to low' : 'low to high'} sorting for ${sortLabels[sort].toLowerCase()}`} title="Reverse sort direction">
                    {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    <span>{sort === 'name' ? sortDirection === 'asc' ? 'A to Z' : 'Z to A' : sortDirection === 'asc' ? 'Low to high' : 'High to low'}</span>
                  </button>
                </div>
              </div>
              {anyFilters && <div className="filter-summary"><span>{filtered.length} {filtered.length === 1 ? 'major' : 'majors'}{topOnly ? ' with a passion match of 80% or higher' : ' match your filters'}</span><button className="text-button" onClick={resetFilters}>Clear filters<X size={12} /></button></div>}
              {visibleMajors.length > 0 ? <>
                <div className="major-table-scroll" tabIndex={0} role="region" aria-label="Major rankings table. Scroll horizontally to see all metrics on smaller screens.">
                  <table className="major-table">
                    <caption className="sr-only">Majors ranked using your {personalized ? 'saved' : 'sample'} interest profile. Job demand, AI exposure, and starting salaries are illustrative estimates. Open a major for all careers, skills, and university comparisons.</caption>
                    <thead><tr>
                      <th className="rank-column" scope="col" aria-sort={sort === 'recommended' ? sortDirection === 'desc' ? 'ascending' : 'descending' : undefined} title="Overall personalized rank stays the same when sorting">{selectMode ? <Check size={13} /> : '#'}</th>
                      <th className="major-column" scope="col" aria-sort={ariaSort('name')}><button onClick={() => changeSort('name')}>Major & career paths{sortIcon('name')}</button></th>
                      <th className="school-column" scope="col">Best-fit school</th>
                      <th className="match-column" scope="col" aria-sort={ariaSort('passion')}><button className={sort === 'passion' ? 'sorted' : ''} onClick={() => changeSort('passion')}>Passion match{sortIcon('passion')}</button></th>
                      <th className="demand-column" scope="col" aria-sort={ariaSort('demand')} title="Illustrative relative demand score, not an employment probability"><button className={sort === 'demand' ? 'sorted' : ''} onClick={() => changeSort('demand')}>Job demand{sortIcon('demand')}</button></th>
                      <th className="ai-column" scope="col" aria-sort={ariaSort('ai')} title="Illustrative AI task exposure, not a probability of job loss"><button className={sort === 'ai' ? 'sorted' : ''} onClick={() => changeSort('ai')}>AI disruption{sortIcon('ai')}</button></th>
                      <th className="salary-column" scope="col" aria-sort={ariaSort(['average', 'median'])} title="Click to sort estimated average pay. Select median pay from the sort menu."><button className={sort === 'average' || sort === 'median' ? 'sorted' : ''} onClick={() => changeSort(sort === 'median' ? 'median' : 'average')}>Est. starting pay{sort === 'average' || sort === 'median' ? sortIcon(sort) : <ChevronsUpDown size={11} />}</button></th>
                      <th className="save-column" scope="col"><span className="sr-only">Save major</span></th>
                    </tr></thead><tbody>
                  {visibleMajors.map((major, index) => <motion.tr key={major.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22, delay: index * .025 }} className={compareIds.includes(major.id) ? 'compared-row' : ''} onClick={() => setSelectedId(major.id)}>
                    <td className="rank-cell">{selectMode ? <input type="checkbox" aria-label={`Compare ${major.name}`} checked={compareIds.includes(major.id)} disabled={!compareIds.includes(major.id) && compareIds.length >= 3} onClick={event => event.stopPropagation()} onChange={() => toggleCompare(major.id)} /> : <span>{String(major.rank).padStart(2, '0')}</span>}</td>
                    <td><button className="major-name-button" onClick={event => { event.stopPropagation(); setSelectedId(major.id); }} aria-label={`Explore ${major.name} careers, skills, and universities${major.admissionNote ? `. ${major.admissionNote}` : ''}`}><MajorIcon category={major.category} /><span className="major-name-content"><strong title={major.name}>{major.name}</strong><span className="career-preview" title={major.admissionNote ?? major.careers.map(career => career.title).join(', ')}>{major.admissionNote ? <span className="admission-note">{major.admissionNote}</span> : <><span>{major.careers.slice(0, 2).map(career => career.title).join(', ')}</span><span className="more-careers">+{major.careers.length - 2}</span></>}</span></span></button></td>
                    <td><SchoolMark school={major.bestSchool} full /></td>
                    <td><div className="passion-cell"><strong>{major.passion}<span>%</span></strong><div className="match-track"><motion.span initial={{ width: 0 }} animate={{ width: `${major.passion}%` }} transition={{ duration: .6, delay: .1 + index * .025 }} /></div></div></td>
                    <td><div className="market-cell"><strong>{major.demand}%</strong><span><i className={major.demand >= 80 ? 'high-dot' : 'steady-dot'} />{major.demand >= 80 ? 'High demand' : major.demand >= 65 ? 'Steady demand' : 'Competitive'}</span></div></td>
                    <td><div className={`ai-cell ${major.ai <= 30 ? 'low' : major.ai <= 55 ? 'moderate' : 'elevated'}`}><strong>{major.ai}%</strong><span>{major.ai <= 30 ? 'Low exposure' : major.ai <= 55 ? 'Moderate' : 'Elevated'}</span></div></td>
                    <td><div className="salary-cell"><strong>{currency(major.average)}<small> avg.</small></strong><span>{currency(major.median)} median</span></div></td>
                    <td><button className={`save-major icon-button ${saved.includes(major.id) ? 'saved' : ''}`} aria-label={`${saved.includes(major.id) ? 'Unsave' : 'Save'} ${major.name}`} aria-pressed={saved.includes(major.id)} title={saved.includes(major.id) ? 'Remove from shortlist' : 'Save to shortlist'} onClick={event => { event.stopPropagation(); toggleSaved(major.id); }}><Bookmark size={17} strokeWidth={1.5} fill={saved.includes(major.id) ? 'currentColor' : 'none'} /></button></td>
                  </motion.tr>)}
                </tbody></table></div>
                <div className="table-footer">
                  <div className="table-footer-meta">
                    <span>Showing <strong>{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> majors</span>
                    <label htmlFor="majors-per-page">Rows <select id="majors-per-page" value={pageSize} onChange={event => setPageSize(Number(event.target.value))}><option value={8}>8</option><option value={16}>16</option><option value={32}>32</option></select></label>
                  </div>
                  <nav className="pagination" aria-label="Major list pagination">
                    <button className="page-arrow" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} aria-label="Previous page"><ChevronLeft size={15} /></button>
                    {paginationPages.map((number, index) => <Fragment key={number}>
                      {index > 0 && number - paginationPages[index - 1] > 1 && <span className="pagination-ellipsis" aria-hidden="true">...</span>}
                      <button className={currentPage === number ? 'current' : ''} onClick={() => changePage(number)} aria-label={`Page ${number}`} aria-current={currentPage === number ? 'page' : undefined}>{number}</button>
                    </Fragment>)}
                    <button className="page-arrow" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)} aria-label="Next page"><ChevronRight size={15} /></button>
                  </nav>
                </div>
              </> : <div className="empty-state">{view === 'saved' && saved.length === 0 ? <><span className="empty-icon"><Bookmark size={28} strokeWidth={1.4} /></span><h2>A little shortlist. A lot of clarity.</h2><p>Save the majors that spark your curiosity.<br />They will be right here when you want a closer look.</p><button className="button button-primary" onClick={() => navigate('explore')}>Explore your possibilities<ArrowRight size={15} /></button></> : <><span className="empty-icon"><Search size={28} strokeWidth={1.4} /></span><h2>Let's widen the possibilities.</h2><p>No majors match this combination. Try another search<br />or give your filters a little more room.</p><button className="button button-secondary" onClick={resetFilters}>Clear filters<ArrowRight size={15} /></button></>}</div>}
              </div>
            </section>
            <div className="data-footnote"><div><span className={`profile-dot ${personalized ? 'personalized' : ''}`} /><span>{personalized ? 'Your interest profile' : 'Sample interest profile'}<span className="footnote-separator">/</span>{mode === 'passion' ? 'Passion-first ranking' : mode === 'outlook' ? 'Career-focused ranking' : 'Balanced ranking'}<span className="footnote-separator">/</span># is your overall rank</span></div><button className="text-button" onClick={openMethodology}><CircleHelp size={13} />Catalog snapshot; market & salary figures are estimates<ArrowUpRight size={12} /></button></div>
            <div className="bottom-signoff"><span>A starting point, not a finish line.</span><span>Made for the way ahead.</span></div>
          </motion.div>}
          {view === 'interests' && <Interests profile={profile} mode={mode} onSave={saveProfile} onMethodology={openMethodology} />}
          {view === 'universities' && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Universities onExplore={value => { navigate('explore'); setSchool(value); }} /></motion.div>}
        </main>
      </div>

      <AnimatePresence>{selectMode && <motion.div className="comparison-tray" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 350, damping: 30 }}><div className="comparison-tray-intro"><Columns2 size={19} /><div><strong>{compareIds.length === 0 ? 'A clearer view, side by side.' : `${compareIds.length} of 3 majors selected`}</strong><span>{compareIds.length === 0 ? 'Select 2 or 3 majors to compare.' : 'Different possibilities. Your priorities.'}</span></div></div><div className="comparison-selections">{compareMajors.map(major => <button key={major.id} onClick={() => toggleCompare(major.id)} title={`Remove ${major.name} from comparison`}><span>{major.name}</span><X size={12} /></button>)}</div><button className="button button-primary" disabled={compareIds.length < 2} onClick={() => setActiveModal('comparison')}>Compare{compareIds.length > 0 ? ` (${compareIds.length})` : ''}<ArrowRight size={15} /></button><button className="icon-button close-comparison" aria-label="Exit comparison selection" onClick={() => { setSelectMode(false); setCompareIds([]); }}><X size={18} /></button></motion.div>}</AnimatePresence>
      {selectedMajor && <MajorDetail major={selectedMajor} profile={profile} personalized={personalized} saved={saved.includes(selectedMajor.id)} compared={compareIds.includes(selectedMajor.id)} compareCount={compareIds.length} onSave={() => toggleSaved(selectedMajor.id)} onCompare={() => toggleCompare(selectedMajor.id)} onClose={() => setSelectedId(null)} onMethodology={openMethodology} onInterests={() => { setSelectedId(null); navigate('interests'); }} />}
      {activeModal === 'methodology' && <Methodology onClose={() => setActiveModal(null)} mode={mode} />}
      {activeModal === 'comparison' && <Comparison items={compareMajors} onClose={() => setActiveModal(null)} saved={saved} onSave={toggleSaved} />}
      {activeModal === 'workspace' && <WorkspaceInfo onClose={() => setActiveModal(null)} onReset={resetWorkspace} profile={profile} saved={saved} personalized={personalized} />}
      <div className="toast-region" aria-live="polite"><AnimatePresence>{toast && <motion.div className="toast" key={toast.message} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><span><Check size={15} /></span><p>{toast.message}</p><button className="icon-button" onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={15} /></button></motion.div>}</AnimatePresence></div>
    </div>
  </MotionConfig>;
}
