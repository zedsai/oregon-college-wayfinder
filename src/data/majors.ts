import { catalogAdditions } from './catalogAdditions';

export type School = 'osu' | 'uo';
export type Category = 'Technology' | 'Engineering' | 'Business' | 'Environment' | 'Natural sciences' | 'People & society' | 'Arts & design';
export type InterestKey = 'problemSolving' | 'technology' | 'numbers' | 'research' | 'creativity' | 'design' | 'writing' | 'communication' | 'helping' | 'socialImpact' | 'nature' | 'science' | 'handsOn' | 'leadership' | 'business' | 'structure';
export type InterestProfile = Record<InterestKey, number>;

export interface Interest {
  key: InterestKey;
  label: string;
  description: string;
}

export const interestGroups: { title: string; description: string; interests: Interest[] }[] = [
  { title: 'How your mind works', description: 'The things that make you curious.', interests: [
    { key: 'problemSolving', label: 'Solving complex problems', description: 'Untangling challenges and finding a better way.' },
    { key: 'technology', label: 'Technology & computing', description: 'Exploring software, systems, and new tools.' },
    { key: 'numbers', label: 'Numbers & data', description: 'Finding the story behind the numbers.' },
    { key: 'research', label: 'Research & discovery', description: 'Asking questions that do not have easy answers.' },
  ] },
  { title: 'Your creative side', description: 'The ways you bring ideas to life.', interests: [
    { key: 'creativity', label: 'Creative thinking', description: 'Imagining something that does not exist yet.' },
    { key: 'design', label: 'Design & aesthetics', description: 'Making things more useful and beautiful.' },
    { key: 'writing', label: 'Writing & storytelling', description: 'Turning thoughts into words that connect.' },
    { key: 'communication', label: 'Communication', description: 'Sharing ideas and bringing people together.' },
  ] },
  { title: 'What matters to you', description: 'The impact you want to make.', interests: [
    { key: 'helping', label: 'Helping people', description: 'Supporting others and improving their lives.' },
    { key: 'socialImpact', label: 'Social impact', description: 'Building a fairer, healthier society.' },
    { key: 'nature', label: 'Nature & the environment', description: 'Protecting and understanding our planet.' },
    { key: 'science', label: 'Science & living systems', description: 'Understanding how the natural world works.' },
  ] },
  { title: 'Your working style', description: 'The kind of work that energizes you.', interests: [
    { key: 'handsOn', label: 'Hands-on work', description: 'Building, testing, and making things happen.' },
    { key: 'leadership', label: 'Leadership & teamwork', description: 'Helping a group move toward a shared goal.' },
    { key: 'business', label: 'Business & entrepreneurship', description: 'Spotting opportunities and growing ideas.' },
    { key: 'structure', label: 'Organization & detail', description: 'Creating order and getting the details right.' },
  ] },
];

export const defaultInterests: InterestProfile = {
  problemSolving: 95, technology: 90, numbers: 85, research: 85,
  creativity: 80, design: 75, writing: 45, communication: 65,
  helping: 70, socialImpact: 80, nature: 85, science: 85,
  handsOn: 85, leadership: 55, business: 60, structure: 65,
};

export interface Career {
  title: string;
  skills: string[];
  qualification?: string;
}

export interface Major {
  id: string;
  name: string;
  category: Category;
  description: string;
  schools: School[];
  bestSchool: School;
  schoolReason: string;
  programNames?: Partial<Record<School, string>>;
  alternativeNote?: string;
  admissionNote?: string;
  demand: number;
  ai: number;
  average: number;
  median: number;
  interests: Partial<Record<InterestKey, number>>;
  careers: Career[];
}

const career = (title: string, skills: string[], qualification?: string): Career => ({ title, skills, qualification });

