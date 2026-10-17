/* Single source of truth for portfolio content that is rendered by script.
   Project facts below come from each repository's README/About page and live-site
   checks on 2026-10-17. Stars/forks/last-push are NOT stored here: they are read
   from the GitHub API at runtime (see main.js) so they never go stale. */
window.PORTFOLIO = {
  githubUser: 'anointedthedeveloper',

  /* Year software development started. Taken from the existing About timeline
     ("2019 — 2021 Self-directed learning"). CONFIRM: drives the "7+ years" claim. */
  careerStartYear: 2019,

  /* Last values read from the public profile page. Only used if the GitHub API
     is unreachable, and always shown with this date. */
  snapshot: { date: '17 Oct 2026', public_repos: 162, followers: '1.1k' },

  categories: [
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'tools',     label: 'Developer Tools' },
    { id: 'api',       label: 'APIs' },
    { id: 'web',       label: 'Web Apps' },
    { id: 'desktop',   label: 'Desktop & Mobile' },
    { id: 'client',    label: 'Client Work' }
  ],

  /* order = curated priority. home: shown on the homepage. spot: full-width card.
     image: base name in assets/projects (real screenshot of the running app).
     art: README-derived terminal panel, used where no verified screenshot exists. */
  projects: [
    {
      id: 'reporoom', repo: 'RepoRoom', name: 'RepoRoom', cat: 'fullstack', kind: 'Real-time messaging',
      home: true, spot: true, image: 'reporoom',
      alt: 'RepoRoom landing page with a developer console panel showing commands and an active thread',
      summary: 'Team chat built for developers: real-time messaging, groups with admin roles, file and voice attachments, and WebRTC audio and video calls with screen sharing.',
      why: 'Versioned Postgres migrations with row-level security (including a SECURITY DEFINER fix for recursive policies), Supabase Realtime for messages and signalling, and a link-preview edge function with private-network blocking and 24-hour caching.',
      stack: ['React 18', 'TypeScript', 'Vite', 'Supabase', 'WebRTC', 'Tailwind'],
      live: 'https://www.reporoom.site', liveLabel: 'Live site'
    },
    {
      id: 'codesync', repo: 'CodeSync', name: 'CodeSync', cat: 'fullstack', kind: 'Collaborative editor',
      home: true,
      art: { label: 'from README', lines: [
        ['d', '// architecture'],
        ['p', 'client  ', 'React · Monaco Editor'],
        ['p', 'sync    ', 'Yjs (CRDT) · Socket.io'],
        ['p', 'server  ', 'Node.js · Express · WebSocket'],
        ['p', 'data    ', 'PostgreSQL · Redis'],
        ['p', 'ops     ', 'Docker · Docker Compose'] ] },
      summary: 'Real-time collaborative code editor with multi-user editing, remote cursors, syntax highlighting and a Run button with console output.',
      why: 'Uses Yjs so concurrent edits merge deterministically instead of overwriting each other.',
      stack: ['React', 'Monaco', 'Yjs', 'Node.js', 'PostgreSQL', 'Redis']
    },
    {
      id: 'github-orbit', repo: 'github-orbit', name: 'github-orbit', cat: 'tools', kind: 'Automation',
      home: true,
      art: { label: 'from README', lines: [
        ['d', '# schedule (UTC)'],
        ['g', '09:00 ', 'follow back followers'],
        ['g', '18:00 ', 'unfollow non-followers'],
        ['d', '# limits'],
        ['p', 'delay    ', '5s between actions'],
        ['p', 'cooldown ', '10min every 50 actions'],
        ['p', 'cap      ', '100 actions per run'] ] },
      summary: 'Node.js service that follows back and prunes GitHub followers on a daily cron schedule, deployed on Render with a JSON status endpoint.',
      why: 'Skips bots, accounts under 30 days old, and thin profiles, and stays inside conservative rate limits. Needs only the user:follow token scope.',
      stack: ['Node.js', 'Express', 'GitHub API', 'cron'],
      live: 'https://github-orbit.onrender.com/', liveLabel: 'Status page'
    },
    {
      id: 'weblab-ide', repo: 'WebLab-IDE', name: 'WebLab IDE', cat: 'tools', kind: 'Browser IDE',
      home: true, image: 'weblab-ide',
      alt: 'WebLab IDE showing an HTML file in the Monaco editor with a live preview and terminal',
      summary: 'Lightweight browser editor on Monaco with HTML, CSS and JS tabs, a live iframe preview, and Python execution through a separate Flask API.',
      why: 'Resizable panels, Emmet and IntelliSense, and export of single files or a ZIP of the project. The API lives in WebLab-IDE-Api.',
      stack: ['Monaco', 'JavaScript', 'Python', 'Flask'],
      live: 'https://weblabide.vercel.app', liveLabel: 'Live demo'
    },
    {
      id: 'nexus-cli', repo: 'NexusDeveloper-CLI-Tool', name: 'Nexus CLI', cat: 'tools', kind: 'CLI scaffolder',
      art: { label: 'from README', lines: [
        ['p', '$ ', 'npx create-nexus-react-app my-app'],
        ['d', '  --template   basic | minimal'],
        ['d', '  --package-manager npm | yarn | pnpm'],
        ['d', '  --yes  --git  --install  --force'],
        ['g', '✓ Vite + Tailwind + React Router 6'],
        ['g', '✓ auth context · protected routes'] ] },
      summary: 'Command-line tool that bootstraps a React app with Vite, Tailwind, React Router 6, an auth context, Axios interceptors and error boundaries.',
      why: 'Flags cover template, package manager, git init and install, so a new project is ready in one command.',
      stack: ['Node.js', 'React', 'Vite', 'Tailwind'],
      extra: [{ label: 'npm package', url: 'https://www.npmjs.com/package/create-nexus-react-app' }]
    },
    {
      id: 'bloomcart', repo: 'BloomCart-Flower-Shop', name: 'BloomCart', cat: 'web', kind: 'E-commerce',
      image: 'bloomcart',
      alt: 'BloomCart storefront home page with a bouquet photo and a Shop Now button',
      summary: 'Online flower shop for Lagos deliveries: browse and search, cart and checkout, delivery scheduling and order tracking, plus admin tools for products and orders.',
      why: 'Covers both sides of a shop: the customer storefront and the owner-facing management screens.',
      stack: ['TypeScript', 'E-commerce'],
      live: 'https://bloom-cart-flower-shop.vercel.app', liveLabel: 'Live demo'
    },
    {
      id: 'exam', repo: 'Browser-Based-Exam', name: 'Browser-Based Exam', cat: 'fullstack', kind: 'Exam system',
      art: { label: 'from README', lines: [
        ['d', '// LAN server-client'],
        ['p', 'students ', 'name login · A–E keys · resume'],
        ['p', 'admin    ', 'start / end · live progress'],
        ['p', 'realtime ', 'Socket.io'],
        ['p', 'storage  ', 'LowDB (JSON, survives restarts)'],
        ['p', 'rules    ', 'fullscreen enforced'] ] },
      summary: 'Exam platform where students sit tests in the browser while an admin dashboard follows progress live over WebSockets.',
      why: 'Progress is saved automatically and persists across server restarts, so a dropped connection or reboot does not lose a student’s work.',
      stack: ['Node.js', 'Express', 'Socket.io', 'LowDB']
    },
    {
      id: 'stockwise', repo: 'stockwise', name: 'StockWise', cat: 'desktop', kind: 'Desktop app',
      art: { label: 'from README', lines: [
        ['d', '// modules'],
        ['p', 'Dashboard   ', 'Products'],
        ['p', 'Categories  ', 'Suppliers'],
        ['p', 'Stock Movement', ''],
        ['p', 'Ledger      ', 'Reports'],
        ['d', '// runtime: .NET 8 · SQLite'] ] },
      summary: 'Windows desktop app for inventory management: products, categories, suppliers, stock movements, a transaction ledger and reports.',
      why: 'Ships with an installer script and keeps data in a local SQLite database.',
      stack: ['C#', '.NET 8', 'SQLite']
    },
    {
      id: 'anai', repo: 'ANAI', name: 'ANAI', cat: 'tools', kind: 'AI agent IDE',
      art: { label: 'from README', lines: [
        ['d', '// request path'],
        ['p', 'Browser  ', 'React UI (VS Code-style)'],
        ['p', '   ↓     ', ''],
        ['p', 'Backend  ', 'Node.js · Express :3001'],
        ['p', '   ↓     ', ''],
        ['p', 'Ollama   ', 'LLaMA 3 · localhost:11434'] ] },
      summary: 'Browser IDE with a file explorer, tabbed editor, terminal and an AI assistant that can read and write project files through an Express backend.',
      why: 'Runs against a locally hosted Ollama model, so it needs a local setup. The old hosted demo is offline, so no live link is shown.',
      stack: ['React', 'Node.js', 'Express', 'Ollama']
    },
    {
      id: 'smart-readme', repo: 'Smart-README-Generator', name: 'Smart README Generator', cat: 'tools', kind: 'Developer tool',
      image: 'smart-readme',
      alt: 'Smart README Generator form on the left with a live Markdown preview on the right',
      summary: 'React app that builds a README from a form, with a live Markdown preview and GitHub profile details.',
      stack: ['React', 'JavaScript', 'GitHub API'],
      live: 'https://smart-readme-generator.vercel.app', liveLabel: 'Live demo'
    },
    {
      id: 'api-tester', repo: 'apitester', name: 'API Tester', cat: 'api', kind: 'Developer tool',
      image: 'api-tester',
      alt: 'API Tester with a method selector, URL bar, header and body tabs, and a response pane',
      summary: 'Browser-based HTTP client: pick a method, add headers and a body, send the request and inspect the response.',
      stack: ['JavaScript', 'REST'],
      live: 'https://apitester-teal.vercel.app', liveLabel: 'Live demo'
    },
    {
      id: 'anivault', repo: 'Anivault-api', name: 'Anivault API', cat: 'api', kind: 'Public API',
      summary: 'Serverless FastAPI service on Vercel with search, episode-listing and health-check endpoints.',
      stack: ['Python', 'FastAPI', 'Vercel'],
      live: 'https://anivault-api.vercel.app', liveLabel: 'Live API'
    },
    {
      id: 'phis', repo: 'Peter-Harvard-International-Schools', name: 'Peter Harvard International Schools', cat: 'client', kind: 'Client work',
      art: { label: 'public repos', lines: [
        ['d', '// repositories'],
        ['p', 'Peter-Harvard-International-Schools'],
        ['p', 'PHIS-Transcript-Portal'],
        ['d', '// live'],
        ['g', 'peterharvardschools.cloud'] ] },
      summary: 'The school’s public website plus a student, parent and staff portal covering admissions, news and events, a student management system and internal tools. Sole engineer for the whole estate.',
      stack: ['JavaScript', 'Web platform', 'Portals'],
      live: 'https://peterharvardschools.cloud', liveLabel: 'Visit site'
    },
    {
      id: 'etak', repo: null, name: 'Etak Travels & Tours', cat: 'client', kind: 'Client · Production',
      image: 'etak-travels',
      alt: 'Etak Travels and Tours home page with a flight search panel over an Abuja skyline',
      summary: 'Website for an Abuja travel management company: flights, hotels, tour packages and visa assistance, with a booking-style search panel that routes enquiries to the team.',
      stack: ['Web platform', 'Responsive'],
      live: 'https://etaktravels.com', liveLabel: 'Visit site'
    },
    {
      id: 'aremu', repo: null, name: 'Aremu Tech Eazy Solutions', cat: 'client', kind: 'Client · Production',
      art: { label: 'from live site', lines: [
        ['d', '// ICT services · Abuja'],
        ['p', 'CBT centre setup'],
        ['p', 'CCTV & networking'],
        ['p', 'Repairs & software'],
        ['d', '// pages'],
        ['g', 'Services · Projects · Internship'] ] },
      summary: 'Website for an Abuja ICT company covering CBT centre setup, CCTV, networking, repairs and software, with services, projects and internship pages.',
      stack: ['Web platform', 'Responsive'],
      live: 'https://aremutecheazysolutions.com', liveLabel: 'Visit site'
    },
    {
      id: 'rmc', repo: 'Real-Moving-Canada', name: 'Real Moving Canada', cat: 'client', kind: 'Client · Production',
      image: 'real-moving-canada',
      alt: 'Real Moving Canada home page with a moving truck and a Get a Free Quote button',
      summary: 'Platform for a Saskatoon moving company: a five-step quote flow and an authenticated customer portal for moves, quotes, bookings, payments, documents and messages.',
      why: 'Express REST API of 25 endpoints over 11 Mongoose models with Zod validation, JWT sessions in httpOnly cookies, rate limiting and CSRF checks, covered by Supertest integration tests. Public source is a fork of goodnessemmanuel1/Real-Moving-Canada.',
      stack: ['React 19', 'Node.js', 'Express 5', 'MongoDB Atlas', 'Vercel'],
      live: 'https://realmovingcanada.ca', liveLabel: 'Live site'
    },
    {
      id: 'protech', repo: null, name: 'Protech Corporate Solutions', cat: 'client', kind: 'Client · Production',
      art: { label: 'private codebase', lines: [
        ['d', '// loan management platform'],
        ['p', 'role     ', 'creator & sole developer'],
        ['p', 'status   ', 'in production'],
        ['p', 'scope    ', 'lending operations'],
        ['d', '// source is private'] ] },
      summary: 'Loan management software the company uses to run its lending operations, designed, built and maintained as sole developer.',
      stack: ['Full stack', 'Business systems']
    },
    {
      id: 'campuscoin', repo: 'CampusCoin-FD', name: 'Campus Coin', cat: 'client', kind: 'Collaboration',
      image: 'campus-coin',
      alt: 'Campus Coin home page showing a budgeting dashboard on a laptop and phone',
      summary: 'Budgeting app for students: log allowance and gig income, set spending caps per category, and get AI-assisted saving tips.',
      why: 'Source is a fork of nasha861/CampusCoin, with separate Frontend and Backend folders.',
      stack: ['TypeScript', 'Frontend + backend'],
      live: 'https://campuscoin-topaz.vercel.app', liveLabel: 'Live site'
    },
    {
      id: 'alpine', repo: 'Alpine-Ascents', name: 'Alpine Ascents', cat: 'web', kind: 'Landing page',
      summary: 'Single-page mountaineering site in vanilla HTML, CSS and JavaScript: Leaflet world map of climbing clubs, scroll-spy navigation and a photo gallery. Hosted on GitHub Pages.',
      stack: ['JavaScript', 'Leaflet', 'CSS'],
      live: 'https://anointedthedeveloper.github.io/Alpine-Ascents/', liveLabel: 'Live demo'
    },
    {
      id: 'axiom', repo: 'Axiom-UI', name: 'Axiom UI', cat: 'web', kind: 'UI library',
      summary: 'MIT-licensed, TypeScript-first React component library template with Button, Input, Modal, Card and DataTable, themed through CSS variables.',
      stack: ['React', 'TypeScript', 'CSS variables']
    },
    {
      id: 'docverse', repo: 'DocVerse', name: 'DocVerse', cat: 'desktop', kind: 'Android app',
      summary: 'Android app for reading, editing, organising and converting documents.',
      stack: ['Kotlin', 'Android']
    }
  ]
};
