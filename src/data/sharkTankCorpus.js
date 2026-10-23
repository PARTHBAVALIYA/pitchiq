// Curated Knowledge Base of Venture Capital & Early Stage Pitches
// Used for Retrieval-Augmented Pitch Evaluation (RAG)

export const VENTURE_DEAL_CORPUS = [
  {
    id: "case-01",
    name: "Scrub Daddy",
    stage: "Seed Round ($100k)",
    industry: "Consumer Goods",
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
    id: "case-02",
    name: "Doorbot (Ring)",
    stage: "Series A ($700k)",
    industry: "Tech & Hardware",
    ask: "$700,000 for 10%",
    valuation: "$7,000,000",
    outcome: "Rejected",
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
    id: "case-03",
    name: "Bombas",
    stage: "Seed Round ($200k)",
    industry: "Apparel & D2C",
    ask: "$200,000 for 5%",
    valuation: "$4,000,000",
    outcome: "Funded",
    investor: "Consumer Growth Fund",
    summary: "Engineered premium socks designed for comfort with a mission-driven 1-for-1 donation model.",
    hook: "Socks are the number one requested clothing item at homeless shelters, yet the basic gym sock hasn't been re-engineered in over 50 years.",
    strengths: [
      "Deep emotional mission paired with superior product engineering (stay-up technology, blister tab)",
      "High repeat purchase rate (45%+) via direct-to-consumer e-commerce",
      "$1.2M in first-year sales proving market demand"
    ],
    weaknessesFlagged: [
      "Giving away one pair for every pair sold places heavy pressure on unit margins",
      "Commodity apparel risk requiring high ongoing digital ad spend"
    ],
    investorFeedback: "Brand Partner: 'The mission drives the viral word-of-mouth, but the 80% repeat customers proves the engineering delivers. That's a sustainable D2C business.'",
    keywords: ["socks", "apparel", "clothing", "d2c", "ecommerce", "donation", "mission", "comfort", "fashion"]
  },
  {
    id: "case-04",
    name: "Copa Di Vino",
    stage: "Growth Round ($600k)",
    industry: "Food & Beverage",
    ask: "$600,000 for 20%",
    valuation: "$3,000,000",
    outcome: "Rejected",
    investor: "None (Passed by all investors)",
    summary: "Single-serve premium wine packaged in patented splash-proof plastic stemware for venues and outdoor events.",
    hook: "Every outdoor stadium, concert, and golf course wants to sell premium wine, but glass bottles are prohibited and plastic cups ruin the aroma.",
    strengths: [
      "$5M+ in trailing revenue demonstrating genuine market appetite",
      "Proprietary packaging and bottling equipment with patent protection"
    ],
    weaknessesFlagged: [
      "Founder refused to license the packaging technology, insisting on being a wine maker rather than a high-margin packaging IP company",
      "Antagonistic attitude toward investor terms and strategic guidance",
      "High inventory carrying costs and complex multi-state alcohol distributor laws"
    ],
    investorFeedback: "Venture Lead: 'You're sitting on a multi-million dollar packaging patent, but you insist on being a low-margin winery. You are burning money by fighting your biggest asset.'",
    keywords: ["wine", "beverage", "alcohol", "drink", "packaging", "stadium", "glass", "single-serve", "patent", "liquor"]
  },
  {
    id: "case-05",
    name: "Drop Stop",
    stage: "Seed Round ($300k)",
    industry: "Automotive & Safety",
    ask: "$300,000 for 15%",
    valuation: "$2,000,000",
    outcome: "Funded",
    investor: "Strategic Angel Investor",
    summary: "Patented neoprene car seat gap filler preventing phones, keys, and coins from falling into the unreachable Carmuda Triangle.",
    hook: "80% of all car accidents occur because drivers take their eyes off the road for just 3 seconds searching for a dropped phone between their seats.",
    strengths: [
      "Solved a universal daily frustration that every driver immediately recognizes",
      "Clear utility patent covering the seatbelt slot surround",
      "Demonstrable live pitch with 100% universal fit"
    ],
    weaknessesFlagged: [
      "One-time purchase product with limited lifetime customer value (low LTV)",
      "High vulnerability to cheap offshore knockoffs on open marketplaces"
    ],
    investorFeedback: "Consumer Angel: 'This is an impulse buy with zero friction. You show the problem once, people nod, and they buy it on the spot.'",
    keywords: ["car", "automotive", "gap", "seat", "drop", "phone", "keys", "safety", "driving", "neoprene"]
  },
  {
    id: "case-06",
    name: "Kodiak Cakes",
    stage: "Growth Round ($500k)",
    industry: "Food & CPG",
    ask: "$500,000 for 10%",
    valuation: "$5,000,000",
    outcome: "Rejected",
    investor: "None (Grew independently to $200M+ revenue)",
    summary: "100% whole grain, high-protein pancake and waffle mix powered by non-GMO ingredients.",
    hook: "Traditional breakfast foods are empty carbohydrates that leave you sluggish by 10 AM. What if pancake breakfast fueled peak athletic performance?",
    strengths: [
      "Pioneered the high-protein breakfast category before legacy food brands caught on",
      "Established shelf placement in Target and regional supermarket chains",
      "Strong brand identity and clean ingredient label"
    ],
    weaknessesFlagged: [
      "Low cash reserves relative to aggressive nationwide retail expansion plans",
      "High shelf-space slotting fees demanded by major national grocers"
    ],
    investorFeedback: "CPG Fund: 'Great product, but competing against breakfast giants in center-store grocery requires immense capital reserves to defend shelf space.'",
    keywords: ["pancake", "protein", "breakfast", "food", "cpg", "grocery", "waffle", "nutrition", "grain", "fitness"]
  },
  {
    id: "case-07",
    name: "Simple Sugars",
    stage: "Angel Round ($100k)",
    industry: "Beauty & Personal Care",
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
  },
  {
    id: "case-08",
    name: "SaaS & AI DevTools (YC Model)",
    stage: "Seed Round ($500k)",
    industry: "Software & SaaS",
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

// Compatibility alias
export const SHARK_PERSONAS = INVESTOR_PERSONAS;
