import { ScrapedJob } from './types'

// ---------------------------------------------------------------------------
// Data pools used to generate realistic Indian job listings
// ---------------------------------------------------------------------------

const COMPANIES: { name: string; logo?: string; industries: string[] }[] = [
  { name: 'Tata Consultancy Services', logo: 'https://logo.clearbit.com/tcs.com', industries: ['IT Services', 'Consulting'] },
  { name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com', industries: ['IT Services', 'Consulting'] },
  { name: 'Wipro', logo: 'https://logo.clearbit.com/wipro.com', industries: ['IT Services'] },
  { name: 'HCL Technologies', logo: 'https://logo.clearbit.com/hcltech.com', industries: ['IT Services'] },
  { name: 'Tech Mahindra', logo: 'https://logo.clearbit.com/techmahindra.com', industries: ['IT Services', 'Telecom'] },
  { name: 'Reliance Industries', logo: 'https://logo.clearbit.com/ril.com', industries: ['Conglomerate', 'Energy', 'Retail'] },
  { name: 'HDFC Bank', logo: 'https://logo.clearbit.com/hdfcbank.com', industries: ['Banking', 'Finance'] },
  { name: 'ICICI Bank', logo: 'https://logo.clearbit.com/icicibank.com', industries: ['Banking', 'Finance'] },
  { name: 'State Bank of India', logo: 'https://logo.clearbit.com/sbi.co.in', industries: ['Banking', 'Finance'] },
  { name: 'Kotak Mahindra Bank', logo: 'https://logo.clearbit.com/kotak.com', industries: ['Banking', 'Finance'] },
  { name: 'Flipkart', logo: 'https://logo.clearbit.com/flipkart.com', industries: ['E-Commerce', 'Technology'] },
  { name: 'Zomato', logo: 'https://logo.clearbit.com/zomato.com', industries: ['Food Tech', 'Technology'] },
  { name: 'Swiggy', logo: 'https://logo.clearbit.com/swiggy.com', industries: ['Food Tech', 'Technology'] },
  { name: 'Paytm', logo: 'https://logo.clearbit.com/paytm.com', industries: ['Fintech', 'Technology'] },
  { name: 'PhonePe', logo: 'https://logo.clearbit.com/phonepe.com', industries: ['Fintech', 'Technology'] },
  { name: 'Razorpay', logo: 'https://logo.clearbit.com/razorpay.com', industries: ['Fintech', 'Technology'] },
  { name: 'Freshworks', logo: 'https://logo.clearbit.com/freshworks.com', industries: ['SaaS', 'Technology'] },
  { name: 'Zoho', logo: 'https://logo.clearbit.com/zoho.com', industries: ['SaaS', 'Technology'] },
  { name: 'L&T Infotech', logo: 'https://logo.clearbit.com/ltimindtree.com', industries: ['IT Services'] },
  { name: 'Mahindra & Mahindra', logo: 'https://logo.clearbit.com/mahindra.com', industries: ['Automotive', 'Manufacturing'] },
  { name: 'Tata Motors', logo: 'https://logo.clearbit.com/tatamotors.com', industries: ['Automotive', 'Manufacturing'] },
  { name: 'Bajaj Auto', logo: 'https://logo.clearbit.com/bajajauto.com', industries: ['Automotive', 'Manufacturing'] },
  { name: 'Asian Paints', logo: 'https://logo.clearbit.com/asianpaints.com', industries: ['Manufacturing', 'FMCG'] },
  { name: 'ITC Limited', logo: 'https://logo.clearbit.com/itcportal.com', industries: ['FMCG', 'Hospitality'] },
  { name: 'Hindustan Unilever', logo: 'https://logo.clearbit.com/hul.co.in', industries: ['FMCG'] },
  { name: 'Byju\'s', logo: 'https://logo.clearbit.com/byjus.com', industries: ['EdTech', 'Technology'] },
  { name: 'Ola', logo: 'https://logo.clearbit.com/olacabs.com', industries: ['Mobility', 'Technology'] },
  { name: 'CRED', logo: 'https://logo.clearbit.com/cred.club', industries: ['Fintech', 'Technology'] },
  { name: 'Meesho', logo: 'https://logo.clearbit.com/meesho.com', industries: ['E-Commerce', 'Technology'] },
  { name: 'Dream11', logo: 'https://logo.clearbit.com/dream11.com', industries: ['Gaming', 'Technology'] },
  { name: 'Zerodha', logo: 'https://logo.clearbit.com/zerodha.com', industries: ['Fintech', 'Broking'] },
  { name: 'Groww', logo: 'https://logo.clearbit.com/groww.in', industries: ['Fintech', 'Technology'] },
  { name: 'Nykaa', logo: 'https://logo.clearbit.com/nykaa.com', industries: ['E-Commerce', 'Beauty'] },
  { name: 'PolicyBazaar', logo: 'https://logo.clearbit.com/policybazaar.com', industries: ['Insurtech', 'Finance'] },
  { name: 'Delhivery', logo: 'https://logo.clearbit.com/delhivery.com', industries: ['Logistics', 'Technology'] },
  { name: 'MakeMyTrip', logo: 'https://logo.clearbit.com/makemytrip.com', industries: ['Travel', 'Technology'] },
  { name: 'Cognizant', logo: 'https://logo.clearbit.com/cognizant.com', industries: ['IT Services', 'Consulting'] },
  { name: 'Accenture India', logo: 'https://logo.clearbit.com/accenture.com', industries: ['Consulting', 'IT Services'] },
  { name: 'Deloitte India', logo: 'https://logo.clearbit.com/deloitte.com', industries: ['Consulting', 'Finance'] },
  { name: 'Amazon India', logo: 'https://logo.clearbit.com/amazon.in', industries: ['E-Commerce', 'Technology', 'Cloud'] },
  { name: 'Google India', logo: 'https://logo.clearbit.com/google.com', industries: ['Technology', 'Advertising'] },
  { name: 'Microsoft India', logo: 'https://logo.clearbit.com/microsoft.com', industries: ['Technology', 'Cloud'] },
  { name: 'Jio Platforms', logo: 'https://logo.clearbit.com/jio.com', industries: ['Telecom', 'Technology'] },
  { name: 'Bharti Airtel', logo: 'https://logo.clearbit.com/airtel.in', industries: ['Telecom'] },
  { name: 'Sun Pharma', logo: 'https://logo.clearbit.com/sunpharma.com', industries: ['Pharmaceuticals', 'Healthcare'] },
  { name: 'Cipla', logo: 'https://logo.clearbit.com/cipla.com', industries: ['Pharmaceuticals', 'Healthcare'] },
  { name: 'Apollo Hospitals', logo: 'https://logo.clearbit.com/apollohospitals.com', industries: ['Healthcare'] },
  { name: 'Vedantu', logo: 'https://logo.clearbit.com/vedantu.com', industries: ['EdTech', 'Technology'] },
  { name: 'upGrad', logo: 'https://logo.clearbit.com/upgrad.com', industries: ['EdTech', 'Technology'] },
  { name: 'Lenskart', logo: 'https://logo.clearbit.com/lenskart.com', industries: ['E-Commerce', 'Retail'] },
]

const CITIES = [
  'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Pune',
  'Kolkata', 'Ahmedabad', 'Jaipur', 'Noida', 'Gurugram', 'Kochi',
  'Chandigarh', 'Indore', 'Lucknow', 'Coimbatore', 'Thiruvananthapuram',
  'Nagpur', 'Visakhapatnam', 'Bhubaneswar',
]

// ---------------------------------------------------------------------------
// Job role definitions grouped by domain
// ---------------------------------------------------------------------------

interface RoleTemplate {
  title: string
  skills: string[]
  salaryRange: [number, number] // [min LPA, max LPA]
  experienceRange: [number, number]
  industry: string
  descriptionTemplate: string
}

const ROLE_TEMPLATES: RoleTemplate[] = [
  // ---------- Software Engineering ----------
  {
    title: 'Software Engineer',
    skills: ['Java', 'Spring Boot', 'Microservices', 'REST APIs', 'SQL', 'Git'],
    salaryRange: [6, 18],
    experienceRange: [1, 5],
    industry: 'Technology',
    descriptionTemplate: `We are looking for a talented Software Engineer to join our engineering team. You will design, develop, and maintain high-quality software solutions that serve millions of users across India.

As a Software Engineer, you will work closely with cross-functional teams to translate business requirements into scalable technical solutions. You will participate in code reviews, architectural discussions, and agile ceremonies.

Requirements include strong proficiency in backend development, experience with distributed systems, and a passion for writing clean, maintainable code. A B.Tech/B.E. in Computer Science or equivalent is preferred.`,
  },
  {
    title: 'Senior Software Engineer',
    skills: ['Java', 'Python', 'Kubernetes', 'AWS', 'System Design', 'CI/CD', 'PostgreSQL'],
    salaryRange: [15, 35],
    experienceRange: [4, 8],
    industry: 'Technology',
    descriptionTemplate: `We are hiring a Senior Software Engineer to lead critical projects and mentor junior engineers. You will be responsible for building and scaling systems that handle millions of transactions daily.

In this role, you will drive technical decisions, lead design reviews, and ensure our engineering practices meet the highest standards. You will collaborate with product managers to define the technical roadmap.

We expect you to bring deep experience in backend systems, cloud infrastructure, and a track record of delivering complex projects. Excellent communication skills and a collaborative mindset are essential.`,
  },
  {
    title: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'REST APIs', 'HTML/CSS', 'Git'],
    salaryRange: [8, 22],
    experienceRange: [2, 6],
    industry: 'Technology',
    descriptionTemplate: `We are seeking a Full Stack Developer to build end-to-end features for our web platform. You will work on both the frontend and backend, ensuring a seamless user experience.

You will develop responsive user interfaces using modern JavaScript frameworks and build robust APIs and services on the backend. You will own features from inception to deployment.

The ideal candidate has hands-on experience with the MERN stack or similar, understands web performance optimization, and is comfortable working in an agile environment.`,
  },
  {
    title: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Jest', 'Figma'],
    salaryRange: [6, 20],
    experienceRange: [1, 5],
    industry: 'Technology',
    descriptionTemplate: `Join our product team as a Frontend Developer and craft delightful user interfaces that serve millions. You will work with designers and backend engineers to bring ideas to life.

Responsibilities include building reusable component libraries, implementing pixel-perfect designs, optimizing performance, and ensuring cross-browser compatibility. You will also write comprehensive unit and integration tests.

We are looking for someone with strong JavaScript fundamentals, experience with React or a similar framework, and an eye for design. Knowledge of accessibility standards is a plus.`,
  },
  {
    title: 'Backend Developer',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs', 'Celery'],
    salaryRange: [8, 24],
    experienceRange: [2, 6],
    industry: 'Technology',
    descriptionTemplate: `We are looking for a Backend Developer to design and implement server-side logic for our rapidly growing platform. You will be instrumental in building APIs, optimizing database queries, and ensuring system reliability.

Your day-to-day will involve writing clean, well-tested Python code, collaborating with frontend teams on API contracts, and maintaining our CI/CD pipelines. You will also contribute to architectural decisions.

Ideal candidates have experience with Django or Flask, understand relational database design, and are comfortable with containerization and cloud deployments.`,
  },
  {
    title: 'DevOps Engineer',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Python', 'CI/CD'],
    salaryRange: [10, 28],
    experienceRange: [3, 7],
    industry: 'Technology',
    descriptionTemplate: `We are hiring a DevOps Engineer to streamline our infrastructure and deployment pipelines. You will work at the intersection of development and operations to improve system reliability and developer productivity.

Responsibilities include managing cloud infrastructure on AWS/GCP, implementing Infrastructure as Code, setting up monitoring and alerting, and automating deployment workflows. You will also drive adoption of best practices across the engineering organization.

The ideal candidate has strong Linux administration skills, experience with container orchestration, and a passion for automation. Relevant AWS or GCP certifications are preferred.`,
  },
  {
    title: 'Mobile App Developer',
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'Firebase', 'REST APIs'],
    salaryRange: [8, 22],
    experienceRange: [2, 5],
    industry: 'Technology',
    descriptionTemplate: `We are looking for a Mobile App Developer to build and maintain our cross-platform mobile applications. You will deliver smooth, native-like experiences for both Android and iOS users.

You will work with product and design teams to implement new features, optimize app performance, and ensure a high-quality user experience. You will also manage app store releases and handle crash reports.

We need someone with strong React Native experience, an understanding of mobile development lifecycles, and the ability to troubleshoot platform-specific issues.`,
  },
  {
    title: 'Data Engineer',
    skills: ['Python', 'Apache Spark', 'SQL', 'Airflow', 'AWS', 'Hadoop', 'ETL'],
    salaryRange: [12, 30],
    experienceRange: [3, 7],
    industry: 'Technology',
    descriptionTemplate: `We are seeking a Data Engineer to design and build the data infrastructure that powers our analytics and machine learning initiatives. You will work with petabytes of data to enable data-driven decision making.

In this role, you will design ETL pipelines, optimize data warehouse queries, ensure data quality, and collaborate with data scientists and analysts. You will also evaluate and adopt new data technologies.

We expect you to have experience with big data processing frameworks, strong SQL skills, and familiarity with cloud data services. Experience with real-time streaming is a bonus.`,
  },
  {
    title: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics', 'Pandas', 'NLP'],
    salaryRange: [12, 35],
    experienceRange: [2, 7],
    industry: 'Technology',
    descriptionTemplate: `We are hiring a Data Scientist to extract insights from large datasets and build predictive models that drive business outcomes. You will work on challenging problems in recommendation, forecasting, and optimization.

Your responsibilities include developing ML models, conducting A/B tests, creating dashboards, and presenting findings to stakeholders. You will collaborate closely with engineering teams to deploy models into production.

A strong foundation in statistics, hands-on experience with Python ML libraries, and the ability to communicate complex findings to non-technical audiences are essential. An M.Tech or Ph.D. in a quantitative field is preferred.`,
  },
  {
    title: 'Cloud Architect',
    skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Microservices', 'Kubernetes', 'Security'],
    salaryRange: [25, 50],
    experienceRange: [8, 15],
    industry: 'Technology',
    descriptionTemplate: `We are looking for an experienced Cloud Architect to define and implement our cloud strategy. You will guide technical teams in designing scalable, secure, and cost-effective cloud solutions.

Responsibilities include creating reference architectures, establishing cloud governance policies, conducting architecture reviews, and mentoring teams on cloud-native development practices. You will also manage relationships with cloud providers.

The ideal candidate brings deep expertise in at least two major cloud platforms, has experience with enterprise migrations, and holds relevant cloud certifications. Strong leadership and communication skills are a must.`,
  },
  // ---------- Data & AI ----------
  {
    title: 'ML Engineer',
    skills: ['Python', 'PyTorch', 'MLOps', 'Docker', 'FastAPI', 'AWS SageMaker', 'SQL'],
    salaryRange: [14, 35],
    experienceRange: [2, 6],
    industry: 'Technology',
    descriptionTemplate: `We are seeking an ML Engineer to bridge the gap between data science experimentation and production-grade ML systems. You will build and maintain the infrastructure that brings machine learning models to life at scale.

Your work will include designing model serving pipelines, implementing feature stores, setting up experiment tracking, and ensuring model monitoring in production. You will partner with data scientists and platform engineers.

We value experience with MLOps tools, strong software engineering fundamentals, and the ability to work on both research prototypes and production systems.`,
  },
  {
    title: 'AI Research Scientist',
    skills: ['Python', 'Deep Learning', 'PyTorch', 'NLP', 'Computer Vision', 'Research', 'Publications'],
    salaryRange: [20, 45],
    experienceRange: [3, 8],
    industry: 'Technology',
    descriptionTemplate: `We are hiring an AI Research Scientist to push the boundaries of artificial intelligence and develop novel solutions for real-world problems. You will conduct original research and publish findings at top conferences.

Responsibilities include designing experiments, prototyping new algorithms, collaborating with engineering teams to transfer research into products, and staying current with the latest developments in AI.

A Ph.D. in Computer Science, Mathematics, or a related field is strongly preferred. Publications at venues such as NeurIPS, ICML, or ACL are a significant plus.`,
  },
  // ---------- Product & Design ----------
  {
    title: 'Product Manager',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Roadmapping', 'Jira', 'SQL'],
    salaryRange: [15, 35],
    experienceRange: [3, 8],
    industry: 'Technology',
    descriptionTemplate: `We are looking for a Product Manager to own the product roadmap and drive the development of features that delight our users. You will be the voice of the customer within the team.

In this role, you will define product vision, prioritize features based on data and user feedback, write detailed product requirements, and work with engineering and design to deliver on time. You will also define and track key metrics.

Strong analytical thinking, excellent communication skills, and experience in consumer or B2B product management are required. An MBA from a premier institute is a plus.`,
  },
  {
    title: 'UI/UX Designer',
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'HTML/CSS'],
    salaryRange: [8, 22],
    experienceRange: [2, 6],
    industry: 'Technology',
    descriptionTemplate: `We are seeking a UI/UX Designer to create intuitive, visually compelling digital experiences. You will work across the full design lifecycle from research to high-fidelity prototypes.

Your responsibilities include conducting user research, creating wireframes and prototypes, building and maintaining design systems, and collaborating with engineers to ensure pixel-perfect implementation.

A strong portfolio demonstrating end-to-end design work, proficiency in Figma, and empathy for users are essential. Experience with mobile-first design is highly valued.`,
  },
  // ---------- Finance & Banking ----------
  {
    title: 'Financial Analyst',
    skills: ['Excel', 'Financial Modeling', 'SQL', 'Tableau', 'Accounting', 'Bloomberg'],
    salaryRange: [6, 15],
    experienceRange: [1, 5],
    industry: 'Finance',
    descriptionTemplate: `We are looking for a Financial Analyst to support strategic decision-making through data-driven financial analysis. You will prepare financial models, conduct variance analysis, and create reports for senior leadership.

Responsibilities include budgeting and forecasting, analyzing financial statements, building valuation models, and tracking key financial KPIs. You will also assist with investor relations and board presentations.

A CA, CFA, or MBA in Finance is preferred. Strong Excel skills, attention to detail, and the ability to communicate financial insights clearly are essential.`,
  },
  {
    title: 'Investment Banking Analyst',
    skills: ['Financial Modeling', 'Valuation', 'Excel', 'PowerPoint', 'Due Diligence', 'M&A'],
    salaryRange: [10, 25],
    experienceRange: [1, 4],
    industry: 'Finance',
    descriptionTemplate: `We are hiring an Investment Banking Analyst to support our deal execution across M&A, capital markets, and advisory mandates. You will work on high-profile transactions in the Indian market.

Your work will involve building financial models, preparing pitch books, conducting industry research, performing due diligence, and supporting senior bankers in client meetings. Expect a fast-paced, intellectually stimulating environment.

A CA, CFA, or MBA from a tier-1 institute is strongly preferred. Exceptional quantitative skills, strong work ethic, and the ability to manage multiple workstreams are required.`,
  },
  {
    title: 'Risk Analyst',
    skills: ['Risk Management', 'SAS', 'SQL', 'Python', 'Basel Norms', 'Credit Risk'],
    salaryRange: [8, 20],
    experienceRange: [2, 6],
    industry: 'Finance',
    descriptionTemplate: `We are seeking a Risk Analyst to assess and manage credit, market, and operational risks for the bank. You will develop risk models and ensure regulatory compliance.

Responsibilities include performing credit assessments, monitoring portfolio risk metrics, developing stress testing scenarios, and preparing regulatory reports (Basel III/IV). You will also support the risk committee.

A background in quantitative finance, statistics, or economics is expected. Experience with risk management frameworks and strong programming skills in SAS or Python are preferred.`,
  },
  // ---------- Marketing & Sales ----------
  {
    title: 'Digital Marketing Manager',
    skills: ['Google Ads', 'SEO', 'Social Media Marketing', 'Content Strategy', 'Analytics', 'HubSpot'],
    salaryRange: [8, 20],
    experienceRange: [3, 7],
    industry: 'Marketing',
    descriptionTemplate: `We are looking for a Digital Marketing Manager to lead our online marketing efforts and drive user acquisition across channels. You will own the digital marketing strategy and budget.

Responsibilities include planning and executing campaigns across search, social, and display; optimizing conversion funnels; managing agency relationships; and reporting on ROI. You will also drive content marketing and SEO initiatives.

Proven experience in B2C digital marketing, strong analytical skills, and the ability to balance creativity with data-driven decision-making are required.`,
  },
  {
    title: 'Content Writer',
    skills: ['Content Writing', 'SEO', 'Blogging', 'Copywriting', 'Social Media', 'WordPress'],
    salaryRange: [3, 8],
    experienceRange: [0, 3],
    industry: 'Marketing',
    descriptionTemplate: `We are hiring a Content Writer to create engaging, SEO-optimized content for our website, blog, and social media channels. You will help establish our brand voice and thought leadership.

You will write blog posts, articles, product descriptions, email campaigns, and social media copy. You will also conduct keyword research and collaborate with the design team on content assets.

Excellent command of English, creativity, and the ability to write for different audiences and formats are essential. A portfolio of published writing samples is required.`,
  },
  {
    title: 'Sales Executive',
    skills: ['Sales', 'CRM', 'Negotiation', 'Lead Generation', 'Communication', 'Salesforce'],
    salaryRange: [4, 10],
    experienceRange: [1, 4],
    industry: 'Sales',
    descriptionTemplate: `We are looking for a Sales Executive to drive revenue growth by identifying and closing new business opportunities. You will manage the full sales cycle from prospecting to deal closure.

Responsibilities include generating leads through outbound efforts, conducting product demos, negotiating contracts, and maintaining CRM records. You will work closely with marketing and customer success teams.

Strong interpersonal skills, a results-oriented mindset, and prior B2B or B2C sales experience are required. A track record of meeting or exceeding targets is preferred.`,
  },
  {
    title: 'Business Development Manager',
    skills: ['Business Development', 'Strategy', 'Partnerships', 'Negotiation', 'Analytics', 'CRM'],
    salaryRange: [12, 28],
    experienceRange: [4, 9],
    industry: 'Sales',
    descriptionTemplate: `We are hiring a Business Development Manager to identify and develop strategic partnerships and new revenue streams. You will play a key role in our expansion plans across India.

In this role, you will research market opportunities, build relationships with potential partners, lead commercial negotiations, and drive cross-functional initiatives. You will report directly to the VP of Business Development.

We expect strong business acumen, a strategic mindset, and experience in deal structuring. An MBA from a reputed institution and prior BD experience in a fast-growing company are preferred.`,
  },
  // ---------- HR & Operations ----------
  {
    title: 'HR Manager',
    skills: ['Recruitment', 'Employee Relations', 'HRMS', 'Performance Management', 'Labour Law', 'SAP HR'],
    salaryRange: [10, 22],
    experienceRange: [5, 10],
    industry: 'Human Resources',
    descriptionTemplate: `We are looking for an experienced HR Manager to lead our people function. You will drive talent acquisition, employee engagement, and organizational development for our growing team.

Responsibilities include managing end-to-end recruitment, designing learning and development programs, handling employee relations, ensuring compliance with Indian labour laws, and implementing HR policies.

An MBA in HR from a reputed institute, hands-on experience with HRMS tools, and strong people management skills are required. SHRM or equivalent certification is a plus.`,
  },
  {
    title: 'Talent Acquisition Specialist',
    skills: ['Recruitment', 'Sourcing', 'LinkedIn Recruiter', 'ATS', 'Interviewing', 'Employer Branding'],
    salaryRange: [5, 12],
    experienceRange: [2, 5],
    industry: 'Human Resources',
    descriptionTemplate: `We are seeking a Talent Acquisition Specialist to help us attract and hire top talent across technology, product, and business roles. You will own the hiring pipeline from sourcing to offer.

Your responsibilities include partnering with hiring managers, sourcing candidates through multiple channels, screening resumes, coordinating interviews, and managing the candidate experience. You will also contribute to employer branding.

Experience in tech recruitment, familiarity with ATS tools, and strong networking skills are essential. You should be comfortable with data-driven hiring decisions.`,
  },
  {
    title: 'Operations Manager',
    skills: ['Operations', 'Supply Chain', 'Lean Six Sigma', 'Project Management', 'Excel', 'SAP'],
    salaryRange: [12, 25],
    experienceRange: [5, 10],
    industry: 'Operations',
    descriptionTemplate: `We are hiring an Operations Manager to oversee and optimize our business operations. You will ensure smooth day-to-day operations while driving continuous improvement initiatives.

Responsibilities include managing operational workflows, optimizing processes using Lean/Six Sigma methodologies, tracking KPIs, and leading a team of operations associates. You will also manage vendor relationships and budgets.

Proven experience in operations management, strong analytical and leadership skills, and a track record of process improvement are required. An MBA or engineering degree is preferred.`,
  },
  // ---------- BPO / Customer Service ----------
  {
    title: 'Customer Support Executive',
    skills: ['Customer Service', 'Communication', 'CRM', 'Problem Solving', 'English Fluency', 'Zendesk'],
    salaryRange: [2.5, 5],
    experienceRange: [0, 2],
    industry: 'BPO',
    descriptionTemplate: `We are looking for a Customer Support Executive to handle customer queries via phone, email, and chat. You will be the first point of contact for our customers and play a vital role in ensuring satisfaction.

Responsibilities include resolving customer complaints, escalating complex issues, maintaining ticket records, and providing product information. You will work in a rotational shift environment.

Excellent communication skills in English and Hindi, a customer-first mindset, and basic computer proficiency are required. Prior experience in a call center or helpdesk is preferred.`,
  },
  {
    title: 'Team Lead - Customer Support',
    skills: ['Team Management', 'Customer Service', 'Coaching', 'Quality Assurance', 'Excel', 'CRM'],
    salaryRange: [5, 10],
    experienceRange: [3, 6],
    industry: 'BPO',
    descriptionTemplate: `We are seeking a Team Lead for our Customer Support team. You will manage a team of 15-20 support agents and ensure that service level agreements are consistently met.

Your responsibilities include monitoring team performance, conducting quality audits, coaching and mentoring team members, handling escalated issues, and preparing daily and weekly reports.

Strong leadership abilities, excellent communication skills, and experience managing a customer support team in a BPO or tech company are essential.`,
  },
  // ---------- Healthcare ----------
  {
    title: 'Clinical Research Associate',
    skills: ['Clinical Trials', 'GCP', 'Medical Writing', 'Regulatory Affairs', 'SAS', 'Protocol Development'],
    salaryRange: [6, 15],
    experienceRange: [2, 5],
    industry: 'Healthcare',
    descriptionTemplate: `We are hiring a Clinical Research Associate to support our clinical trials in compliance with Good Clinical Practice (GCP) guidelines. You will play a key role in advancing healthcare through rigorous research.

Responsibilities include site monitoring, data collection and verification, preparing study documents, and ensuring regulatory compliance. You will work with investigators, sponsors, and ethics committees.

A degree in Life Sciences or Pharmacy, knowledge of ICH-GCP guidelines, and prior CRA experience are required. Willingness to travel across India is expected.`,
  },
  {
    title: 'Pharmacovigilance Specialist',
    skills: ['Drug Safety', 'Adverse Event Reporting', 'MedDRA', 'Pharmacovigilance', 'Regulatory Compliance'],
    salaryRange: [5, 14],
    experienceRange: [1, 5],
    industry: 'Healthcare',
    descriptionTemplate: `We are looking for a Pharmacovigilance Specialist to ensure the safety of our drug products through systematic monitoring and reporting of adverse events.

In this role, you will process Individual Case Safety Reports (ICSRs), conduct signal detection, prepare Periodic Safety Update Reports (PSURs), and ensure compliance with CDSCO and global regulatory requirements.

A degree in Pharmacy or Life Sciences, familiarity with MedDRA coding, and experience with pharmacovigilance databases are required.`,
  },
  // ---------- Engineering (Non-Software) ----------
  {
    title: 'Mechanical Engineer',
    skills: ['AutoCAD', 'SolidWorks', 'Manufacturing', 'Quality Control', 'GD&T', 'Lean Manufacturing'],
    salaryRange: [5, 14],
    experienceRange: [1, 5],
    industry: 'Manufacturing',
    descriptionTemplate: `We are looking for a Mechanical Engineer to join our product engineering team. You will design, test, and improve mechanical components and systems for our manufacturing operations.

Responsibilities include creating detailed engineering drawings, performing stress analysis, managing prototyping activities, and collaborating with the production team to resolve manufacturing issues.

A B.Tech/B.E. in Mechanical Engineering, proficiency in CAD tools, and understanding of manufacturing processes are required. Experience in the automotive or industrial sector is preferred.`,
  },
  {
    title: 'Civil Engineer',
    skills: ['AutoCAD', 'Structural Analysis', 'Project Management', 'Estimation', 'STAAD Pro', 'Construction'],
    salaryRange: [5, 15],
    experienceRange: [2, 7],
    industry: 'Construction',
    descriptionTemplate: `We are hiring a Civil Engineer to manage construction projects and ensure quality, safety, and timely delivery. You will work on large-scale infrastructure and real estate projects across India.

Responsibilities include preparing structural designs, managing site activities, coordinating with contractors, ensuring regulatory compliance, and tracking project milestones.

A B.Tech/B.E. in Civil Engineering, experience with structural analysis software, and the ability to manage multiple projects simultaneously are required.`,
  },
  {
    title: 'Electrical Engineer',
    skills: ['PLC', 'SCADA', 'Power Systems', 'AutoCAD Electrical', 'Instrumentation', 'Safety Standards'],
    salaryRange: [5, 14],
    experienceRange: [1, 5],
    industry: 'Manufacturing',
    descriptionTemplate: `We are looking for an Electrical Engineer to design and maintain electrical systems for our manufacturing facility. You will ensure safe and efficient electrical operations.

Responsibilities include designing electrical layouts, programming PLCs, troubleshooting equipment, conducting preventive maintenance, and ensuring compliance with electrical safety standards.

A B.Tech/B.E. in Electrical or Electronics Engineering, experience with PLC programming, and knowledge of Indian Electricity Rules are required.`,
  },
  // ---------- Quality & Testing ----------
  {
    title: 'QA Engineer',
    skills: ['Selenium', 'Java', 'Test Automation', 'API Testing', 'Postman', 'Jira', 'Agile'],
    salaryRange: [6, 16],
    experienceRange: [2, 5],
    industry: 'Technology',
    descriptionTemplate: `We are seeking a QA Engineer to ensure the quality and reliability of our software products. You will design and execute comprehensive test strategies for web and mobile applications.

Responsibilities include writing test plans and test cases, automating regression tests, performing API testing, logging defects, and working closely with developers to resolve issues. You will participate in sprint planning and retrospectives.

Hands-on experience with test automation frameworks, strong analytical skills, and familiarity with agile development practices are required. ISTQB certification is a plus.`,
  },
  {
    title: 'Performance Test Engineer',
    skills: ['JMeter', 'LoadRunner', 'Performance Testing', 'APM Tools', 'Linux', 'SQL', 'Scripting'],
    salaryRange: [10, 22],
    experienceRange: [3, 7],
    industry: 'Technology',
    descriptionTemplate: `We are looking for a Performance Test Engineer to identify bottlenecks and ensure our systems meet performance requirements under load. You will be critical to our platform's reliability.

In this role, you will design and execute load, stress, and endurance tests; analyze results; recommend optimizations; and work with engineering teams to implement performance improvements.

Experience with performance testing tools, understanding of application architecture, and strong debugging skills are required.`,
  },
  // ---------- Cybersecurity ----------
  {
    title: 'Information Security Analyst',
    skills: ['SIEM', 'Vulnerability Assessment', 'Penetration Testing', 'ISO 27001', 'Firewalls', 'Python'],
    salaryRange: [8, 22],
    experienceRange: [2, 6],
    industry: 'Technology',
    descriptionTemplate: `We are hiring an Information Security Analyst to protect our organization's digital assets. You will monitor threats, conduct vulnerability assessments, and implement security best practices.

Responsibilities include managing SIEM tools, performing security audits, responding to incidents, conducting penetration tests, and ensuring compliance with ISO 27001 and other standards.

A background in cybersecurity, relevant certifications (CEH, CISSP, or CompTIA Security+), and experience with security tools and frameworks are required.`,
  },
  // ---------- Project Management ----------
  {
    title: 'Project Manager',
    skills: ['PMP', 'Agile', 'Scrum', 'Jira', 'Stakeholder Management', 'Risk Management', 'MS Project'],
    salaryRange: [12, 28],
    experienceRange: [5, 10],
    industry: 'Technology',
    descriptionTemplate: `We are looking for a Project Manager to plan, execute, and deliver technology projects on time and within budget. You will manage cross-functional teams and stakeholder expectations.

Responsibilities include defining project scope, creating detailed project plans, managing resources, tracking milestones, mitigating risks, and facilitating agile ceremonies. You will also prepare status reports for leadership.

PMP certification, experience managing IT projects worth INR 5Cr+, and excellent communication skills are required. A background in software development is preferred.`,
  },
  {
    title: 'Scrum Master',
    skills: ['Scrum', 'Agile', 'Jira', 'Kanban', 'Facilitation', 'Coaching', 'Confluence'],
    salaryRange: [12, 25],
    experienceRange: [4, 8],
    industry: 'Technology',
    descriptionTemplate: `We are seeking a Scrum Master to facilitate agile practices across our product engineering teams. You will help teams deliver value iteratively and continuously improve their processes.

Responsibilities include facilitating sprint ceremonies, removing impediments, coaching teams on agile principles, tracking sprint metrics, and fostering a culture of collaboration and transparency.

CSM or PSM certification, experience with scaled agile frameworks, and strong facilitation skills are required. A technical background is a significant advantage.`,
  },
  // ---------- Accounting & Legal ----------
  {
    title: 'Chartered Accountant',
    skills: ['Taxation', 'Audit', 'GST', 'Tally', 'Financial Reporting', 'Indian GAAP', 'SAP FICO'],
    salaryRange: [8, 20],
    experienceRange: [2, 7],
    industry: 'Finance',
    descriptionTemplate: `We are looking for a qualified Chartered Accountant to manage our financial reporting, taxation, and audit functions. You will ensure compliance with Indian accounting standards and tax regulations.

Responsibilities include preparing financial statements, managing GST and income tax filings, coordinating with external auditors, and advising on tax optimization strategies. You will also support budgeting and MIS reporting.

A CA qualification is mandatory. Experience with Indian GAAP/Ind AS, GST compliance, and ERP systems like SAP or Tally is required.`,
  },
  {
    title: 'Legal Counsel',
    skills: ['Corporate Law', 'Contract Drafting', 'Compliance', 'SEBI Regulations', 'Intellectual Property', 'Negotiation'],
    salaryRange: [12, 30],
    experienceRange: [4, 10],
    industry: 'Legal',
    descriptionTemplate: `We are hiring a Legal Counsel to manage our legal affairs, including contract management, regulatory compliance, and corporate governance. You will protect the company's legal interests.

Responsibilities include drafting and reviewing contracts, advising on regulatory matters (SEBI, RBI, FEMA), managing IP portfolio, handling disputes, and supporting M&A transactions.

An LLB from a reputed law school, enrollment with the Bar Council of India, and experience in corporate law are required. Prior in-house experience at a technology company is preferred.`,
  },
  // ---------- EdTech & Training ----------
  {
    title: 'Instructional Designer',
    skills: ['Curriculum Design', 'E-Learning', 'Articulate', 'LMS', 'Content Development', 'Assessment Design'],
    salaryRange: [5, 12],
    experienceRange: [2, 5],
    industry: 'EdTech',
    descriptionTemplate: `We are seeking an Instructional Designer to create engaging learning experiences for our online education platform. You will transform complex subjects into accessible, interactive courses.

Responsibilities include designing course curricula, developing multimedia learning content, creating assessments, and analyzing learner feedback to improve course effectiveness.

Experience in instructional design, familiarity with e-learning authoring tools, and a passion for education are required. A background in education or learning science is preferred.`,
  },
  // ---------- Supply Chain & Logistics ----------
  {
    title: 'Supply Chain Analyst',
    skills: ['Supply Chain Management', 'SAP MM', 'Excel', 'Demand Planning', 'Inventory Management', 'SQL'],
    salaryRange: [6, 15],
    experienceRange: [2, 5],
    industry: 'Logistics',
    descriptionTemplate: `We are looking for a Supply Chain Analyst to optimize our end-to-end supply chain operations. You will analyze data to improve efficiency, reduce costs, and ensure timely delivery.

Responsibilities include demand forecasting, inventory optimization, vendor performance analysis, logistics coordination, and preparing supply chain dashboards and reports.

A degree in Supply Chain Management or Engineering, proficiency in SAP MM, and strong analytical skills are required. Experience in e-commerce or FMCG supply chains is a plus.`,
  },
  // ---------- Additional Tech Roles ----------
  {
    title: 'Site Reliability Engineer',
    skills: ['Kubernetes', 'Prometheus', 'Grafana', 'Python', 'Go', 'Terraform', 'AWS', 'Linux'],
    salaryRange: [15, 35],
    experienceRange: [3, 8],
    industry: 'Technology',
    descriptionTemplate: `We are hiring a Site Reliability Engineer (SRE) to ensure the uptime, performance, and scalability of our production systems. You will bridge the gap between software engineering and operations.

Your responsibilities include designing and implementing observability solutions, managing incident response, driving reliability improvements, maintaining SLOs, and automating toil. You will work with engineering teams to embed reliability into the development lifecycle.

Strong experience in distributed systems, infrastructure automation, and on-call practices are required. Familiarity with the SRE philosophy and practices as outlined by leading tech organizations is expected.`,
  },
  {
    title: 'Blockchain Developer',
    skills: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts', 'DeFi', 'Rust', 'Node.js'],
    salaryRange: [15, 40],
    experienceRange: [2, 6],
    industry: 'Technology',
    descriptionTemplate: `We are seeking a Blockchain Developer to design and implement smart contracts and decentralized applications. You will work on cutting-edge Web3 products for the Indian and global markets.

Responsibilities include writing and auditing smart contracts, integrating blockchain with backend systems, optimizing gas costs, and contributing to protocol design. You will also stay current with the rapidly evolving blockchain ecosystem.

Proficiency in Solidity, understanding of DeFi protocols, and strong software engineering fundamentals are required. Open-source contributions are valued.`,
  },
  {
    title: 'iOS Developer',
    skills: ['Swift', 'SwiftUI', 'UIKit', 'Core Data', 'REST APIs', 'Xcode', 'Git'],
    salaryRange: [10, 25],
    experienceRange: [2, 6],
    industry: 'Technology',
    descriptionTemplate: `We are looking for an iOS Developer to build and maintain our native iOS application. You will create polished, performant experiences for our Apple ecosystem users.

You will design and implement new features, optimize app performance, write unit and UI tests, and manage App Store submissions. You will collaborate closely with designers and backend engineers.

Strong proficiency in Swift, experience with UIKit and/or SwiftUI, and a deep understanding of iOS design patterns are required. Published apps on the App Store are a strong plus.`,
  },
  {
    title: 'Android Developer',
    skills: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'MVVM', 'Retrofit', 'Room', 'Git'],
    salaryRange: [8, 22],
    experienceRange: [2, 5],
    industry: 'Technology',
    descriptionTemplate: `We are hiring an Android Developer to build and enhance our Android application used by millions of users across India. You will deliver smooth, reliable experiences on a wide range of devices.

Responsibilities include implementing new features, optimizing for performance and battery life, writing automated tests, and ensuring compatibility across Android versions. You will participate in code reviews and sprint planning.

Proficiency in Kotlin, familiarity with modern Android architecture components, and experience with the full mobile development lifecycle are required.`,
  },
  {
    title: 'SAP Consultant',
    skills: ['SAP FICO', 'SAP MM', 'SAP SD', 'S/4HANA', 'Business Process', 'ABAP', 'Integration'],
    salaryRange: [10, 30],
    experienceRange: [3, 8],
    industry: 'IT Services',
    descriptionTemplate: `We are seeking a SAP Consultant to lead implementation and support projects for enterprise clients. You will configure SAP modules, design business processes, and ensure successful go-lives.

Responsibilities include gathering requirements, configuring SAP modules (FICO/MM/SD), conducting user training, performing data migration, and providing post-implementation support.

SAP certification in your primary module, experience with S/4HANA, and strong consulting skills are required. Willingness to travel to client sites across India is expected.`,
  },
  {
    title: 'Embedded Systems Engineer',
    skills: ['C', 'C++', 'RTOS', 'ARM', 'IoT', 'PCB Design', 'Debugging'],
    salaryRange: [6, 18],
    experienceRange: [2, 6],
    industry: 'Technology',
    descriptionTemplate: `We are looking for an Embedded Systems Engineer to design firmware and software for our IoT and hardware products. You will work at the intersection of hardware and software.

Responsibilities include writing firmware in C/C++, debugging hardware-software interfaces, working with RTOS, optimizing for power and memory constraints, and collaborating with hardware engineers on board bring-up.

A degree in Electronics or Computer Engineering, experience with ARM-based microcontrollers, and strong debugging skills are required.`,
  },
  // ---------- Additional Roles ----------
  {
    title: 'Graphic Designer',
    skills: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Brand Design', 'Typography', 'Motion Graphics'],
    salaryRange: [4, 12],
    experienceRange: [1, 5],
    industry: 'Marketing',
    descriptionTemplate: `We are hiring a Graphic Designer to create visual content that communicates our brand story across digital and print media. You will bring creativity and consistency to everything we produce.

Responsibilities include designing marketing collateral, social media graphics, presentations, and brand assets. You will also contribute to brand guideline development and collaborate with the marketing team.

A strong portfolio, proficiency in Adobe Creative Suite, and an eye for detail are essential. Experience with motion graphics or video editing is a bonus.`,
  },
  {
    title: 'Technical Writer',
    skills: ['Technical Writing', 'API Documentation', 'Markdown', 'Git', 'Developer Experience', 'Confluence'],
    salaryRange: [6, 15],
    experienceRange: [2, 5],
    industry: 'Technology',
    descriptionTemplate: `We are seeking a Technical Writer to create clear, comprehensive documentation for our products and APIs. You will make complex technical concepts accessible to developers and end users.

Responsibilities include writing API documentation, user guides, release notes, and tutorials. You will work closely with engineering and product teams to understand features and document them accurately.

Excellent writing skills, the ability to understand technical concepts quickly, and experience with documentation tools and version control are required.`,
  },
]

