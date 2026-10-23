// Curated Knowledge Base of Venture Capital & Early Stage Pitches
// Used for Retrieval-Augmented Pitch Evaluation (RAG) and Deal Database

export const VENTURE_DEAL_CORPUS = [
  {
    id: "case-01",
    name: "OpenAI",
    industry: "AI / Machine Learning",
    stage: "Series B",
    amount: "$12,000,000",
    equity: "20%",
    year: "2019",
    ask: "$12,000,000 for 20%",
    valuation: "$60,000,000",
    outcome: "Funded",
    investor: "Khosla Ventures & Microsoft",
    summary: "Large-scale artificial general intelligence research lab building foundational transformer neural networks.",
    hook: "Human intelligence is the single bottleneck to accelerating scientific breakthroughs and global productivity.",
    strengths: [
      "World-class foundational AI research talent",
      "Pioneering generative transformer architectures with massive scaling laws",
      "High multi-billion dollar enterprise partnership potential"
    ],
    weaknessesFlagged: [
      "Immense cloud compute expenditure requiring continuous deep capital reserves"
    ],
    investorFeedback: "Lead Partner: 'The compute requirements are massive, but whoever achieves foundational intelligence dominance wins the next century of computing.'",
    keywords: ["ai", "machine learning", "artificial intelligence", "transformer", "neural", "software", "cloud", "tech", "data"]
  },
  {
    id: "case-02",
    name: "Figma",
    industry: "Design Tools",
    stage: "Series C",
    amount: "$50,000,000",
    equity: "15%",
    year: "2021",
    ask: "$50,000,000 for 15%",
    valuation: "$333,000,000",
    outcome: "Funded",
    investor: "Sequoia Capital & Greylock",
    summary: "Browser-first collaborative interface design and prototyping tool eliminating desktop software silos.",
    hook: "Designers work in isolated desktop files, while developers and product teams have no real-time collaboration canvas.",
    strengths: [
      "In-browser WebGL rendering engine with zero local installation",
      "Hyper-viral bottom-up product adoption inside tech companies",
      "Over 140% Net Dollar Retention (NDR) from design teams"
    ],
    weaknessesFlagged: [
      "Direct competition from legacy incumbent Adobe Creative Cloud"
    ],
    investorFeedback: "Growth Partner: 'Moving creative tooling from single-player desktop into multiplayer real-time web creates an unshakeable network effect.'",
    keywords: ["design", "ui", "collaboration", "saas", "software", "browser", "figma", "prototyping", "web", "team"]
  },
  {
    id: "case-03",
    name: "Notion",
    industry: "Productivity",
    stage: "Series B",
    amount: "$10,000,000",
    equity: "10%",
    year: "2018",
    ask: "$10,000,000 for 10%",
    valuation: "$100,000,000",
    outcome: "Funded",
    investor: "Index Ventures",
    summary: "All-in-one flexible workspace combining documents, wikis, and databases into modular Lego-like blocks.",
    hook: "Knowledge workers are drowning in five fragmented apps—docs in Google, tasks in Trello, and notes in Evernote.",
    strengths: [
      "Cult-like organic community creating and selling custom templates",
      "High software gross margins (85%+) with profitable unit economics",
      "Single tool replacing fragmented software subscriptions"
    ],
    weaknessesFlagged: [
      "Blank canvas syndrome requiring user onboarding education"
    ],
    investorFeedback: "Venture Lead: 'When users build their own workflow tools inside your software, switching costs become practically insurmountable.'",
    keywords: ["productivity", "workspace", "notes", "database", "wiki", "docs", "saas", "software", "collaboration", "management"]
  },
  {
    id: "case-04",
    name: "Doorbot (Ring)",
    industry: "Consumer IoT",
    stage: "Series A",
    amount: "$700,000",
    equity: "10%",
    year: "2013",
    ask: "$700,000 for 10%",
    valuation: "$7,000,000",
    outcome: "Cautionary",
    investor: "Independent (Acquired by Amazon for $1B+)",
    summary: "Wi-Fi enabled video doorbell streaming live camera feed to your smartphone to deter burglars.",
    hook: "Over 2 million home break-ins happen every year, and 80% of burglars ring the doorbell first to see if anyone is home.",
    strengths: [
      "Compelling problem-first statistic on home safety",
      "Massive market tailwind in mobile IoT hardware",
      "Early traction with $1M in sales"
    ],
    weaknessesFlagged: [
      "High manufacturing cost and low initial gross margins (<28%)",
      "High customer acquisition cost and unproven cloud recurring subscription model",
      "Too expensive hardware price tag ($199) with risk of copycat giants entering"
    ],
    investorFeedback: "Lead VC: 'I don't think you're a product that can stand alone against big tech incumbents. The cost of customer acquisition will eat you alive without higher margins.'",
    keywords: ["security", "doorbell", "camera", "wifi", "iot", "hardware", "home", "burglar", "app", "tech", "video"]
  },
  {
    id: "case-05",
    name: "Stripe",
    industry: "Fintech",
    stage: "Series A",
    amount: "$2,000,000",
    equity: "8%",
    year: "2011",
    ask: "$2,000,000 for 8%",
    valuation: "$25,000,000",
    outcome: "Funded",
    investor: "Peter Thiel, Elon Musk & Sequoia",
    summary: "Seven lines of code that allow any developer in the world to accept instant credit card payments online.",
    hook: "Accepting online payments requires weeks of merchant account approvals, paper forms, and archaic bank gateways.",
    strengths: [
      "Developer-first API with seamless 5-minute setup documentation",
      "Zero sales team needed; viral developer word-of-mouth adoption",
      "Transaction take-rate business model scaling directly with client revenue"
    ],
    weaknessesFlagged: [
      "Financial regulatory compliance and multi-currency fraud liability"
    ],
    investorFeedback: "Fintech Angel: 'Transforming a six-week bureaucratic banking nightmare into seven lines of code is the ultimate software wedge.'",
    keywords: ["fintech", "payment", "api", "developer", "credit card", "banking", "checkout", "ecommerce", "saas", "money"]
  },
  {
    id: "case-06",
    name: "SaaS & AI DevTools (YC Model)",
    industry: "Software & SaaS",
    stage: "Seed Round",
    amount: "$500,000",
    equity: "7%",
    year: "2023",
    ask: "$500,000 for 7%",
    valuation: "$7,100,000",
    outcome: "Funded",
    investor: "Top Tier VC",
    summary: "Automated developer pipeline for microservices testing and observability.",
    hook: "Software engineering teams spend 35% of their working hours manually debugging distributed cloud environments instead of writing code.",
    strengths: [
      "Negative revenue churn with 130% Net Dollar Retention (NDR)",
      "Fast bottom-up developer adoption (product-led growth)",
      "Zero customer acquisition cost via open-source community"
    ],
    weaknessesFlagged: [
      "Long sales cycles when transitioning from individual developers to enterprise CIOs",
      "Rapidly changing AI framework dependencies"
    ],
    investorFeedback: "Tech VC: 'The 130% NDR tells me once an engineering team plugs this in, they never turn it off. That's the hallmark of an essential utility.'",
    keywords: ["software", "saas", "developer", "cloud", "api", "ai", "code", "platform", "tool", "enterprise", "tech"]
  },
  {
    id: "case-07",
    name: "Scrub Daddy",
    industry: "Consumer Goods",
    stage: "Seed Round",
    amount: "$100,000",
    equity: "10%",
    year: "2012",
    ask: "$100,000 for 10%",
    valuation: "$1,000,000",
    outcome: "Funded",
    investor: "Strategic Retail Investor",
    summary: "High-tech polymer cleaning sponge that changes texture based on water temperature (firm in cold, soft in warm).",
    hook: "Traditional sponges scratch surfaces, smell terrible within days, and harbor billions of bacteria. What if your sponge adapted to every surface you cleaned?",
    strengths: [
      "Demonstrable live visual proof within first 15 seconds",
      "Solved a universal daily household annoyance",
      "Clear patent protection and manufacturing cost under $0.30/unit"
    ],
    weaknessesFlagged: [
      "Initially lacked nationwide retail distribution strategy"
    ],
    investorFeedback: "Retail Partner: 'I know a hero product when I see one. You demonstrated the texture change in 10 seconds — that sells itself on retail shelves.'",
    keywords: ["sponge", "cleaning", "household", "texture", "polymer", "kitchen", "dishes", "patent", "retail", "consumer"]
  },
  {
    id: "case-08",
    name: "Bombas",
    industry: "Apparel & D2C",
    stage: "Seed Round",
    amount: "$200,000",
    equity: "5%",
    year: "2014",
    ask: "$200,000 for 5%",
    valuation: "$4,000,000",
    outcome: "Funded",
    investor: "Consumer Growth Fund",
    summary: "Engineered premium socks designed for comfort with a mission-driven 1-for-1 donation model.",
    hook: "Socks are the number one requested clothing item at homeless shelters, yet the basic gym sock hasn't been re-engineered in over 50 years.",
    strengths: [
      "Deep emotional mission paired with superior product engineering",
      "High repeat purchase rate (45%+) via direct-to-consumer e-commerce",
      "$1.2M in first-year sales proving market demand"
    ],
    weaknessesFlagged: [
      "Giving away one pair for every pair sold places heavy pressure on unit margins"
    ],
    investorFeedback: "Brand Partner: 'The mission drives the viral word-of-mouth, but the 80% repeat customers proves the engineering delivers.'",
    keywords: ["socks", "apparel", "clothing", "d2c", "ecommerce", "donation", "mission", "comfort", "fashion"]
  },
  {
    id: "case-09",
    name: "Copa Di Vino",
    industry: "Food & Beverage",
    stage: "Growth Round",
    amount: "$600,000",
    equity: "20%",
    year: "2011",
    ask: "$600,000 for 20%",
    valuation: "$3,000,000",
    outcome: "Cautionary",
    investor: "None (Passed by all investors)",
    summary: "Single-serve premium wine packaged in patented splash-proof plastic stemware for venues and outdoor events.",
    hook: "Every outdoor stadium, concert, and golf course wants to sell premium wine, but glass bottles are prohibited and plastic cups ruin the aroma.",
    strengths: [
      "$5M+ in trailing revenue demonstrating genuine market appetite",
      "Proprietary packaging and bottling equipment with patent protection"
    ],
    weaknessesFlagged: [
      "Founder refused to license the packaging technology, insisting on being a low-margin winemaker",
      "Antagonistic attitude toward investor terms and strategic guidance"
    ],
    investorFeedback: "Venture Lead: 'You are sitting on a multi-million dollar packaging patent, but you insist on being a low-margin winery. You are fighting your biggest asset.'",
    keywords: ["wine", "beverage", "alcohol", "drink", "packaging", "stadium", "glass", "single-serve", "patent", "liquor"]
  },
  {
    id: "case-10",
    name: "Simple Sugars",
    industry: "Beauty & Personal Care",
    stage: "Angel Round",
    amount: "$100,000",
    equity: "33%",
    year: "2013",
    ask: "$100,000 for 33%",
    valuation: "$300,000",
    outcome: "Funded",
    investor: "Tech & Angel Syndicate",
    summary: "All-natural sugar scrubs formulated specifically for sensitive skin and eczema sufferers, eliminating the need for lotion.",
    hook: "If you suffer from sensitive skin or eczema, 90% of commercial lotions make your breakouts worse because they are packed with synthetic preservatives.",
    strengths: [
      "Founder's authentic personal story living with severe eczema",
      "Extremely strong unit economics: $2.40 cost of goods sold (COGS) retailing at $14 (83% gross margin)",
      "Passionate customer base with strong organic word-of-mouth"
    ],
    weaknessesFlagged: [
      "Scaling production out of an unautomated local facility"
    ],
    investorFeedback: "Growth Investor: 'I love founders who master their unit economics. Making a jar for $2.40 and selling it for $14 gives you the healthy margin needed to scale digital customer acquisition.'",
    keywords: ["skincare", "skin", "eczema", "sugar", "beauty", "cosmetics", "lotion", "organic", "natural", "dermatology"]
  }
];