// Numeric outcomes are editorial planning scenarios, not measured university outcomes.
export const majors: Major[] = [
  {
    id: 'computer-science', name: 'Computer Science', category: 'Technology',
    description: 'Build the software, systems, and digital experiences that shape everyday life.',
    schools: ['osu', 'uo'], bestSchool: 'osu',
    schoolReason: 'Our pick for an applied computing path: OSU places computer science within its College of Engineering and offers specialized and cybersecurity options. UO is also a direct option, especially for interdisciplinary study.',
    demand: 94, ai: 52, average: 88000, median: 82000,
    interests: { technology: 5, problemSolving: 5, numbers: 3, research: 2, creativity: 2, structure: 1 },
    careers: [career('Software developer', ['Programming', 'System design', 'Debugging']), career('Cybersecurity analyst', ['Network security', 'Risk assessment', 'Incident response']), career('Systems analyst', ['Requirements analysis', 'SQL', 'Communication']), career('QA automation engineer', ['Test design', 'Scripting', 'Attention to detail'])],
  },
  {
    id: 'mechanical-engineering', name: 'Mechanical Engineering', category: 'Engineering',
    description: 'Turn physics and creative thinking into machines, products, and energy systems.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU is the direct choice between these universities because it offers a mechanical engineering undergraduate major. UO does not offer an equivalent degree.',
    alternativeNote: 'UO offers physics, but not a mechanical engineering undergraduate major.',
    demand: 89, ai: 24, average: 78000, median: 75000,
    interests: { problemSolving: 5, handsOn: 5, science: 4, numbers: 3, design: 3, technology: 2 },
    careers: [career('Mechanical engineer', ['CAD modeling', 'Thermodynamics', 'Design analysis']), career('Manufacturing engineer', ['Process improvement', 'Quality control', 'Project management']), career('Product development engineer', ['Prototyping', 'Material selection', 'Testing']), career('Energy systems engineer', ['Heat transfer', 'Simulation', 'Energy efficiency'])],
  },
  {
    id: 'electrical-engineering', name: 'Electrical & Computer Engineering', category: 'Engineering',
    description: 'Design the circuits, devices, and embedded systems connecting the physical and digital worlds.',
    schools: ['osu'], bestSchool: 'osu',
    programNames: { osu: 'Electrical and Computer Engineering' },
    schoolReason: 'OSU offers the direct electrical and computer engineering major. UO has related computer science and physics programs, but not this engineering degree.',
    alternativeNote: 'Computer science and physics are related UO paths, not equivalent engineering credentials.',
    demand: 86, ai: 28, average: 83000, median: 79000,
    interests: { technology: 5, problemSolving: 5, numbers: 4, science: 4, handsOn: 4 },
    careers: [career('Electrical engineer', ['Circuit design', 'Signal processing', 'Testing']), career('Embedded systems engineer', ['C/C++', 'Microcontrollers', 'Hardware debugging']), career('Controls engineer', ['Automation', 'Control theory', 'PLC programming']), career('Hardware test engineer', ['Lab instrumentation', 'Validation', 'Documentation'])],
  },
  {
    id: 'civil-engineering', name: 'Civil Engineering', category: 'Engineering',
    description: 'Help communities thrive by designing safer infrastructure and more resilient places.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU is the direct degree option for civil engineering. Its engineering setting fits infrastructure and construction interests; UO architecture is a different professional pathway.',
    alternativeNote: 'UO architecture and planning degrees do not replace a civil engineering degree.',
    demand: 88, ai: 22, average: 74000, median: 71000,
    interests: { problemSolving: 5, handsOn: 4, numbers: 4, socialImpact: 3, design: 3, structure: 2 },
    careers: [career('Civil engineer', ['AutoCAD', 'Engineering analysis', 'Technical writing'], 'Professional licensure is needed for some responsibilities.'), career('Transportation analyst', ['GIS', 'Traffic modeling', 'Data analysis']), career('Water resources engineer', ['Hydrology', 'Hydraulic modeling', 'Environmental compliance']), career('Construction project engineer', ['Scheduling', 'Cost estimation', 'Site coordination'])],
  },
  {
    id: 'chemical-engineering', name: 'Chemical Engineering', category: 'Engineering',
    description: 'Transform raw materials into safer, cleaner, and more useful products at scale.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU offers the direct chemical engineering undergraduate major. UO offers chemistry, which has a different curriculum and set of career pathways.',
    alternativeNote: 'UO chemistry is a related science degree, not chemical engineering.',
    demand: 80, ai: 26, average: 82000, median: 78000,
    interests: { science: 5, numbers: 4, problemSolving: 5, research: 3, handsOn: 3, structure: 2 },
    careers: [career('Process engineer', ['Process simulation', 'Mass balances', 'Safety analysis']), career('Quality engineer', ['Statistical testing', 'Root cause analysis', 'Compliance']), career('Materials engineer', ['Materials testing', 'Lab methods', 'Data analysis']), career('Production engineer', ['Process optimization', 'Troubleshooting', 'Operations planning'])],
  },
  {
    id: 'data-science', name: 'Data Science', category: 'Technology',
    description: 'Find meaningful patterns in data and use them to make better decisions.',
    schools: ['osu', 'uo'], bestSchool: 'uo',
    schoolReason: 'Our pick for an interdisciplinary approach is UO. OSU now also offers a standalone Data Science BS through Statistics and Data Science, including options in economics and life science. Both are direct majors; compare curricula and campus fit.',
    programNames: { osu: 'Data Science (BS)', uo: 'Data Science (BA/BS)' },
    demand: 92, ai: 58, average: 82000, median: 78000,
    interests: { numbers: 5, technology: 4, research: 5, problemSolving: 4, structure: 2 },
    careers: [career('Data analyst', ['SQL', 'Data visualization', 'Statistics']), career('Junior data scientist', ['Python', 'Machine learning', 'Experimental design']), career('Business intelligence analyst', ['Dashboards', 'Data modeling', 'Stakeholder communication']), career('Research data associate', ['Data cleaning', 'Statistical analysis', 'Reproducible research'])],
  },
  {
    id: 'business-analytics', name: 'Business Analytics', category: 'Business',
    description: 'Connect analytical thinking with real business questions, from supply chains to customer behavior.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU offers Business Analytics as a standalone undergraduate major. UO offers a related Operations and Business Analytics concentration within Business Administration.',
    alternativeNote: 'UO offers a related Operations and Business Analytics concentration, not the same standalone major.',
    demand: 87, ai: 56, average: 70000, median: 66000,
    interests: { numbers: 5, business: 4, problemSolving: 4, technology: 3, communication: 2, structure: 3 },
    careers: [career('Business analyst', ['Requirements gathering', 'Excel', 'Process mapping']), career('Operations analyst', ['Optimization', 'Data analysis', 'Forecasting']), career('Supply chain analyst', ['Logistics', 'Inventory modeling', 'SQL']), career('Customer insights analyst', ['Market research', 'Visualization', 'Presentation'])],
  },
  {
    id: 'business-administration', name: 'Business Administration', category: 'Business',
    description: 'Learn how organizations work, then help people and ideas reach their potential.',
    schools: ['osu', 'uo'], bestSchool: 'uo',
    schoolReason: 'Our pick for interests in sports business and a broad business foundation is UO. OSU is also a direct option, including entrepreneurship and hospitality-related study. The better fit depends on your concentration.',
    demand: 77, ai: 48, average: 61000, median: 57000,
    interests: { business: 5, leadership: 5, communication: 4, problemSolving: 3, structure: 3 },
    careers: [career('Operations coordinator', ['Project coordination', 'Process improvement', 'Spreadsheets']), career('Management trainee', ['Leadership', 'Financial literacy', 'Teamwork']), career('Account coordinator', ['Client communication', 'CRM tools', 'Organization']), career('Business development associate', ['Market research', 'Relationship building', 'Presentation'])],
  },
  {
    id: 'accounting', name: 'Accounting', category: 'Business',
    description: 'Bring clarity and trust to financial decisions through careful analysis and sound judgment.',
    schools: ['osu', 'uo'], bestSchool: 'uo',
    schoolReason: 'UO is our suggested fit for a focused accounting pathway within its business college. Both universities offer the major; compare required credits, recruiting opportunities, and CPA preparation before deciding.',
    programNames: { osu: 'Accountancy', uo: 'Accounting' },
    demand: 84, ai: 65, average: 65000, median: 62000,
    interests: { numbers: 5, structure: 5, business: 4, problemSolving: 3, communication: 1 },
    careers: [career('Staff accountant', ['Financial reporting', 'Reconciliation', 'Excel']), career('Audit associate', ['Internal controls', 'Evidence review', 'Documentation']), career('Tax associate', ['Tax research', 'Compliance', 'Analytical thinking'], 'CPA licensure has additional education and examination requirements.'), career('Cost analyst', ['Budgeting', 'Variance analysis', 'ERP systems'])],
  },
  {
    id: 'finance', name: 'Finance', category: 'Business',
    description: 'Understand risk, value, and the decisions that put capital to work.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU offers Finance as a standalone undergraduate major, with a financial planning option. UO offers a Finance concentration within its Business Administration major.',
    alternativeNote: 'At UO, look for the Finance concentration within Business Administration.',
    demand: 82, ai: 62, average: 72000, median: 67000,
    interests: { numbers: 5, business: 5, problemSolving: 4, research: 3, structure: 3 },
    careers: [career('Financial analyst', ['Financial modeling', 'Valuation', 'Excel']), career('Credit analyst', ['Risk assessment', 'Financial statements', 'Research']), career('Financial planning associate', ['Budgeting', 'Client communication', 'Investment basics'], 'Advisory roles may require registration or licensing.'), career('Treasury analyst', ['Cash forecasting', 'Reporting', 'Attention to detail'])],
  },
  {
    id: 'marketing', name: 'Marketing', category: 'Business',
    description: 'Understand what people care about and connect them with products and ideas that matter.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU offers a standalone Marketing major. UO has a Marketing concentration within Business Administration, plus separate advertising and public relations degrees.',
    alternativeNote: 'UO Marketing is a Business Administration concentration; Advertising is a separate related major.',
    demand: 79, ai: 67, average: 58000, median: 54000,
    interests: { creativity: 4, communication: 5, business: 4, writing: 3, research: 3, numbers: 2 },
    careers: [career('Marketing coordinator', ['Campaign planning', 'Copywriting', 'Analytics']), career('Market research analyst', ['Survey design', 'Data interpretation', 'Presentation']), career('Digital marketing specialist', ['SEO', 'Advertising platforms', 'Experimentation']), career('Brand associate', ['Consumer research', 'Creative briefs', 'Project coordination'])],
  },
  {
    id: 'economics', name: 'Economics', category: 'Business',
    description: 'Explore how incentives and choices shape markets, public policy, and daily life.',
    schools: ['osu', 'uo'], bestSchool: 'uo',
    schoolReason: 'UO is our suggested fit for economics alongside broad social-science interests. OSU also offers Economics, including data science and managerial economics options, which may better suit an applied focus.',
    demand: 76, ai: 53, average: 65000, median: 61000,
    interests: { numbers: 5, research: 4, business: 3, problemSolving: 4, socialImpact: 3 },
    careers: [career('Economic research assistant', ['Econometrics', 'Statistical software', 'Literature review']), career('Policy analyst assistant', ['Policy research', 'Data analysis', 'Writing']), career('Pricing analyst', ['Forecasting', 'Excel', 'Market analysis']), career('Risk analyst', ['Quantitative modeling', 'Research', 'Communication'])],
  },
  {
    id: 'psychology', name: 'Psychology', category: 'People & society',
    description: 'Understand the human mind and use that understanding to help people and organizations.',
    schools: ['osu', 'uo'], bestSchool: 'uo',
    schoolReason: 'Our recommendation is UO for students drawn to psychology alongside neuroscience and behavioral research. OSU is also a direct option and offers related user experience research study.',
    demand: 77, ai: 27, average: 49000, median: 46000,
    interests: { helping: 5, research: 4, socialImpact: 3, communication: 4, science: 3, problemSolving: 2 },
    careers: [career('Behavioral health technician', ['Behavior observation', 'Documentation', 'Empathy'], 'Employer-specific training or certification may be required.'), career('Research assistant', ['Research methods', 'Statistics', 'Participant coordination']), career('Human resources coordinator', ['Interviewing', 'Organization', 'Communication']), career('Community support specialist', ['Resource navigation', 'Active listening', 'Case documentation'])],
  },
  {
    id: 'biology', name: 'Biology', category: 'Natural sciences',
    description: 'Investigate life at every scale, from individual cells to whole ecosystems.',
    schools: ['osu', 'uo'], bestSchool: 'osu',
    schoolReason: 'OSU is our pick for biology connected to ecology and applied natural sciences. UO also offers Biology and may appeal to students interested in molecular biology or interdisciplinary research.',
    demand: 74, ai: 30, average: 51000, median: 48000,
    interests: { science: 5, research: 5, nature: 4, handsOn: 3, problemSolving: 3 },
    careers: [career('Biological technician', ['Lab techniques', 'Data collection', 'Microscopy']), career('Research associate', ['Experimental methods', 'Lab documentation', 'Data analysis']), career('Environmental field technician', ['Sampling', 'Species identification', 'Field safety']), career('Quality control technician', ['Testing protocols', 'Compliance', 'Attention to detail'])],
  },
  {
    id: 'environmental-science', name: 'Environmental Science', category: 'Environment',
    description: 'Use science and systems thinking to tackle the challenges facing our planet.',
    schools: ['osu', 'uo'], bestSchool: 'osu',
    programNames: { osu: 'Environmental Sciences', uo: 'Environmental Science' },
    schoolReason: 'OSU is our pick for an applied natural-sciences focus, with related forestry, climate, and ocean programs. UO is also a direct option and offers a separate Environmental Studies degree.',
    demand: 83, ai: 21, average: 57000, median: 54000,
    interests: { nature: 5, science: 5, research: 4, socialImpact: 4, handsOn: 3, problemSolving: 3 },
    careers: [career('Environmental scientist', ['Environmental sampling', 'Data analysis', 'Technical reporting']), career('Sustainability coordinator', ['Emissions accounting', 'Project coordination', 'Communication']), career('Environmental consultant', ['Regulatory research', 'Site assessment', 'GIS']), career('Conservation technician', ['Habitat monitoring', 'Field methods', 'Species identification'])],
  },
  {
    id: 'forestry', name: 'Forestry', category: 'Environment',
    description: 'Care for working forests and balance ecological health with human needs.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU offers Forestry within a dedicated College of Forestry. UO does not offer a forestry undergraduate major, making OSU the direct program fit.',
    alternativeNote: 'UO Environmental Science is a related option, but not a professional forestry degree.',
    demand: 76, ai: 15, average: 56000, median: 53000,
    interests: { nature: 5, handsOn: 5, science: 3, socialImpact: 3, research: 2, problemSolving: 2 },
    careers: [career('Forester', ['Forest inventory', 'GIS', 'Resource planning']), career('Forest restoration technician', ['Ecological monitoring', 'Field methods', 'Safety']), career('Timber inventory analyst', ['Sampling', 'Mapping', 'Data management']), career('Wildland fire planner', ['Risk assessment', 'Landscape analysis', 'Communication'], 'Some roles require field qualifications and additional training.')],
  },
  {
    id: 'natural-resources', name: 'Natural Resources', category: 'Environment',
    description: 'Work across science, policy, and communities to manage the resources we all share.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU offers a named Natural Resources undergraduate major with several study options. UO Environmental Studies is a related interdisciplinary path, not the same degree.',
    alternativeNote: 'Explore Environmental Studies at UO for a related policy and society-focused path.',
    demand: 73, ai: 18, average: 52000, median: 49000,
    interests: { nature: 5, socialImpact: 4, science: 3, handsOn: 4, communication: 3, research: 2 },
    careers: [career('Natural resources specialist', ['Resource assessment', 'GIS', 'Technical writing']), career('Watershed technician', ['Water sampling', 'Field surveys', 'Data entry']), career('Conservation program assistant', ['Community outreach', 'Project coordination', 'Research']), career('Land management technician', ['Mapping', 'Restoration methods', 'Regulatory awareness'])],
  },
  {
    id: 'public-health', name: 'Public Health', category: 'People & society',
    description: 'Help entire communities live healthier lives through prevention, education, and better systems.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU offers a direct Public Health undergraduate major within its College of Health. UO has related health and human-services programs, but not this named degree in the comparison.',
    alternativeNote: 'UO has related human physiology and human-services pathways, not the same Public Health major.',
    demand: 85, ai: 24, average: 54000, median: 51000,
    interests: { helping: 5, socialImpact: 5, science: 4, research: 3, communication: 4, numbers: 2 },
    careers: [career('Health education specialist', ['Program planning', 'Health communication', 'Evaluation']), career('Community health worker', ['Outreach', 'Resource navigation', 'Cultural awareness'], 'State certification may be required.'), career('Public health program assistant', ['Data tracking', 'Coordination', 'Technical writing']), career('Research program coordinator', ['Study administration', 'Data management', 'Participant support'])],
  },
  {
    id: 'kinesiology', name: 'Kinesiology', category: 'People & society',
    description: 'Explore human movement and help people become healthier, stronger, and more active.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU offers the directly named Kinesiology major. UO Human Physiology is a related but distinct degree, so compare the course requirements and your intended graduate pathway.',
    alternativeNote: 'UO Human Physiology is related, but its degree title and requirements differ.',
    demand: 80, ai: 16, average: 48000, median: 45000,
    interests: { helping: 5, handsOn: 5, science: 4, communication: 3, research: 2 },
    careers: [career('Exercise physiologist', ['Exercise testing', 'Program design', 'Physiology'], 'Some employers require professional certification.'), career('Wellness coordinator', ['Health coaching', 'Program planning', 'Communication']), career('Fitness specialist', ['Movement assessment', 'Instruction', 'Safety'], 'Professional certification may be required.'), career('Rehabilitation aide', ['Patient support', 'Equipment preparation', 'Documentation'])],
  },
  {
    id: 'chemistry', name: 'Chemistry', category: 'Natural sciences',
    description: 'Discover how matter behaves and use that knowledge to solve practical problems.',
    schools: ['osu', 'uo'], bestSchool: 'osu',
    schoolReason: 'OSU is our suggested fit for chemistry connected to applied science and engineering. UO is also a direct option, particularly worth exploring for materials and molecular research interests.',
    demand: 74, ai: 32, average: 58000, median: 55000,
    interests: { science: 5, research: 5, numbers: 4, handsOn: 4, structure: 3, problemSolving: 3 },
    careers: [career('Analytical chemist', ['Chromatography', 'Spectroscopy', 'Data analysis']), career('Laboratory technician', ['Sample preparation', 'Lab safety', 'Documentation']), career('Quality control chemist', ['Analytical testing', 'Method validation', 'Compliance']), career('Formulation associate', ['Experimental design', 'Material testing', 'Technical writing'])],
  },
  {
    id: 'physics', name: 'Physics', category: 'Natural sciences',
    description: 'Ask fundamental questions about the universe and learn powerful ways to solve technical problems.',
    schools: ['osu', 'uo'], bestSchool: 'uo',
    schoolReason: 'UO is our pick for physics alongside research-oriented natural sciences. OSU is also a direct option and can suit students seeking connections with engineering. Neither is universally better.',
    demand: 71, ai: 35, average: 66000, median: 62000,
    interests: { science: 5, numbers: 5, research: 5, problemSolving: 5, technology: 2 },
    careers: [career('Research technician', ['Lab instrumentation', 'Data analysis', 'Scientific programming']), career('Test engineer', ['Measurement systems', 'Troubleshooting', 'Technical reporting']), career('Data analyst', ['Python', 'Statistics', 'Visualization']), career('Optics laboratory associate', ['Optical alignment', 'Lab safety', 'Experimental methods'])],
  },
  {
    id: 'mathematics', name: 'Mathematics', category: 'Natural sciences',
    description: 'Develop a precise way of thinking that opens doors across science, technology, and business.',
    schools: ['osu', 'uo'], bestSchool: 'osu',
    schoolReason: 'OSU is our suggested fit for applied mathematics connected to science and engineering. Both universities offer Mathematics; review advanced electives and research opportunities to find your best fit.',
    demand: 81, ai: 48, average: 67000, median: 63000,
    interests: { numbers: 5, problemSolving: 5, research: 4, structure: 3, technology: 2 },
    careers: [career('Actuarial analyst', ['Probability', 'Risk modeling', 'Spreadsheets'], 'Actuarial exams are typically expected for progression.'), career('Operations research analyst', ['Optimization', 'Modeling', 'Programming']), career('Data analyst', ['Statistics', 'SQL', 'Visualization']), career('Quantitative research assistant', ['Mathematical modeling', 'Python', 'Research methods'])],
  },
  {
    id: 'architecture', name: 'Architecture', category: 'Arts & design',
    description: 'Shape the spaces where people live, work, and connect with their surroundings.',
    schools: ['uo'], bestSchool: 'uo',
    programNames: { uo: 'Architecture (BArch)' },
    schoolReason: 'UO offers a professional Bachelor of Architecture. OSU does not offer an equivalent architecture undergraduate degree, so UO is the direct program fit.',
    alternativeNote: 'OSU Civil Engineering and Architectural Engineering are different professional paths.',
    demand: 74, ai: 37, average: 59000, median: 56000,
    interests: { design: 5, creativity: 5, problemSolving: 4, handsOn: 3, socialImpact: 3, nature: 2 },
    careers: [career('Architectural designer', ['BIM/Revit', 'Spatial design', 'Model making'], 'Architect licensure requires additional experience and exams; the BArch typically takes five years.'), career('BIM coordinator', ['Revit', 'Model coordination', 'Documentation']), career('Sustainability design assistant', ['Building performance', 'Material research', 'Analysis']), career('Urban design assistant', ['Mapping', 'Visualization', 'Site analysis'])],
  },
  {
    id: 'product-design', name: 'Product Design', category: 'Arts & design',
    description: 'Blend creativity, craftsmanship, and human insight to make thoughtful everyday products.',
    schools: ['uo'], bestSchool: 'uo',
    programNames: { uo: 'Product Design (BFA)' },
    schoolReason: 'UO offers the direct Product Design BFA. OSU Design and Innovation Management is related but emphasizes a different mix of design and business rather than the same studio degree.',
    alternativeNote: 'OSU Design and Innovation Management is a related, distinct major.',
    demand: 73, ai: 42, average: 63000, median: 59000,
    interests: { design: 5, creativity: 5, handsOn: 5, problemSolving: 4, research: 3, technology: 2 },
    careers: [career('Junior industrial designer', ['3D modeling', 'Sketching', 'Prototyping']), career('Product design associate', ['User research', 'Material selection', 'Design communication']), career('Footwear design assistant', ['Concept development', 'CAD', 'Construction methods']), career('Design researcher', ['Interviewing', 'Observation', 'Synthesis'])],
  },
  {
    id: 'graphic-design', name: 'Graphic Design', category: 'Arts & design',
    description: 'Make ideas visible through thoughtful typography, images, and visual systems.',
    schools: ['osu'], bestSchool: 'osu',
    schoolReason: 'OSU offers a named Graphic Design undergraduate major. UO Art and Technology is a related creative path, but it is not the same degree.',
    alternativeNote: 'UO Art and Technology offers a related, broader art-focused pathway.',
    demand: 65, ai: 70, average: 53000, median: 50000,
    interests: { design: 5, creativity: 5, communication: 3, technology: 3, writing: 2, structure: 2 },
    careers: [career('Graphic designer', ['Typography', 'Adobe Creative Suite', 'Layout']), career('Brand designer', ['Visual identity', 'Creative thinking', 'Presentation']), career('Junior digital designer', ['Figma', 'Responsive layouts', 'Visual communication']), career('Production artist', ['Prepress', 'Asset preparation', 'Attention to detail'])],
  },
  {
    id: 'journalism', name: 'Journalism', category: 'Arts & design',
    description: 'Ask better questions, tell important stories, and help people make sense of the world.',
    schools: ['uo'], bestSchool: 'uo',
    schoolReason: 'UO offers a direct Journalism major in its School of Journalism and Communication. OSU offers related communication and writing study rather than the same named degree.',
    alternativeNote: 'OSU Communication Studies and writing programs are related, not equivalent Journalism majors.',
    demand: 56, ai: 64, average: 47000, median: 44000,
    interests: { writing: 5, communication: 5, research: 4, socialImpact: 4, creativity: 3 },
    careers: [career('Reporter', ['Interviewing', 'Fact-checking', 'News writing']), career('Multimedia journalist', ['Video editing', 'Storytelling', 'Audio production']), career('Editorial assistant', ['Copyediting', 'Research', 'Organization']), career('Content producer', ['Digital publishing', 'Audience research', 'Writing'])],
  },
  {
    id: 'political-science', name: 'Political Science', category: 'People & society',
    description: 'Explore power, institutions, and the choices that shape our shared future.',
    schools: ['osu', 'uo'], bestSchool: 'uo',
    schoolReason: 'UO is our suggested fit for political science with broad social-science and public-policy interests. OSU is also a direct option, with Political Science housed in its School of Public Policy.',
    demand: 68, ai: 42, average: 51000, median: 48000,
    interests: { socialImpact: 5, writing: 4, communication: 4, research: 4, leadership: 3, problemSolving: 2 },
    careers: [career('Legislative assistant', ['Policy research', 'Writing', 'Constituent communication']), career('Campaign coordinator', ['Outreach', 'Event planning', 'Data tracking']), career('Government affairs assistant', ['Regulatory monitoring', 'Briefing preparation', 'Research']), career('Nonprofit program associate', ['Program coordination', 'Grant research', 'Communication'])],
  },
  {
    id: 'english', name: 'English', category: 'Arts & design',
    description: 'Explore the power of language and build a versatile foundation in critical thinking and expression.',
    schools: ['osu', 'uo'], bestSchool: 'uo',
    schoolReason: 'UO is our suggested fit for English within a broad humanities and arts environment. OSU also offers English and related writing study. Your preferred courses and faculty matter more than this editorial pick.',
    demand: 62, ai: 66, average: 49000, median: 46000,
    interests: { writing: 5, creativity: 4, research: 4, communication: 4, socialImpact: 2 },
    careers: [career('Editorial assistant', ['Copyediting', 'Research', 'Style guides']), career('Communications associate', ['Writing', 'Audience awareness', 'Digital publishing']), career('Technical writing assistant', ['Documentation', 'Information design', 'Interviewing']), career('Publishing assistant', ['Proofreading', 'Project coordination', 'Organization'])],
  },
  ...catalogAdditions,
];