const SOURCE_PORTALS: ScrapedJob['sourcePortal'][] = ['naukri', 'indeed', 'shine', 'foundit']

const WORK_MODES: ScrapedJob['workMode'][] = ['remote', 'hybrid', 'office']

// ---------------------------------------------------------------------------
// Deterministic seeded random number generator (simple LCG)
// Ensures reproducible results when called with the same seed
// ---------------------------------------------------------------------------
function createRng(seed: number) {
  let state = seed
  return function next(): number {
    state = (state * 1664525 + 1013904223) & 0x7fffffff
    return state / 0x7fffffff
  }
}

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

function pickN<T>(arr: T[], min: number, max: number, rng: () => number): T[] {
  const count = min + Math.floor(rng() * (max - min + 1))
  const shuffled = [...arr].sort(() => rng() - 0.5)
  return shuffled.slice(0, count)
}

function randomBetween(min: number, max: number, rng: () => number): number {
  return Math.round((min + rng() * (max - min)) * 10) / 10
}

function generateSourceUrl(portal: ScrapedJob['sourcePortal'], index: number): string {
  const slug = `job-${index}-${Date.now().toString(36)}`
  switch (portal) {
    case 'naukri':
      return `https://www.naukri.com/job-listings-${slug}`
    case 'indeed':
      return `https://www.indeed.com/viewjob?jk=${slug}`
    case 'shine':
      return `https://www.shine.com/jobs/${slug}`
    case 'foundit':
      return `https://www.foundit.in/job/${slug}`
  }
}