// Compatibility alias
export const SHARK_TANK_CORPUS = VENTURE_DEAL_CORPUS;

export const INVESTOR_PERSONAS = [
  {
    name: "Tech & Scalability Partner",
    focus: "Customer Acquisition & Market Moat",
    archetype: "Venture Capital Partner",
    evaluate: (metrics, pitch) => {
      const hasNumbers = /\d+/.test(pitch);
      const isTech = /software|app|platform|ai|tech|code|system|cloud/i.test(pitch);
      if (!hasNumbers) {
        return "Where are your unit economics? Anyone can have an idea, but without knowing your cost to acquire a customer (CAC) versus lifetime value (LTV), you're just burning cash. You need hard numbers.";
      }
      if (isTech) {
        return "I like the tech angle, but what is your defensible moat? If big tech or an open-source team builds this next month, why do users stay with you?";
      }
      return "The market size is interesting, but you need to demonstrate how you scale outside your initial test market without acquisition costs exploding.";
    }
  },
  {
    name: "Financial & Margins Lead",
    focus: "Gross Margins & Free Cash Flow",
    archetype: "Private Equity & Angel Lead",
    evaluate: (metrics, pitch) => {
      const hasCTA = /\b(buy|try|order|invest|pricing|sale|call|contact)\b/i.test(pitch);
      const hasMargin = /margin|cost|profit|revenue|price|dollar|\$|\%/i.test(pitch);
      if (!hasMargin) {
        return "You haven't told me what it costs to make and what you sell it for! All business is math. If you don't have at least a 60% gross margin, you are working for charity. Give me the numbers!";
      }
      if (!hasCTA) {
        return "You walked into the pitch and didn't even tell the investor how you turn a profit. A pitch without a clear financial ask is just a story. What is your ask?";
      }
      return "You have numbers, but I want to know when I get my investment back. Prove to me the cash flow is predictable and sustainable.";
    }
  },
  {
    name: "Go-to-Market & Product Lead",
    focus: "Demonstration & Consumer Appeal",
    archetype: "Consumer & Retail Partner",
    evaluate: (metrics, pitch) => {
      const hasHook = pitch.trim().split(/[.!?]+/)[0].split(' ').length <= 14;
      const isDemonstrable = /see|look|demonstrat|feel|watch|experience|notice/i.test(pitch);
      if (!hasHook) {
        return "Your opening sentence is way too long! You have 5 seconds to hook the listener before they tune out. Make it visual and punchy.";
      }
      if (isDemonstrable) {
        return "I love that you can demonstrate this instantly! That is the hallmark of a high-velocity product that can win retail shelves and digital channels.";
      }
      return "Show, don't just tell. Put the product in the customer's hands within the first 10 seconds so they instantly feel the transformation.";
    }
  }
];

export const SHARK_PERSONAS = INVESTOR_PERSONAS;