export const schoolInfo = {
  osu: { name: 'Oregon State University', short: 'Oregon State', initials: 'OSU', city: 'Corvallis, Oregon', url: 'https://catalog.oregonstate.edu/programs/' },
  uo: { name: 'University of Oregon', short: 'U of Oregon', initials: 'UO', city: 'Eugene, Oregon', url: 'https://catalog.uoregon.edu/ug-programs/' },
};

export const categories: Category[] = ['Technology', 'Engineering', 'Business', 'Environment', 'Natural sciences', 'People & society', 'Arts & design'];
export const allInterests = interestGroups.flatMap(group => group.interests);

export type RankingMode = 'balanced' | 'passion' | 'outlook';
export type ScoredMajor = Major & { passion: number; score: number; rank: number };

export function passionScore(major: Major, profile: InterestProfile): number {
  const entries = Object.entries(major.interests) as [InterestKey, number][];
  const weight = entries.reduce((sum, [, value]) => sum + value, 0);
  return Math.round(entries.reduce((sum, [key, value]) => sum + profile[key] * value, 0) / weight);
}

export function rankMajors(profile: InterestProfile, mode: RankingMode = 'balanced'): ScoredMajor[] {
  const weights = mode === 'passion' ? [0.85, 0.1, 0.025, 0.025] : mode === 'outlook' ? [0.3, 0.4, 0.15, 0.15] : [0.6, 0.25, 0.1, 0.05];
  return majors.map(major => {
    const passion = passionScore(major, profile);
    const salaryScore = Math.min(100, Math.max(0, (major.median - 35000) / 500));
    const score = Math.round(passion * weights[0] + major.demand * weights[1] + salaryScore * weights[2] + (100 - major.ai) * weights[3]);
    return { ...major, passion, score, rank: 0 };
  }).sort((a, b) => b.score - a.score || b.passion - a.passion || a.name.localeCompare(b.name)).map((major, index) => ({ ...major, rank: index + 1 }));
}

export const currency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);