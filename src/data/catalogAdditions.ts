import type { Category, InterestKey, Major, School } from './majors';

type CampusCode = 'osu' | 'uo' | 'both-osu' | 'both-uo';
type CareerLine = string;
type AdditionOptions = {
  reason?: string;
  alternativeNote?: string;
  programNames?: Partial<Record<School, string>>;
  admissionNote?: string;
};

const add = (
  name: string, category: Category, campus: CampusCode, description: string,
  [demand, ai, median]: [number, number, number],
  interests: Partial<Record<InterestKey, number>>, careers: [CareerLine, CareerLine, CareerLine],
  options: AdditionOptions = {},
): Major => {
  const schools: School[] = campus.startsWith('both') ? ['osu', 'uo'] : [campus as School];
  const bestSchool: School = campus.endsWith('uo') ? 'uo' : 'osu';
  const other = bestSchool === 'osu' ? 'University of Oregon' : 'Oregon State University';
  const pick = bestSchool === 'osu' ? 'Oregon State University' : 'University of Oregon';
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name, category, description, schools, bestSchool,
    schoolReason: options.reason ?? (schools.length === 1
      ? `${pick} lists ${options.programNames?.[bestSchool] ?? name} as a direct undergraduate major. ${other} does not list an equivalent standalone major. Compare courses and eligibility in the official catalogs.`
      : `Both universities offer a directly related undergraduate major. Our editorial pick is ${pick}; compare the two catalogs, faculty, location, and program costs to find your own best fit.`),
    alternativeNote: options.alternativeNote ?? (schools.length === 1 ? `${other} may offer related coursework or a concentration, but not the same standalone major.` : undefined),
    programNames: options.programNames,
    admissionNote: options.admissionNote,
    demand, ai, median, average: Math.round(median * 1.06 / 1000) * 1000,
    interests,
    careers: careers.map(line => {
      const [title, first, second, third, qualification] = line.split('|');
      return { title, skills: [first, second, third], ...(qualification ? { qualification } : {}) };
    }),
  };
};