function randomDate(daysBack: number, rng: () => number): Date {
  const now = new Date()
  const offset = Math.floor(rng() * daysBack)
  return new Date(now.getTime() - offset * 24 * 60 * 60 * 1000)
}

// ---------------------------------------------------------------------------
// Add seniority prefixes for variety
// ---------------------------------------------------------------------------
function addSeniorityVariant(title: string, rng: () => number): string {
  const roll = rng()
  if (title.startsWith('Senior') || title.startsWith('Lead') || title.startsWith('Team Lead') || title.startsWith('Chief')) {
    return title
  }
  if (roll < 0.15) return `Junior ${title}`
  if (roll < 0.3) return `Senior ${title}`
  if (roll < 0.38) return `Lead ${title}`
  if (roll < 0.42) return `Principal ${title}`
  return title
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

/**
 * Generates realistic sample Indian job listings for demo / fallback purposes.
 *
 * @param count Number of jobs to generate (default 200)
 * @param seed  Optional seed for deterministic output
 */
export function generateSampleJobs(count: number = 200, seed?: number): ScrapedJob[] {
  const rng = createRng(seed ?? 42)
  const jobs: ScrapedJob[] = []

  for (let i = 0; i < count; i++) {
    const role = pick(ROLE_TEMPLATES, rng)
    const company = pick(COMPANIES, rng)
    const portal = pick(SOURCE_PORTALS, rng)

    // Location: 1-3 cities
    const locations = pickN(CITIES, 1, 3, rng)

    // Experience: vary within template range
    const expMin = randomBetween(role.experienceRange[0], role.experienceRange[1] - 1, rng)
    const expMax = randomBetween(expMin + 1, role.experienceRange[1] + 2, rng)

    // Salary: vary within template range with some noise
    const salMin = randomBetween(role.salaryRange[0] * 0.8, role.salaryRange[0] * 1.2, rng)
    const salMax = randomBetween(role.salaryRange[1] * 0.8, role.salaryRange[1] * 1.3, rng)

    // Randomly decide whether to show salary (some listings hide it)
    const showSalary = rng() > 0.25

    // Skills: pick a subset of the role's skills and possibly add 1-2 extras
    const extraSkills = ['Communication', 'Problem Solving', 'Teamwork', 'Leadership', 'Analytical Skills', 'Presentation Skills']
    const selectedSkills = [
      ...pickN(role.skills, Math.ceil(role.skills.length * 0.6), role.skills.length, rng),
      ...pickN(extraSkills, 0, 2, rng),
    ]

    // Work mode: weighted — office most common, then hybrid, then remote
    let workMode: ScrapedJob['workMode']
    const wmRoll = rng()
    if (wmRoll < 0.4) workMode = 'office'
    else if (wmRoll < 0.75) workMode = 'hybrid'
    else workMode = 'remote'

    // Industry: from company's industries list or role's industry
    const industry = rng() > 0.3 ? pick(company.industries, rng) : role.industry

    const title = addSeniorityVariant(role.title, rng)

    jobs.push({
      title,
      company: company.name,
      companyLogoUrl: company.logo,
      locations,
      experienceMin: Math.max(0, expMin),
      experienceMax: Math.max(expMin + 1, expMax),
      salaryMin: showSalary ? Math.max(1, salMin) : undefined,
      salaryMax: showSalary ? Math.max(salMin + 1, salMax) : undefined,
      skills: selectedSkills,
      description: role.descriptionTemplate,
      workMode,
      sourcePortal: portal,
      sourceUrl: generateSourceUrl(portal, i),
      postedAt: randomDate(30, rng),
      industry,
    })
  }

  return jobs
}