// Undergraduate majors checked against the universities' 2026-27 public catalogs.
// Market, AI, and pay values remain illustrative editorial planning scenarios.
export const catalogAdditions: Major[] = [
  // Agriculture, food systems, and living sciences.
  add('Agricultural and Food Business Management', 'Business', 'osu', 'Connect farm and food systems with economics, marketing, and business decisions.', [77, 38, 57000], { business: 5, nature: 4, numbers: 3, leadership: 3 }, [
    'Agricultural business analyst|Market analysis|Budgeting|Spreadsheet modeling',
    'Food supply coordinator|Inventory planning|Vendor communication|Logistics',
    'Farm operations associate|Cost tracking|Operations planning|Agricultural markets',
  ]),
  add('Agricultural and Natural Resources Communication', 'People & society', 'osu', 'Tell stories about food, agriculture, and the natural world.', [69, 54, 47000], { communication: 5, writing: 5, nature: 4, socialImpact: 3 }, [
    'Agricultural communications specialist|Science writing|Audience research|Public speaking',
    'Extension outreach assistant|Community engagement|Educational materials|Event planning',
    'Natural resources content producer|Interviewing|Digital publishing|Fact-checking',
  ]),
  add('Agricultural Sciences', 'Environment', 'osu', 'Explore agriculture broadly, from sustainable production to community food systems.', [73, 25, 51000], { nature: 5, science: 4, handsOn: 4, business: 3 }, [
    'Agricultural program coordinator|Program planning|Producer outreach|Recordkeeping',
    'Crop operations assistant|Field scouting|Production planning|Equipment safety',
    'Extension program aide|Community education|Data collection|Communication',
  ]),
  add('Animal Sciences', 'Natural sciences', 'osu', 'Study animal biology, care, and responsible production.', [72, 18, 50000], { science: 5, nature: 5, handsOn: 4, helping: 3 }, [
    'Animal care specialist|Animal handling|Welfare standards|Observation',
    'Livestock production assistant|Herd records|Nutrition basics|Farm safety',
    'Veterinary assistant|Patient support|Clinical recordkeeping|Animal restraint',
  ]),
  add('Biochemistry and Biophysics', 'Natural sciences', 'osu', 'Use chemistry and physics to understand the machinery of life.', [77, 35, 58000], { science: 5, research: 5, numbers: 4, problemSolving: 4 }, [
    'Biophysics research assistant|Lab instrumentation|Data analysis|Experimental design',
    'Biotech laboratory associate|Protein assays|Documentation|Lab safety',
    'Analytical scientist assistant|Spectroscopy|Sample preparation|Quality control',
  ]),
  add('Biochemistry and Molecular Biology', 'Natural sciences', 'osu', 'Explore cells and molecules to understand health, disease, and biotechnology.', [79, 35, 58000], { science: 5, research: 5, handsOn: 4, structure: 3 }, [
    'Molecular biology technician|PCR|Cell culture|Lab records',
    'Biotechnology associate|Assay development|Sample preparation|Data interpretation',
    'Genomics research assistant|Sequencing workflows|Data cleaning|Scientific reporting',
  ]),
  add('BioHealth Sciences', 'People & society', 'osu', 'Build a life-sciences foundation for health-related work and further study.', [77, 23, 50000], { science: 5, helping: 5, research: 3, communication: 3 }, [
    'Clinical research assistant|Participant coordination|Data entry|Research ethics',
    'Health laboratory technician|Sample handling|Lab safety|Quality checks',
    'Patient care coordinator|Care navigation|Scheduling|Communication',
  ]),
  add('Biological Data Sciences', 'Technology', 'osu', 'Bring statistics and computing to questions about living systems.', [86, 51, 67000], { numbers: 5, science: 5, technology: 4, research: 4 }, [
    'Bioinformatics analyst|Python|Sequence analysis|Data cleaning',
    'Ecological data technician|R programming|Field data|Visualization',
    'Research data associate|Database management|Statistics|Reproducibility',
  ]),
  add('Bioresource Research', 'Natural sciences', 'osu', 'Design your own research-focused route through agricultural and biological sciences.', [71, 26, 52000], { research: 5, science: 5, nature: 4, problemSolving: 3 }, [
    'Research laboratory assistant|Experimental design|Data collection|Lab safety',
    'Agricultural research associate|Field trials|Statistical analysis|Technical reports',
    'Biotechnology technician|Sample preparation|Protocol execution|Documentation',
  ]),
  add('Botany', 'Natural sciences', 'osu', 'Discover plant life, ecology, and the role of plants in changing ecosystems.', [66, 16, 48000], { nature: 5, science: 5, research: 4, handsOn: 4 }, [
    'Botanical field technician|Plant identification|Field sampling|GPS mapping',
    'Plant research assistant|Greenhouse methods|Data collection|Microscopy',
    'Restoration technician|Native plants|Habitat monitoring|Field safety',
  ]),
  add('Crop and Soil Science', 'Environment', 'osu', 'Study the science behind resilient crops, healthy soils, and sustainable farming.', [76, 20, 54000], { nature: 5, science: 5, handsOn: 5, research: 3 }, [
    'Soil science technician|Soil sampling|Lab analysis|Mapping',
    'Crop consultant assistant|Field scouting|Pest identification|Data recording',
    'Agronomy technician|Trial plots|Nutrient management|Equipment calibration',
  ]),
  add('Environmental Economics and Policy', 'Environment', 'osu', 'Use economics to understand environmental choices and design better policy.', [76, 43, 60000], { nature: 5, numbers: 4, research: 4, socialImpact: 5 }, [
    'Environmental policy analyst assistant|Policy research|Economic analysis|Writing',
    'Sustainability data associate|Emissions accounting|Spreadsheets|Reporting',
    'Resource economics researcher|Econometrics|Data cleaning|Literature review',
  ]),
  add('Fisheries, Wildlife, and Conservation Sciences', 'Environment', 'osu', 'Conserve species and habitats through field science and resource management.', [73, 16, 51000], { nature: 5, science: 5, handsOn: 5, research: 3 }, [
    'Wildlife field technician|Species surveys|Field safety|GPS data',
    'Fisheries technician|Population sampling|Data collection|Habitat monitoring',
    'Conservation program associate|Resource planning|GIS|Stakeholder communication',
  ]),
  add('Food Science and Sustainable Technologies', 'Natural sciences', 'osu', 'Improve food safety, processing, and innovation through applied science.', [81, 31, 61000], { science: 5, handsOn: 5, nature: 3, problemSolving: 4 }, [
    'Food safety technician|Microbial testing|HACCP basics|Documentation',
    'Product development associate|Sensory testing|Formulation|Pilot processing',
    'Fermentation technician|Process monitoring|Quality control|Lab methods',
  ]),
  add('Horticulture', 'Environment', 'osu', 'Work with cultivated plants, landscapes, and sustainable growing systems.', [72, 17, 50000], { nature: 5, handsOn: 5, science: 4, design: 2 }, [
    'Greenhouse production specialist|Plant propagation|Pest management|Scheduling',
    'Horticulture technician|Soil management|Plant identification|Field methods',
    'Landscape nursery associate|Plant care|Inventory|Customer education',
  ]),
  add('Microbiology', 'Natural sciences', 'osu', 'Study microorganisms and their impact on health, food, and ecosystems.', [80, 31, 59000], { science: 5, research: 5, handsOn: 4, structure: 3 }, [
    'Microbiology laboratory technician|Culturing|Sterile technique|Lab records',
    'Quality control microbiologist|Contamination testing|Method validation|Compliance',
    'Public health lab assistant|Sample processing|Microscopy|Data tracking',
  ]),
  add('Nutrition', 'People & society', 'osu', 'Understand the science of food and support healthier lives and communities.', [81, 19, 49000], { helping: 5, science: 5, socialImpact: 4, communication: 3 }, [
    'Nutrition program assistant|Menu planning|Food education|Program records',
    'Community nutrition coordinator|Outreach|Needs assessment|Communication',
    'Foodservice management trainee|Food safety|Operations planning|Budgeting',
  ], { alternativeNote: 'UO Human Physiology or Biology can be related pathways, but are not a Nutrition major. Registered dietitian roles require additional credentialing.' }),
  add('Rangeland Sciences', 'Environment', 'osu', 'Manage open landscapes, grazing systems, and the habitats they support.', [70, 14, 50000], { nature: 5, science: 4, handsOn: 5, socialImpact: 3 }, [
    'Rangeland technician|Vegetation monitoring|GIS|Field safety',
    'Habitat management assistant|Restoration planning|Soil assessment|Data collection',
    'Conservation district aide|Producer outreach|Land stewardship|Reporting',
  ]),
  add('Sustainability', 'Environment', 'osu', 'A concurrent double degree that pairs sustainability with another undergraduate major.', [77, 38, 55000], { socialImpact: 5, nature: 5, communication: 4, research: 3 }, [
    'Sustainability coordinator|Emissions tracking|Stakeholder engagement|Reporting',
    'ESG research assistant|Data analysis|Policy review|Writing',
    'Resource efficiency analyst|Waste audits|Process improvement|Metrics',
  ], { admissionNote: 'Concurrent double degree: pair with a primary major.', reason: 'OSU lists Sustainability as a concurrent undergraduate double degree taken alongside a primary major. UO offers related Environmental Studies and a Sustainable Business minor, but not the same Sustainability double-degree path.', alternativeNote: 'UO offers Environmental Studies and a Sustainable Business minor, not this concurrent Sustainability double degree.' }),
  add('Wood Innovation for Sustainability', 'Environment', 'osu', 'Innovate with wood and renewable materials across design, science, and business.', [73, 23, 55000], { nature: 5, design: 4, handsOn: 5, science: 3 }, [
    'Wood products development associate|Material properties|Prototyping|Testing',
    'Mass timber project assistant|Sustainable materials|Specifications|Project coordination',
    'Forest products quality technician|Product inspection|Moisture testing|Reporting',
  ]),
  add('Zoology', 'Natural sciences', 'osu', 'Study animal life, behavior, evolution, and conservation.', [69, 16, 46000], { nature: 5, science: 5, research: 4, handsOn: 4 }, [
    'Wildlife research technician|Animal observation|Field surveys|Data entry',
    'Zoological care assistant|Animal husbandry|Enrichment|Recordkeeping',
    'Conservation education associate|Species knowledge|Public speaking|Outreach',
  ]),

  // Engineering, computing, climate, and earth systems.
  add('Architectural Engineering', 'Engineering', 'osu', 'Engineer the structures and building systems that bring a design to life.', [83, 23, 73000], { design: 4, numbers: 5, handsOn: 4, problemSolving: 5 }, [
    'Building systems engineer|Building performance|CAD|Engineering analysis',
    'Structural design assistant|Load calculations|Drafting|Model review',
    'Energy modeling analyst|Simulation|Energy codes|Technical reports',
  ], { alternativeNote: 'UO Architecture is a professional design degree; it is not an Architectural Engineering degree.' }),
  add('Bioengineering', 'Engineering', 'osu', 'Apply engineering to biology, medicine, and health technologies.', [84, 28, 72000], { science: 5, problemSolving: 5, handsOn: 4, helping: 4 }, [
    'Biomedical engineering associate|Device testing|CAD|Documentation',
    'Bioprocess engineer trainee|Process design|Lab methods|Quality systems',
    'Medical device quality specialist|Validation|Risk assessment|Regulatory basics',
  ], { alternativeNote: 'UO offers a Bioengineering minor, not a standalone undergraduate major.' }),
  add('Climate Science', 'Environment', 'osu', 'Study the atmosphere, climate systems, and the science of change.', [79, 28, 59000], { nature: 5, science: 5, numbers: 4, research: 4 }, [
    'Climate data analyst|Python|Climate datasets|Visualization',
    'Weather research technician|Monitoring equipment|Model outputs|Data validation',
    'Climate adaptation assistant|Risk mapping|Research|Stakeholder reports',
  ]),
  add('Computer Science - Applied', 'Technology', 'osu', 'A separate online computer science degree restricted to students who already hold a bachelor\'s degree.', [86, 52, 79000], { technology: 5, problemSolving: 5, numbers: 3, structure: 3 }, [
    'Software developer|Programming|System design|Testing',
    'Web application engineer|Web frameworks|APIs|Debugging',
    'Systems analyst|SQL|Process analysis|Documentation',
  ], { admissionNote: 'Postbaccalaureate students only. A prior bachelor\'s degree is required.', reason: 'OSU offers Computer Science - Applied online specifically for students who already hold a bachelor\'s degree. UO and OSU both offer a standard Computer Science major for first-time undergraduates.', alternativeNote: 'This OSU program is postbaccalaureate only. First-time undergraduates should explore the regular Computer Science major at OSU or UO.', programNames: { osu: 'Computer Science - Applied (postbaccalaureate only)' } }),
  add('Construction Engineering Management', 'Engineering', 'osu', 'Combine engineering and leadership to deliver construction projects.', [86, 21, 73000], { handsOn: 5, leadership: 4, numbers: 4, problemSolving: 5 }, [
    'Construction project engineer|Scheduling|Site coordination|Cost tracking',
    'Estimator|Blueprint reading|Quantity takeoffs|Budgeting',
    'Field engineer|Quality inspections|Safety practices|Technical reports',
  ]),
  add('Ecological Engineering', 'Engineering', 'osu', 'Design solutions that work with water, soil, and living ecosystems.', [81, 20, 70000], { nature: 5, science: 5, problemSolving: 5, handsOn: 4 }, [
    'Ecological design engineer|Water modeling|Site assessment|Design',
    'Watershed engineer assistant|Hydrology|GIS|Field sampling',
    'Restoration project engineer|Ecosystem design|Permitting basics|Project planning',
  ]),
  add('Energy Systems Engineering', 'Engineering', 'osu', 'Develop more reliable and sustainable ways to generate and use energy.', [86, 25, 74000], { science: 5, problemSolving: 5, nature: 3, technology: 4 }, [
    'Energy systems engineer|Energy modeling|System design|Technical analysis',
    'Renewables project analyst|Resource assessment|Forecasting|Project planning',
    'Building energy analyst|Efficiency audits|Data analysis|Reporting',
  ]),
  add('Engineering Science', 'Engineering', 'osu', 'Build an interdisciplinary engineering foundation for flexible technical careers.', [82, 26, 71000], { problemSolving: 5, science: 5, numbers: 4, handsOn: 4 }, [
    'Systems engineering associate|Requirements analysis|Modeling|Testing',
    'Product development engineer|Prototyping|CAD|Experimentation',
    'Technical project associate|Research|Documentation|Team coordination',
  ]),
  add('Environmental Engineering', 'Engineering', 'osu', 'Engineer cleaner water, healthier air, and solutions for contaminated land.', [88, 20, 73000], { nature: 5, science: 5, problemSolving: 5, socialImpact: 4 }, [
    'Environmental engineer|Water treatment|Design calculations|Compliance',
    'Air quality engineer associate|Emissions modeling|Sampling|Reporting',
    'Remediation engineer assistant|Site assessment|Contaminant tracking|GIS',
  ]),
  add('Forest Engineering', 'Engineering', 'osu', 'Plan safe, efficient infrastructure and operations in working forests.', [79, 17, 69000], { nature: 5, handsOn: 5, numbers: 4, problemSolving: 5 }, [
    'Forest engineer|Road design|Surveying|Operations planning',
    'Timber operations planner|GIS|Harvest scheduling|Safety',
    'Forest infrastructure engineer|Hydrology|CAD|Site assessment',
  ]),
  add('Forest Engineering - Civil Engineering', 'Engineering', 'osu', 'A specialized double-degree path spanning forest systems and civil infrastructure.', [84, 18, 73000], { nature: 4, numbers: 5, problemSolving: 5, handsOn: 5 }, [
    'Forest infrastructure engineer|Civil design|Surveying|GIS',
    'Transportation engineer assistant|Road design|Drainage|Technical reports',
    'Watershed project engineer|Hydrology|Project planning|Field assessment',
  ], { admissionNote: 'Forest and civil engineering double degree; plan for an extended course of study.', reason: 'OSU lists Forest Engineering - Civil Engineering as a combined undergraduate major leading to two degrees. UO does not offer this forest/civil engineering double-degree route.', alternativeNote: 'This OSU route combines two degrees and may take five years; UO does not offer this forest/civil engineering double-degree path.' }),
  add('Geography', 'Environment', 'both-osu', 'Study places, people, and spatial patterns with maps and geographic data.', [74, 34, 55000], { nature: 4, socialImpact: 4, research: 4, technology: 3 }, [
    'GIS technician|Spatial analysis|ArcGIS|Data management',
    'Geospatial analyst associate|Remote sensing|Mapping|Python',
    'Community planning assistant|Demographic analysis|Maps|Research',
  ], { programNames: { osu: 'Geography and Geospatial Science', uo: 'Geography' }, reason: 'Our pick is OSU for a major explicitly centered on geography and geospatial science. UO also offers Geography; compare each program\'s GIS, human geography, and fieldwork offerings.' }),
  add('Geology', 'Natural sciences', 'osu', 'Read the history of Earth through rocks, landscapes, and field evidence.', [76, 19, 59000], { nature: 5, science: 5, handsOn: 5, research: 4 }, [
    'Geology field technician|Rock identification|Field mapping|Sampling',
    'Geotechnical assistant|Site characterization|Core logging|Reporting',
    'Environmental geologist assistant|Groundwater sampling|GIS|Lab coordination',
  ], { alternativeNote: 'UO Earth Sciences includes geology study, but is listed as a distinct undergraduate degree.' }),
  add('Industrial Engineering', 'Engineering', 'osu', 'Make complex manufacturing and service systems work better for people.', [86, 39, 77000], { numbers: 5, problemSolving: 5, structure: 4, leadership: 3 }, [
    'Industrial engineer|Process improvement|Simulation|Statistics',
    'Operations research analyst|Optimization|Forecasting|Data analysis',
    'Quality engineer|Lean methods|Root-cause analysis|Documentation',
  ]),
  add('Manufacturing Engineering', 'Engineering', 'osu', 'Design and improve the processes that turn ideas into physical products.', [83, 31, 75000], { handsOn: 5, technology: 4, problemSolving: 5, structure: 4 }, [
    'Manufacturing engineer|Process design|CAD/CAM|Troubleshooting',
    'Production quality engineer|Inspection|Root-cause analysis|Statistics',
    'Automation engineer associate|PLC basics|Equipment testing|Safety',
  ]),
  add('Nuclear Science and Engineering', 'Engineering', 'osu', 'Explore nuclear systems for energy, medicine, materials, and safety.', [82, 20, 81000], { science: 5, numbers: 5, problemSolving: 5, structure: 4 }, [
    'Nuclear engineer associate|Reactor fundamentals|Safety analysis|Modeling',
    'Radiation protection technician|Dosimetry|Safety protocols|Measurement',
    'Nuclear systems analyst|Simulation|Technical reports|Regulatory awareness',
  ], { alternativeNote: 'This is the current OSU undergraduate catalog name, replacing the older Nuclear Engineering title; UO has no equivalent major.' }),
  add('Oceanography', 'Environment', 'osu', 'Understand the oceans through physical, chemical, and biological science.', [75, 24, 56000], { nature: 5, science: 5, research: 5, handsOn: 4 }, [
    'Ocean research technician|Marine sampling|Instrumentation|Data processing',
    'Coastal data analyst|Ocean datasets|Mapping|Statistics',
    'Marine field specialist|Vessel operations|Field safety|Observation',
  ], { alternativeNote: 'UO Marine Biology is focused on marine organisms; it is not the same as the broader Oceanography degree.' }),
  add('Outdoor Products', 'Arts & design', 'osu', 'Design, develop, and bring outdoor gear from concept to market.', [72, 44, 58000], { design: 5, handsOn: 5, nature: 4, business: 3 }, [
    'Outdoor product developer|Prototyping|Material selection|Testing',
    'Product line assistant|Consumer research|Specification writing|Planning',
    'Gear quality specialist|Product inspection|Field testing|Documentation',
  ], { alternativeNote: 'This program is at OSU-Cascades. UO Product Design is a related but distinct degree.' }),

  // Business, entrepreneurship, and organizational operations.
  add('Business Information Systems', 'Technology', 'osu', 'Bridge business goals and the information systems people rely on.', [85, 51, 69000], { technology: 5, business: 5, problemSolving: 4, structure: 3 }, [
    'Business systems analyst|Requirements gathering|SQL|Process mapping',
    'IT project coordinator|Project planning|Stakeholder communication|Documentation',
    'Enterprise applications associate|ERP systems|Troubleshooting|Data analysis',
  ]),
  add('Design and Innovation Management', 'Business', 'osu', 'Combine human-centered design with the business of launching new ideas.', [76, 51, 60000], { design: 5, creativity: 4, business: 5, leadership: 3 }, [
    'Innovation program associate|Ideation|Project coordination|Research',
    'Product manager assistant|User insights|Roadmapping|Communication',
    'Design strategy analyst|Customer research|Synthesis|Presentation',
  ], { alternativeNote: 'UO Product Design is a studio-based BFA; this OSU major emphasizes design plus business management.' }),
  add('Hospitality Management', 'Business', 'osu', 'Lead welcoming experiences across lodging, food service, and events.', [76, 27, 51000], { business: 4, helping: 4, leadership: 5, communication: 5 }, [
    'Hotel operations supervisor trainee|Guest service|Scheduling|Team leadership',
    'Event coordinator|Vendor management|Budgeting|Logistics',
    'Food and beverage manager trainee|Service operations|Inventory|Communication',
  ]),
  add('Innovation & Entrepreneurship', 'Business', 'osu', 'Turn new ideas into ventures and navigate the work of building a business.', [74, 46, 58000], { creativity: 5, business: 5, leadership: 5, problemSolving: 4 }, [
    'Startup operations associate|Business modeling|Customer discovery|Planning',
    'Venture development assistant|Market research|Pitch development|Financial basics',
    'Innovation coordinator|Project management|Prototyping|Collaboration',
  ], { programNames: { osu: 'Innovation & Entrepreneurship' }, alternativeNote: 'UO offers Entrepreneurship as a Business Administration concentration, not the same standalone major.' }),
  add('Organizational Leadership', 'Business', 'osu', 'Learn how to guide teams, manage change, and improve organizations.', [77, 34, 57000], { leadership: 5, communication: 5, helping: 3, business: 4 }, [
    'People operations coordinator|Employee onboarding|Communication|Organization',
    'Project coordinator|Scheduling|Team facilitation|Reporting',
    'Training specialist assistant|Workshop planning|Instruction|Feedback',
  ]),
  add('Product and Merchandising Management', 'Business', 'osu', 'Connect products, shoppers, retail strategy, and the details of getting goods to market.', [73, 58, 54000], { business: 5, design: 3, numbers: 3, communication: 4 }, [
    'Assistant buyer|Trend analysis|Vendor relations|Inventory',
    'Merchandising coordinator|Assortment planning|Visual presentation|Spreadsheets',
    'Retail product analyst|Sales reporting|Pricing|Customer research',
  ]),
  add('Sports Business', 'Business', 'osu', 'Explore the strategy, sponsorship, and operations behind the sports industry.', [72, 46, 54000], { business: 5, communication: 5, leadership: 4, creativity: 3 }, [
    'Sports sponsorship coordinator|Partner relations|Campaign planning|Reporting',
    'Athletics operations associate|Event logistics|Budgeting|Teamwork',
    'Sports marketing assistant|Audience research|Social media|Analytics',
  ], { alternativeNote: 'UO offers Sports Business as a Business Administration concentration, not a standalone major.' }),
  add('Supply Chain and Logistics Management', 'Business', 'osu', 'Help goods move efficiently and responsibly from source to destination.', [88, 43, 68000], { business: 5, structure: 5, numbers: 4, problemSolving: 4 }, [
    'Supply chain analyst|Demand planning|Excel|Inventory modeling',
    'Logistics coordinator|Shipment tracking|Vendor communication|Scheduling',
    'Procurement associate|Sourcing|Cost analysis|Negotiation',
  ]),

  // OSU health, education, media, and interdisciplinary study.
  add('American Studies', 'People & society', 'osu', 'Explore the cultures, histories, and experiences that shape the United States.', [61, 48, 45000], { socialImpact: 5, writing: 4, research: 5, communication: 3 }, [
    'Museum program assistant|Historical research|Exhibit writing|Visitor engagement',
    'Community outreach coordinator|Public programming|Communication|Research',
    'Cultural research assistant|Archival methods|Analysis|Writing',
  ], { alternativeNote: 'This OSU undergraduate major is offered at OSU-Cascades. UO offers related humanities and history majors.' }),
  add('Apparel Design', 'Arts & design', 'osu', 'Create market-aware clothing and gear, especially for active and outdoor lives.', [68, 45, 53000], { design: 5, creativity: 5, handsOn: 5, business: 3 }, [
    'Apparel design assistant|Technical drawing|Fabric selection|Pattern development',
    'Technical designer|Fit analysis|Specification sheets|Production communication',
    'Textile product developer|Material research|Prototyping|Quality review',
  ], { alternativeNote: 'UO Product Design is a related design BFA, but not a dedicated Apparel Design major.' }),
  add('Applied Humanities', 'People & society', 'osu', 'Use humanities research and communication skills to solve practical problems.', [67, 49, 48000], { writing: 5, research: 4, communication: 5, socialImpact: 4 }, [
    'Community project coordinator|Qualitative research|Outreach|Writing',
    'Cultural programs assistant|Event planning|Interpretation|Communication',
    'Public information associate|Editing|Stakeholder research|Presentation',
  ]),
  add('Arts, Media, and Technology', 'Arts & design', 'osu', 'Experiment across visual art, digital media, and new creative tools.', [66, 57, 52000], { creativity: 5, design: 5, technology: 4, communication: 3 }, [
    'Digital media producer|Video editing|Visual storytelling|Digital tools',
    'Interactive arts assistant|Creative coding|Prototyping|Exhibition setup',
    'Multimedia designer|Motion graphics|Layout|Client communication',
  ], { alternativeNote: 'This OSU major is based at OSU-Cascades. UO Art and Technology is related, but has its own curriculum and credential.' }),
  add('Communication Studies', 'People & society', 'osu', 'Examine how people communicate and put that knowledge into practice.', [73, 54, 50000], { communication: 5, writing: 4, helping: 3, research: 3 }, [
    'Internal communications associate|Messaging|Writing|Audience awareness',
    'Community relations assistant|Outreach|Public speaking|Listening',
    'Training coordinator|Facilitation|Workshop planning|Feedback',
  ], { alternativeNote: 'UO offers Journalism and communication-related paths, but does not list the same Communication Studies undergraduate major.' }),
  add('Contemporary Music Industry', 'Arts & design', 'osu', 'Understand the creative, production, and business sides of modern music.', [61, 55, 45000], { creativity: 5, business: 4, communication: 4, technology: 3 }, [
    'Music marketing assistant|Release planning|Audience research|Social media',
    'Artist services coordinator|Project management|Rights basics|Communication',
    'Audio production assistant|Recording workflows|Editing|Session setup',
  ], { alternativeNote: 'OSU lists this major through Ecampus. UO Popular Music and Music are related, different majors.' }),
  add('Creative Writing', 'Arts & design', 'osu', 'Find your voice and practice the craft of writing across genres.', [59, 66, 45000], { writing: 5, creativity: 5, research: 3, communication: 4 }, [
    'Editorial assistant|Copyediting|Fact-checking|Style guides',
    'Content writer|Storytelling|Audience research|Revisions',
    'Publishing assistant|Manuscript review|Organization|Author communication',
  ], { alternativeNote: 'UO has a Creative Writing minor, not a standalone undergraduate major.' }),
  add('Digital Communication Arts', 'Arts & design', 'osu', 'Combine digital storytelling, media production, and communication.', [69, 60, 51000], { creativity: 5, technology: 4, communication: 5, writing: 3 }, [
    'Digital content producer|Video editing|Publishing|Storyboarding',
    'Social media coordinator|Campaign planning|Analytics|Writing',
    'Multimedia communications assistant|Audio production|Design tools|Outreach',
  ]),
  add('Early Childhood Leadership, Policy, and Practice', 'People & society', 'osu', 'Support young children and families through education, leadership, and policy.', [79, 12, 44000], { helping: 5, socialImpact: 5, leadership: 4, communication: 4 }, [
    'Early childhood program coordinator|Family engagement|Program planning|Documentation',
    'Child development specialist assistant|Developmental observation|Resource navigation|Communication',
    'Early learning policy aide|Policy research|Data tracking|Writing',
  ], { alternativeNote: 'This direct OSU major is offered at OSU-Cascades. UO Child Behavioral Health and Educational Foundations are different programs.' }),
  add('Elementary Education', 'People & society', 'osu', 'Prepare to guide young learners and create welcoming classrooms.', [86, 12, 47000], { helping: 5, communication: 5, creativity: 3, leadership: 4 }, [
    'Elementary school teacher|Lesson planning|Classroom management|Assessment|State teacher licensure is required for public-school teaching.',
    'Education program assistant|Tutoring|Curriculum support|Family communication',
    'Youth learning coordinator|Program design|Mentoring|Scheduling',
  ], { alternativeNote: 'UO Educational Foundations is a distinct degree and may require further preparation for teacher licensure.' }),
  add('Healthcare Administration', 'People & society', 'osu', 'Help healthcare organizations work better for patients and staff.', [84, 36, 58000], { helping: 4, leadership: 4, structure: 5, business: 4 }, [
    'Healthcare operations coordinator|Patient flow|Scheduling|Process improvement',
    'Medical office manager trainee|Team coordination|Compliance|Budgeting',
    'Health systems analyst assistant|Data reporting|Workflow mapping|Communication',
  ]),
  add('Human Development and Family Sciences', 'People & society', 'osu', 'Study development across the lifespan and ways to support families.', [78, 18, 46000], { helping: 5, science: 3, communication: 4, socialImpact: 5 }, [
    'Family services coordinator|Resource navigation|Case documentation|Empathy',
    'Youth program specialist|Mentoring|Activity planning|Family engagement',
    'Human development research aide|Interviews|Data collection|Research ethics',
  ]),
  add('Interior Design', 'Arts & design', 'osu', 'Create functional, human-centered interiors through design and material choices.', [74, 37, 55000], { design: 5, creativity: 5, handsOn: 4, helping: 3 }, [
    'Interior design assistant|Space planning|CAD|Material selection',
    'Workplace design coordinator|Furniture specifications|Client communication|Presentation',
    'Residential design associate|Lighting plans|Color studies|Documentation',
  ], { alternativeNote: 'UO Interior Architecture is a distinct professional degree with a different program structure.' }),
  add('Liberal Studies', 'People & society', 'osu', 'Design a broad course of study across the humanities and social sciences.', [62, 47, 46000], { research: 4, writing: 4, communication: 4, socialImpact: 3 }, [
    'Nonprofit program assistant|Research|Outreach|Organization',
    'Administrative coordinator|Planning|Communication|Documentation',
    'Community education associate|Facilitation|Writing|Event support',
  ]),
  add('Marine Studies', 'Environment', 'osu', 'Connect ocean science with coastal communities, policy, and culture.', [70, 24, 51000], { nature: 5, science: 4, socialImpact: 4, research: 4 }, [
    'Coastal program assistant|Community outreach|Marine policy|Research',
    'Marine conservation coordinator|Habitat awareness|Project planning|Data collection',
    'Ocean education associate|Science communication|Program design|Public speaking',
  ], { alternativeNote: 'UO Marine Biology focuses on marine organisms; OSU Marine Studies spans ocean science, people, and policy.' }),
  add('Music Studies', 'Arts & design', 'osu', 'Pursue intensive musical training through the Bachelor of Music pathway.', [59, 29, 44000], { creativity: 5, handsOn: 5, communication: 3, structure: 4 }, [
    'Music instructor assistant|Performance|Lesson planning|Feedback',
    'Ensemble coordinator|Rehearsal planning|Musicianship|Scheduling',
    'Performing arts program associate|Event production|Community outreach|Organization',
  ], { programNames: { osu: 'Music Studies (BM)' }, alternativeNote: 'UO offers Music plus distinct performance, composition, education, and jazz degrees. Compare the particular BM concentrations.' }),
  add('Public Policy', 'People & society', 'osu', 'Study how public decisions are made and how to improve them.', [73, 43, 52000], { socialImpact: 5, research: 5, writing: 4, numbers: 3 }, [
    'Public policy analyst assistant|Policy research|Data analysis|Brief writing',
    'Government program coordinator|Implementation|Stakeholder outreach|Reporting',
    'Legislative research aide|Bill tracking|Fact-checking|Communication',
  ], { alternativeNote: 'UO Planning, Public Policy and Management is a related but distinctly named major with a planning component.' }),
  add('Secondary Education', 'People & society', 'osu', 'Prepare to teach a subject and connect with learners in middle or high school.', [84, 14, 49000], { helping: 5, communication: 5, science: 2, leadership: 4 }, [
    'Secondary school teacher|Subject instruction|Classroom management|Assessment|State teacher licensure is required for public-school teaching.',
    'After-school program educator|Tutoring|Activity planning|Mentoring',
    'Curriculum support assistant|Instructional materials|Research|Feedback',
  ], { alternativeNote: 'UO Educational Foundations prepares students for education-related pathways but is not the same named teaching major.' }),
  add('Social Science', 'People & society', 'both-uo', 'Explore people and societies across history, geography, economics, and politics.', [66, 46, 49000], { socialImpact: 5, research: 5, communication: 4, writing: 3 }, [
    'Social research assistant|Survey design|Data collection|Analysis',
    'Community program coordinator|Outreach|Project planning|Reporting',
    'Policy support associate|Background research|Briefing|Communication',
  ], { programNames: { osu: 'Social Science', uo: 'General Social Science' }, reason: 'Our pick for a flexible, multidisciplinary social science degree is UO, which lists General Social Science. OSU offers Social Science; compare concentration options and preferred learning formats.' }),
  add('Tourism, Recreation, and Adventure Leadership', 'Environment', 'osu', 'Lead responsible outdoor experiences and nature-based recreation.', [72, 18, 47000], { nature: 5, handsOn: 5, leadership: 5, communication: 4 }, [
    'Outdoor program coordinator|Trip planning|Risk management|Leadership',
    'Tourism development assistant|Visitor research|Community engagement|Marketing',
    'Recreation specialist|Program delivery|Accessibility|Safety',
  ]),

  // Same or comparable majors directly offered by both universities.
  add('Anthropology', 'People & society', 'both-uo', 'Study human cultures, histories, and ways of living across the world.', [62, 37, 47000], { research: 5, socialImpact: 5, writing: 4, communication: 4 }, [
    'Archaeology field technician|Excavation|Site records|Artifact handling',
    'Cultural research assistant|Interviewing|Ethnography|Analysis',
    'Museum collections assistant|Cataloging|Research|Public education',
  ], { reason: 'Our pick for an anthropology path tied to broad cultural and social-science study is UO. OSU also offers Anthropology, including archaeology and biocultural options; compare fieldwork opportunities.' }),
  add('Art', 'Arts & design', 'both-uo', 'Build a studio practice and explore how visual ideas shape culture.', [57, 61, 44000], { creativity: 5, design: 5, handsOn: 5, research: 2 }, [
    'Studio artist assistant|Studio methods|Material handling|Creative critique',
    'Gallery assistant|Exhibition prep|Art handling|Visitor engagement',
    'Community arts coordinator|Workshop planning|Outreach|Visual communication',
  ], { reason: 'Our pick for extensive studio and art-and-design study is UO. OSU also offers a direct Art major with studio and photography options; look closely at each campus\'s facilities and faculty.' }),
  add('Ethnic Studies', 'People & society', 'both-uo', 'Explore identity, history, power, and community through interdisciplinary study.', [64, 43, 46000], { socialImpact: 5, research: 5, writing: 4, helping: 3 }, [
    'Community advocacy associate|Outreach|Policy awareness|Listening',
    'Cultural programs assistant|Research|Event planning|Interpretation',
    'Equity program coordinator|Facilitation|Data tracking|Communication',
  ], { reason: 'Our editorial pick for interdisciplinary ethnic studies is UO. OSU also offers Ethnic Studies; compare the courses, community partnerships, and research questions most important to you.' }),
  add('French and Francophone Studies', 'People & society', 'both-uo', 'Study French language and Francophone cultures, histories, and literature.', [59, 44, 45000], { communication: 5, writing: 4, research: 3, socialImpact: 3 }, [
    'Bilingual client services associate|French language|Client communication|Cultural awareness',
    'Localization assistant|Translation review|Editing|Research',
    'International program coordinator|Cross-cultural communication|Planning|Writing',
  ], { programNames: { osu: 'French', uo: 'French and Francophone Studies' }, reason: 'UO is our editorial pick for its explicitly Francophone-focused major. OSU also offers a French major; compare the language sequence, study-abroad access, and literature courses.' }),
  add('German', 'People & society', 'both-uo', 'Learn German and explore language, culture, and transatlantic connections.', [59, 44, 45000], { communication: 5, writing: 4, research: 3, business: 2 }, [
    'Bilingual operations associate|German language|Client communication|Organization',
    'Translation assistant|Editing|Terminology research|Language accuracy',
    'Cultural program aide|Event planning|Research|Public engagement',
  ], { reason: 'Both universities offer German. We suggest UO for students seeking a language-and-culture environment; OSU is a direct alternative, and the right choice depends on courses and study-abroad fit.' }),
  add('Global Studies', 'People & society', 'both-uo', 'Connect cultures and global systems to questions of development and change.', [68, 46, 49000], { socialImpact: 5, communication: 5, research: 4, writing: 3 }, [
    'International program assistant|Cross-cultural communication|Planning|Research',
    'NGO program coordinator|Partner outreach|Reporting|Project support',
    'Global affairs research aide|Policy monitoring|Writing|Analysis',
  ], { reason: 'Our suggested fit is UO for globally focused interdisciplinary study. OSU also offers Global Studies; compare language study, study abroad, and policy electives before choosing.' }),
  add('History', 'People & society', 'both-uo', 'Investigate the past to better understand people, places, and ideas today.', [61, 46, 46000], { research: 5, writing: 5, socialImpact: 3, communication: 3 }, [
    'Archival research assistant|Primary sources|Cataloging|Writing',
    'Museum education associate|Interpretation|Public speaking|Research',
    'Historical records specialist|Document analysis|Organization|Digital archives',
  ], { reason: 'Our pick for a history path among the humanities is UO. OSU also offers History, including an online route; compare faculty specialties and archival opportunities.' }),
  add('Music', 'Arts & design', 'both-uo', 'Develop musicianship through study of performance, theory, and music culture.', [58, 31, 44000], { creativity: 5, handsOn: 5, structure: 3, communication: 3 }, [
    'Music program assistant|Performance|Rehearsal planning|Organization',
    'Audio production associate|Recording|Editing|Collaboration',
    'Community music coordinator|Event planning|Instruction|Outreach',
  ], { reason: 'We suggest UO for students seeking a broad music school with multiple distinct BM specializations. OSU also offers the BA/BS in Music and a separate Music Studies BM.' }),
  add('Philosophy', 'People & society', 'both-uo', 'Practice clear reasoning around questions of ethics, knowledge, and life.', [62, 45, 48000], { problemSolving: 5, writing: 5, research: 5, socialImpact: 3 }, [
    'Policy research assistant|Argument analysis|Research|Writing',
    'Ethics program coordinator|Facilitation|Documentation|Critical reasoning',
    'Editorial researcher|Fact-checking|Synthesis|Communication',
  ], { reason: 'Our pick for philosophy is UO for humanities-centered exploration. OSU also offers the major; compare course offerings in ethics, logic, and applied philosophy.' }),
  add('Religious Studies', 'People & society', 'both-uo', 'Explore religious traditions and their influence on communities and history.', [58, 43, 44000], { research: 5, writing: 5, socialImpact: 4, communication: 3 }, [
    'Cultural research assistant|Qualitative research|Historical sources|Writing',
    'Museum interpretation associate|Exhibit research|Public engagement|Editing',
    'Community dialogue coordinator|Facilitation|Cross-cultural awareness|Outreach',
  ], { reason: 'UO is our suggested fit for religious studies alongside a wide humanities curriculum. OSU also lists Religious Studies as a direct undergraduate major.' }),
  add('Sociology', 'People & society', 'both-uo', 'Study communities, institutions, and the social forces shaping everyday life.', [68, 39, 48000], { research: 5, socialImpact: 5, communication: 4, helping: 3 }, [
    'Social research assistant|Survey design|Interviews|Statistics',
    'Community program associate|Outreach|Evaluation|Reporting',
    'People analytics coordinator|Data collection|Trend analysis|Communication',
  ], { reason: 'Our pick for a broad social-science environment is UO. OSU also offers Sociology, including online study; compare research topics and methods courses.' }),
  add('Spanish', 'People & society', 'both-uo', 'Build Spanish fluency and explore the cultures of Spanish-speaking communities.', [65, 38, 46000], { communication: 5, writing: 4, helping: 4, socialImpact: 3 }, [
    'Bilingual outreach specialist|Spanish language|Community engagement|Translation review',
    'Localization assistant|Editing|Cultural awareness|Terminology research',
    'International services coordinator|Client communication|Organization|Writing',
  ], { reason: 'Our suggested fit for language and literature study is UO. OSU also offers Spanish; look at conversation courses, study abroad, and the work you want to do with your language skills.' }),
  add('Theater Arts', 'Arts & design', 'both-uo', 'Bring stories to the stage through performance, production, and collaboration.', [57, 34, 43000], { creativity: 5, communication: 5, handsOn: 5, design: 3 }, [
    'Theater production assistant|Stagecraft|Scheduling|Teamwork',
    'Community theater coordinator|Event planning|Audience engagement|Performance',
    'Stage management assistant|Cue tracking|Production communication|Organization',
  ], { programNames: { osu: 'Theatre Arts', uo: 'Theater Arts' }, reason: 'Our pick for theater within a larger performing-arts environment is UO. OSU also offers Theatre Arts; compare production schedules and hands-on opportunities.' }),
  add('Women, Gender, and Sexuality Studies', 'People & society', 'both-uo', 'Examine gender, identity, and social change across disciplines.', [64, 41, 46000], { socialImpact: 5, research: 4, writing: 4, helping: 4 }, [
    'Advocacy program associate|Community outreach|Policy awareness|Writing',
    'Equity research aide|Interviews|Data analysis|Research ethics',
    'Nonprofit communications assistant|Campaign writing|Event planning|Storytelling',
  ], { reason: 'Both schools offer this major. We suggest UO for its wider interdisciplinary humanities setting; OSU is also a direct option, and community partnerships may be the deciding factor.' }),

  // UO design, performing arts, journalism, language, and humanities majors.
  add('Art and Technology', 'Arts & design', 'uo', 'Combine studio art with digital media and emerging creative technology.', [66, 59, 51000], { creativity: 5, design: 5, technology: 4, handsOn: 3 }, [
    'Digital artist assistant|Creative coding|Visual storytelling|Prototyping',
    'Interactive media designer|Digital tools|User experience|Iteration',
    'Exhibition technologist|Installation|Media systems|Collaboration',
  ], { alternativeNote: 'OSU Arts, Media, and Technology is related but offered under a separate curriculum at OSU-Cascades.' }),
  add('Art History', 'Arts & design', 'uo', 'Learn to interpret images, objects, and visual culture across time.', [59, 42, 45000], { research: 5, writing: 5, design: 4, creativity: 3 }, [
    'Museum collections assistant|Cataloging|Object research|Documentation',
    'Gallery program associate|Exhibition research|Visitor engagement|Writing',
    'Art archive assistant|Provenance research|Database records|Image analysis',
  ], { alternativeNote: 'OSU Art offers an Art History option, but Art History is not a separate OSU major.' }),
  add('Asian Studies', 'People & society', 'uo', 'Study the histories, cultures, and societies of Asia across disciplines.', [62, 41, 47000], { research: 5, socialImpact: 4, communication: 4, writing: 4 }, [
    'International program associate|Cross-cultural research|Outreach|Writing',
    'Asia policy research aide|Source analysis|Brief writing|Communication',
    'Cultural education coordinator|Program planning|Public speaking|Research',
  ], { alternativeNote: 'OSU lists Asian Studies as a minor, not a standalone undergraduate major.' }),
  add('Chinese', 'People & society', 'uo', 'Build Chinese language proficiency and understand Chinese-language cultures.', [63, 39, 48000], { communication: 5, writing: 4, research: 3, business: 3 }, [
    'Bilingual client service assistant|Chinese language|Client communication|Organization',
    'Localization coordinator|Terminology research|Translation review|Editing',
    'International trade assistant|Cross-cultural communication|Market research|Scheduling',
  ]),
  add('Cinema Studies', 'Arts & design', 'uo', 'Analyze moving images, media industries, and the stories film can tell.', [60, 55, 46000], { creativity: 5, research: 4, writing: 4, communication: 4 }, [
    'Film programming assistant|Film research|Event planning|Audience engagement',
    'Media production coordinator|Scheduling|Editing basics|Collaboration',
    'Screen culture researcher|Critical analysis|Writing|Archival research',
  ]),
  add('Classics', 'People & society', 'uo', 'Explore the languages, histories, and ideas of the ancient world.', [56, 43, 44000], { research: 5, writing: 5, communication: 3, socialImpact: 2 }, [
    'Museum education assistant|Historical interpretation|Research|Public speaking',
    'Classical texts researcher|Text analysis|Editing|Language study',
    'Cultural heritage assistant|Archives|Cataloging|Documentation',
  ]),
  add('Comparative Literature', 'People & society', 'uo', 'Read across languages and traditions to understand stories in global context.', [56, 58, 45000], { writing: 5, research: 5, communication: 4, creativity: 4 }, [
    'Literary editorial assistant|Close reading|Editing|Research',
    'Translation project coordinator|Language research|Project planning|Cultural awareness',
    'Publishing assistant|Manuscript review|Writing|Organization',
  ]),
  add('Dance', 'Arts & design', 'uo', 'Explore movement as an art, a discipline, and a form of expression.', [56, 17, 41000], { creativity: 5, handsOn: 5, communication: 4, science: 2 }, [
    'Dance company assistant|Rehearsal support|Choreography|Coordination',
    'Dance instructor|Movement instruction|Lesson planning|Feedback|Teaching credentials may vary by school or studio.',
    'Performing arts coordinator|Event planning|Community outreach|Production',
  ]),
  add('Environmental Design', 'Arts & design', 'uo', 'Think across built environments, human needs, and sustainable places.', [71, 29, 54000], { design: 5, nature: 4, socialImpact: 4, creativity: 4 }, [
    'Environmental design assistant|Site analysis|Visual communication|Mapping',
    'Sustainability design coordinator|Material research|Design review|Project support',
    'Community design associate|Engagement|Spatial research|Presentation',
  ], { alternativeNote: 'OSU Environmental Sciences and Design and Innovation Management offer related perspectives, not the same named major.' }),
  add('Folklore and Public Culture', 'People & society', 'uo', 'Study living traditions, storytelling, and the cultural practices of communities.', [57, 40, 43000], { research: 5, writing: 5, socialImpact: 4, communication: 4 }, [
    'Oral history project assistant|Interviewing|Recording|Archival organization',
    'Cultural heritage coordinator|Community outreach|Exhibit writing|Research',
    'Public arts program aide|Event planning|Interpretation|Documentation',
  ]),
  add('Humanities', 'People & society', 'uo', 'Create an interdisciplinary path through literature, history, art, and ideas.', [58, 50, 45000], { writing: 5, research: 5, creativity: 3, communication: 4 }, [
    'Cultural program assistant|Research|Writing|Event planning',
    'Editorial associate|Editing|Critical analysis|Fact-checking',
    'Education outreach aide|Lesson materials|Public speaking|Organization',
  ], { alternativeNote: 'OSU Liberal Studies and Applied Humanities are related degrees, but are not the same named Humanities major.' }),
  add('Interior Architecture', 'Arts & design', 'uo', 'Shape interior spaces with attention to experience, materials, and the built environment.', [73, 36, 57000], { design: 5, creativity: 5, handsOn: 4, problemSolving: 4 }, [
    'Interior architectural designer|Space planning|BIM|Materials',
    'Workplace design assistant|Construction documents|Client needs|Visualizations',
    'Interior project coordinator|Specifications|Scheduling|Design communication',
  ], { programNames: { uo: 'Interior Architecture (BIArch)' }, alternativeNote: 'OSU Interior Design is related but has a different professional curriculum. Licensure requirements vary by role and location.' }),
  add('Italian Studies', 'People & society', 'uo', 'Connect Italian language with its literature, culture, and history.', [55, 44, 44000], { communication: 5, writing: 4, research: 4, creativity: 2 }, [
    'International culture program aide|Italian language|Event planning|Research',
    'Localization assistant|Editing|Language accuracy|Cultural awareness',
    'Travel services coordinator|Client communication|Itinerary planning|Organization',
  ]),
  add('Japanese', 'People & society', 'uo', 'Study Japanese language alongside its literature and contemporary culture.', [63, 42, 47000], { communication: 5, research: 4, writing: 4, business: 2 }, [
    'Bilingual client service associate|Japanese language|Client communication|Organization',
    'Localization assistant|Translation review|Terminology|Editing',
    'Cultural programs assistant|Public outreach|Research|Event planning',
  ], { alternativeNote: 'OSU offers a Japanese Language and Culture minor, not the same standalone major.' }),
  add('Journalism: Advertising', 'Arts & design', 'uo', 'Create persuasive campaigns grounded in audience insights and storytelling.', [70, 69, 54000], { creativity: 5, communication: 5, writing: 4, business: 3 }, [
    'Advertising account coordinator|Client briefs|Campaign planning|Presentation',
    'Junior copywriter|Copywriting|Concept development|Editing',
    'Media planning associate|Audience research|Budget tracking|Analytics',
  ], { alternativeNote: 'UO catalogs Advertising as a distinct Journalism major. OSU Marketing and Digital Communication Arts are related but different degrees.' }),
  add('Journalism: Media Studies', 'Arts & design', 'uo', 'Investigate how media institutions, messages, and audiences shape public life.', [60, 58, 47000], { research: 5, writing: 4, communication: 5, socialImpact: 4 }, [
    'Media research assistant|Content analysis|Data collection|Writing',
    'Audience insights associate|Survey analysis|Reporting|Presentation',
    'Communications program assistant|Media monitoring|Editing|Outreach',
  ]),
  add('Journalism: Public Relations', 'Arts & design', 'uo', 'Build relationships between organizations and the people they serve.', [73, 59, 53000], { communication: 5, writing: 5, socialImpact: 3, leadership: 3 }, [
    'Public relations coordinator|Press materials|Media outreach|Writing',
    'Communications associate|Messaging|Campaign planning|Crisis awareness',
    'Community relations assistant|Stakeholder engagement|Event support|Listening',
  ], { alternativeNote: 'OSU has communication and marketing majors but does not list Public Relations as a direct undergraduate major.' }),
  add('Judaic Studies', 'People & society', 'uo', 'Explore Jewish histories, languages, ideas, and cultural expression.', [53, 40, 43000], { research: 5, writing: 5, socialImpact: 3, communication: 4 }, [
    'Cultural research assistant|Archival sources|Writing|Historical analysis',
    'Museum education aide|Exhibit research|Visitor engagement|Interpretation',
    'Community programming assistant|Event planning|Outreach|Communication',
  ]),
  add('Landscape Architecture', 'Arts & design', 'uo', 'Design outdoor spaces that work for communities and ecosystems.', [78, 26, 59000], { design: 5, nature: 5, socialImpact: 4, handsOn: 3 }, [
    'Landscape design associate|Site planning|CAD|Planting plans',
    'Parks design assistant|Community engagement|Mapping|Visualizations',
    'Green infrastructure coordinator|Stormwater basics|Site assessment|Project planning',
  ], { programNames: { uo: 'Landscape Architecture (BLA)' }, alternativeNote: 'OSU Horticulture and Environmental Sciences are related, but not a Landscape Architecture degree. Professional licensure requires further steps.' }),
  add('Latin American Studies', 'People & society', 'uo', 'Study the cultures, histories, and politics of Latin America.', [62, 42, 46000], { socialImpact: 5, research: 5, communication: 4, writing: 4 }, [
    'International NGO assistant|Regional research|Outreach|Reporting',
    'Cultural education associate|Program planning|Public speaking|Writing',
    'Policy research assistant|Source analysis|Brief preparation|Language skills',
  ]),
  add('Linguistics', 'People & society', 'uo', 'Understand how language works and changes across people and places.', [70, 49, 53000], { research: 5, communication: 5, numbers: 3, writing: 4 }, [
    'Language data annotator|Syntax analysis|Quality review|Documentation',
    'Speech research assistant|Phonetic analysis|Research methods|Data collection',
    'Localization specialist assistant|Language testing|Editing|Cultural awareness',
  ], { alternativeNote: 'OSU lists Linguistics as a minor, not a direct undergraduate major.' }),
  add('Medieval Studies', 'People & society', 'uo', 'Explore medieval histories, texts, languages, and art across cultures.', [51, 45, 42000], { research: 5, writing: 5, creativity: 2, communication: 3 }, [
    'Historical archive assistant|Primary sources|Cataloging|Transcription',
    'Museum program aide|Exhibit research|Interpretation|Public speaking',
    'Editorial researcher|Text analysis|Fact-checking|Writing',
  ]),
  add('Music Composition', 'Arts & design', 'uo', 'Create original music and develop the craft of composition.', [55, 47, 45000], { creativity: 5, handsOn: 5, structure: 4, technology: 3 }, [
    'Composer assistant|Score preparation|Music notation|Collaboration',
    'Media music production associate|Digital audio|Arrangement|Editing',
    'Arts programming assistant|Commission planning|Rehearsal coordination|Communication',
  ], { programNames: { uo: 'Music Composition (BMus)' }, alternativeNote: 'OSU Music Studies BM has different options; UO lists Music Composition as its own undergraduate major.' }),
  add('Music Education', 'Arts & design', 'uo', 'Prepare to share musicianship through instruction and ensemble leadership.', [76, 20, 47000], { creativity: 5, helping: 5, communication: 5, handsOn: 4 }, [
    'School music teacher|Music instruction|Classroom management|Performance|Public school teaching requires state licensure.',
    'Youth ensemble coordinator|Rehearsal planning|Mentoring|Scheduling',
    'Community arts educator|Lesson design|Music theory|Outreach',
  ], { programNames: { uo: 'Music Education (BMME)' }, alternativeNote: 'OSU Music Studies offers a Music Education option, not the same named undergraduate major. Confirm licensure requirements with either program.' }),
  add('Music: Jazz Studies', 'Arts & design', 'uo', 'Immerse yourself in jazz performance, improvisation, and ensemble work.', [52, 25, 43000], { creativity: 5, handsOn: 5, communication: 4, research: 2 }, [
    'Jazz ensemble performer|Improvisation|Collaboration|Rehearsal',
    'Music instructor assistant|Instrument coaching|Listening|Feedback',
    'Live music program aide|Performance planning|Event coordination|Outreach',
  ], { programNames: { uo: 'Music: Jazz Studies (BMus)' }, alternativeNote: 'OSU offers Music and Music Studies, but not a separately titled Jazz Studies undergraduate major.' }),
  add('Music Performance', 'Arts & design', 'uo', 'Build technical mastery and an expressive voice through focused performance.', [52, 23, 43000], { creativity: 5, handsOn: 5, structure: 5, communication: 3 }, [
    'Performing musician|Instrument technique|Rehearsal|Collaboration',
    'Private music instructor|Lesson planning|Demonstration|Feedback',
    'Ensemble administrator|Scheduling|Score preparation|Communication',
  ], { programNames: { uo: 'Music Performance (BMus)' }, alternativeNote: 'OSU Music Studies includes performance options; UO lists Music Performance as its own undergraduate major.' }),
  add('Popular Music', 'Arts & design', 'uo', 'Explore contemporary music creation, performance, and popular music culture.', [58, 53, 45000], { creativity: 5, handsOn: 4, technology: 4, communication: 4 }, [
    'Music producer assistant|Audio editing|Recording|Collaboration',
    'Artist marketing associate|Release planning|Audience research|Content creation',
    'Live event coordinator|Show logistics|Venue communication|Scheduling',
  ], { alternativeNote: 'OSU Contemporary Music Industry is a related but separately named undergraduate major.' }),
  add('Romance Languages', 'People & society', 'uo', 'Study languages and cultures across the Romance-language world.', [58, 44, 45000], { communication: 5, research: 4, writing: 5, socialImpact: 3 }, [
    'Multilingual client services associate|Language fluency|Client communication|Cultural awareness',
    'Translation project assistant|Editing|Terminology research|Organization',
    'International programs coordinator|Planning|Outreach|Writing',
  ]),
  add('Russian, East European, and Eurasian Studies', 'People & society', 'uo', 'Explore the histories and cultures of Russia, Eastern Europe, and Eurasia.', [58, 39, 47000], { research: 5, writing: 4, communication: 4, socialImpact: 4 }, [
    'Regional research assistant|Source analysis|Language study|Writing',
    'Cultural programs associate|Community outreach|Event planning|Research',
    'International policy aide|Brief writing|Regional awareness|Fact-checking',
  ]),

  // UO health, education, computing, environment, and natural sciences.
  add('Biochemistry', 'Natural sciences', 'uo', 'Study life through the chemistry of cells, proteins, and molecules.', [77, 34, 56000], { science: 5, research: 5, handsOn: 4, numbers: 3 }, [
    'Biochemistry research technician|Protein assays|Lab safety|Data analysis',
    'Biotechnology associate|Sample processing|Experimental protocols|Documentation',
    'Quality control analyst|Analytical testing|Validation|Reporting',
  ], { alternativeNote: 'OSU offers Biochemistry and Biophysics and Biochemistry and Molecular Biology as two separately named majors.' }),
  add('Child Behavioral Health', 'People & society', 'uo', 'Help children and families through behavioral health and prevention science.', [85, 14, 47000], { helping: 5, socialImpact: 5, science: 4, communication: 4 }, [
    'Youth behavioral health specialist assistant|Behavior observation|Documentation|Family support',
    'Prevention program coordinator|Program delivery|Community outreach|Evaluation',
    'Child development research assistant|Research ethics|Data collection|Participant support',
  ], { alternativeNote: 'OSU Human Development and Family Sciences is related, not the same Child Behavioral Health undergraduate major. Clinical practice may require licensure or graduate study.' }),
  add('Communication Disorders and Sciences', 'People & society', 'uo', 'Explore speech, language, and hearing across human development.', [82, 17, 47000], { helping: 5, science: 4, communication: 5, research: 3 }, [
    'Speech-language pathology assistant|Therapy support|Documentation|Communication|Requirements vary by state; speech-language pathologist licensure requires graduate training.',
    'Audiology clinic assistant|Patient scheduling|Hearing-test preparation|Recordkeeping',
    'Language research assistant|Speech data|Research ethics|Data coding',
  ], { alternativeNote: 'OSU does not offer the same standalone undergraduate major. Independent SLP or audiologist practice requires further education and licensure.' }),
  add('Cybersecurity', 'Technology', 'uo', 'Protect digital systems and help organizations respond to cyber threats.', [91, 52, 77000], { technology: 5, problemSolving: 5, structure: 4, research: 3 }, [
    'Security operations analyst|Threat monitoring|Incident response|Log analysis',
    'Information security associate|Risk assessment|Network basics|Documentation',
    'Digital forensics technician|Evidence handling|System analysis|Reporting',
  ], { alternativeNote: 'OSU offers a Cybersecurity option within Computer Science and a certificate, but not a standalone Cybersecurity major.' }),
  add('Earth Sciences', 'Natural sciences', 'uo', 'Investigate the planet through geology, geophysics, and Earth systems.', [75, 21, 57000], { nature: 5, science: 5, handsOn: 4, research: 4 }, [
    'Earth science field technician|Mapping|Field sampling|Lab methods',
    'Geophysics research assistant|Sensor data|Mathematical modeling|Analysis',
    'Environmental site associate|Geologic records|GIS|Reporting',
  ], { alternativeNote: 'OSU Geology and Oceanography are related direct majors, but not the same broad Earth Sciences major.' }),
  add('Educational Foundations', 'People & society', 'uo', 'Examine how people learn and how schools and communities support them.', [75, 23, 45000], { helping: 5, socialImpact: 4, research: 3, communication: 5 }, [
    'Education program coordinator|Curriculum support|Scheduling|Outreach',
    'Youth development specialist|Mentoring|Activity design|Family communication',
    'Learning research assistant|Classroom observation|Data collection|Writing',
  ], { alternativeNote: 'OSU Elementary Education and Secondary Education are direct teaching majors. Confirm licensing pathways separately with UO.' }),
  add('Environmental Studies', 'Environment', 'uo', 'Connect environmental challenges to culture, policy, and community change.', [75, 26, 51000], { nature: 5, socialImpact: 5, writing: 4, research: 4 }, [
    'Environmental policy associate|Policy research|Brief writing|Stakeholder outreach',
    'Community sustainability coordinator|Program planning|Engagement|Reporting',
    'Conservation education assistant|Public speaking|Curriculum design|Environmental awareness',
  ], { alternativeNote: 'OSU offers Environmental Sciences and Sustainability; neither is the same Environmental Studies major.' }),
  add('Family and Human Services', 'People & society', 'uo', 'Connect individuals and families with the support they need to thrive.', [81, 15, 45000], { helping: 5, socialImpact: 5, communication: 5, leadership: 2 }, [
    'Family support specialist|Resource navigation|Active listening|Documentation',
    'Community services coordinator|Outreach|Program planning|Case tracking',
    'Youth services assistant|Mentoring|Safeguarding|Communication',
  ], { alternativeNote: 'OSU Human Development and Family Sciences has related content, but is a different named major.' }),
  add('Human Physiology', 'People & society', 'uo', 'Study how the human body works from cells to movement and health.', [81, 20, 50000], { science: 5, helping: 4, handsOn: 4, research: 4 }, [
    'Clinical research assistant|Participant support|Physiology measures|Data recording',
    'Exercise physiology associate|Fitness testing|Program design|Physiology',
    'Rehabilitation technician|Patient support|Movement observation|Documentation',
  ], { alternativeNote: 'OSU Kinesiology and BioHealth Sciences are related, but not the same Human Physiology major. Many clinical roles require graduate or professional education.' }),
  add('Marine Biology', 'Natural sciences', 'uo', 'Explore life in the ocean through marine ecosystems, organisms, and field science.', [73, 17, 49000], { nature: 5, science: 5, research: 5, handsOn: 4 }, [
    'Marine biology field technician|Species surveys|Water sampling|Field safety',
    'Marine research assistant|Experimental methods|Data analysis|Scientific writing',
    'Aquarium husbandry specialist|Animal care|Water quality|Observation',
  ], { alternativeNote: 'OSU offers Marine Biology and Ecology as an option within Biology, not a separate Marine Biology undergraduate major.' }),
  add('Materials Science and Technology', 'Natural sciences', 'uo', 'Investigate materials and develop new ways to use their properties.', [80, 32, 65000], { science: 5, research: 5, handsOn: 4, technology: 4 }, [
    'Materials lab technician|Sample characterization|Testing|Lab safety',
    'Product materials analyst|Material selection|Data analysis|Documentation',
    'Research associate|Microscopy|Experimental design|Technical writing',
  ], { alternativeNote: 'OSU offers materials-related options and a minor, but its Materials Science major is graduate-level.' }),
  add('Mathematics and Computer Science', 'Technology', 'uo', 'Combine mathematical reasoning with programming and computational thinking.', [86, 52, 73000], { numbers: 5, technology: 5, problemSolving: 5, research: 3 }, [
    'Software engineer associate|Algorithms|Programming|Testing',
    'Quantitative analyst assistant|Modeling|Statistics|Python',
    'Operations research associate|Optimization|Data analysis|Presentation',
  ], { alternativeNote: 'OSU offers Mathematics and Computer Science as separate majors, not this combined named major.' }),
  add('Multidisciplinary Science', 'Natural sciences', 'uo', 'Build a flexible science degree across multiple disciplines.', [70, 34, 52000], { science: 5, research: 4, problemSolving: 4, communication: 3 }, [
    'Science outreach coordinator|Science communication|Lesson planning|Public speaking',
    'Research laboratory associate|Lab techniques|Data collection|Reporting',
    'Environmental data assistant|Field methods|Statistics|Documentation',
  ], { alternativeNote: 'OSU has several science majors and interdisciplinary options, but not this same named major.' }),
  add('Native American and Indigenous Studies', 'People & society', 'uo', 'Center Indigenous perspectives, histories, cultures, and sovereignty.', [63, 37, 46000], { socialImpact: 5, research: 5, writing: 4, communication: 4 }, [
    'Tribal program assistant|Community engagement|Cultural awareness|Reporting',
    'Indigenous policy research aide|Historical research|Policy reading|Writing',
    'Cultural education coordinator|Curriculum support|Outreach|Facilitation',
  ], { alternativeNote: 'OSU lists Indigenous Studies as a minor, not the same undergraduate major.' }),
  add('Neuroscience', 'Natural sciences', 'uo', 'Study the brain and nervous system through biology and behavior.', [78, 29, 54000], { science: 5, research: 5, helping: 3, numbers: 3 }, [
    'Neuroscience research assistant|Experimental protocols|Data analysis|Lab records',
    'Clinical research coordinator assistant|Participant scheduling|Ethics|Documentation',
    'Neurotechnology lab associate|Instrumentation|Signal analysis|Testing',
  ], { alternativeNote: 'OSU offers Biology and Psychology pathways, but no separately named undergraduate Neuroscience major.' }),
  add('Planning, Public Policy and Management', 'People & society', 'uo', 'Help shape the places, policies, and organizations serving communities.', [75, 35, 54000], { socialImpact: 5, research: 4, leadership: 4, nature: 3 }, [
    'Urban planning assistant|Land-use research|GIS|Community engagement',
    'Policy program associate|Brief writing|Data analysis|Stakeholder coordination',
    'Nonprofit management coordinator|Budget tracking|Outreach|Program planning',
  ], { alternativeNote: 'OSU offers a standalone Public Policy major, but not this combined planning, policy, and management major.' }),
  add('Spatial Data Science and Technology', 'Technology', 'uo', 'Turn geospatial data into insight about the world around us.', [84, 49, 65000], { technology: 5, numbers: 5, nature: 4, problemSolving: 4 }, [
    'Geospatial data analyst|GIS|Python|Spatial statistics',
    'Remote sensing technician|Satellite imagery|Image processing|Mapping',
    'Location intelligence associate|Data visualization|Geocoding|Research',
  ], { alternativeNote: 'OSU Geography and Geospatial Science and Data Science are related degrees, not the same standalone Spatial Data Science and Technology major.' }),
];