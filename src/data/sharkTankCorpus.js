// Curated Knowledge Base of Shark Tank & Y Combinator Pitches
// Used for Retrieval-Augmented Pitch Evaluation (RAG)

export const SHARK_TANK_CORPUS = [
  {
    id: "case-01",
    name: "Scrub Daddy",
    season: "Season 4",
    industry: "Consumer Goods",
    ask: "$100,000 for 10%",
    valuation: "$1,000,000",
    outcome: "Funded",
    investor: "Lori Greiner",
    summary: "High-tech polymer cleaning sponge that changes texture based on water temperature (firm in cold, soft in warm).",
    hook: "Traditional sponges scratch surfaces, smell terrible within days, and harbor billions of bacteria. What if your sponge adapted to every surface you cleaned?",
    strengths: [
      "Demonstrable live visual proof within first 15 seconds",
      "Solved a universal daily household annoyance",
      "Clear patent protection and manufacturing cost under $0.30/unit"
    ],
    weaknessesFlagged: [
      "Initially relied too heavily on local grocery retail without QVC/DRTV distribution strategy"
    ],
    sharkFeedback: "Lori Greiner: 'I know a hero product when I see one. You demonstrated the texture change in 10 seconds — that sells itself on TV.'",
    keywords: ["sponge", "cleaning", "household", "texture", "polymer", "kitchen", "dishes", "patent", "retail", "consumer"]
  },
  {
    id: "case-02",
    name: "Doorbot (Ring)",
    season: "Season 5",
    industry: "Tech & Hardware",
    ask: "$700,000 for 10%",
    valuation: "$7,000,000",
    outcome: "Rejected",
    investor: "None (Acquired by Amazon for $1B+)",
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
    sharkFeedback: "Mark Cuban: 'I don't think you're a product that can stand alone against Google or ADT. The cost of acquisition is going to eat you alive. I'm out.'",
    keywords: ["security", "doorbell", "camera", "wifi", "iot", "hardware", "home", "burglar", "app", "tech", "video"]
  },
  {
    id: "case-03",
    name: "Bombas",
    season: "Season 6",
    industry: "Apparel & D2C",
    ask: "$200,000 for 5%",
    valuation: "$4,000,000",
    outcome: "Funded",
    investor: "Daymond John",
    summary: "Engineered premium socks engineered for comfort with a 1-for-1 donation model to homeless shelters.",
    hook: "Did you know socks are the #1 requested clothing item in homeless shelters? Yet the everyday sock hasn't been re-engineered in over 50 years.",
    strengths: [
      "Emotional mission combined with superior engineered product specs (honeycomb arch, blister tab)",
      "$1.2M revenue in first 9 months",
      "Exceptional repeat customer purchase rate (>45%)"
    ],
    weaknessesFlagged: [
      "Inventory capital intensity and risk of charity mission eroding gross margins"
    ],
    sharkFeedback: "Daymond John: 'You showed me the blister tab, the honeycomb weave, and then hit me with $1.2M in sales. You proved people will pay $12 for a sock if it actually feels better.'",
    keywords: ["socks", "clothing", "apparel", "d2c", "ecommerce", "comfort", "fashion", "shelter", "cotton", "wear"]
  },
  {
    id: "case-04",
    name: "Copa Di Vino",
    season: "Season 2 & 3",
    industry: "Food & Beverage",
    ask: "$600,000 for 20%",
    valuation: "$3,000,000",
    outcome: "Rejected",
    investor: "None",
    summary: "Single-serve premium wine in a patented splash-proof plastic glass.",
    hook: "Opening a whole 750ml bottle of wine just for one glass leads to oxidation, waste, and spills on picnics or golf courses.",
    strengths: [
      "Innovative patented packaging technology",
      "Strong early retail sales in convenience stores"
    ],
    weaknessesFlagged: [
      "Founder refused to license the packaging technology, insisting on being a wine distributor",
      "Arrogant defensive attitude during valuation negotiations",
      "No clear defense against large winery shelf competition"
    ],
    sharkFeedback: "Kevin O'Leary: 'You are clinging to a winery ego when your only real asset is the patented packaging seal. You're a packaging company in denial. I'm out.'",
    keywords: ["wine", "beverage", "drink", "alcohol", "water", "packaging", "glass", "bottle", "food", "single-serve"]
  },
  {
    id: "case-05",
    name: "Drop Stop",
    season: "Season 4",
    industry: "Automotive & Safety",
    ask: "$300,000 for 15%",
    valuation: "$2,000,000",
    outcome: "Funded",
    investor: "Lori Greiner",
    summary: "Patented neoprene wedge that fills the gap between the car seat and center console (the 'Carmuda Triangle').",
    hook: "How many times have you dropped your phone or keys between your car seat and console while driving and almost swerved into oncoming traffic?",
    strengths: [
      "Universal driver pain point relatable in 3 seconds",
      "Full utility patent granted",
      "80%+ gross margin on retail packaging"
    ],
    weaknessesFlagged: [
      "Limited product line (single-SKU vulnerability)",
      "Required major retail store shelf space to educate consumer"
    ],
    sharkFeedback: "Lori Greiner: 'Every single person who drives a car has experienced this exact frustration. It’s cheap to make, patented, and solves a safety issue.'",
    keywords: ["car", "automotive", "seat", "console", "safety", "phone", "wedge", "keys", "universal", "gap"]
  },
  {
    id: "case-06",
    name: "Kodiak Cakes",
    season: "Season 5",
    industry: "Food & Beverage",
    ask: "$500,000 for 10%",
    valuation: "$5,000,000",
    outcome: "Rejected (Built to $200M+ exit)",
    investor: "None (Refused shark lowball offers)",
    summary: "High-protein 100% whole-grain pancake and waffle flapjack mix.",
    hook: "Most breakfast foods leave you crashing by 10 AM because they are empty carbs and refined sugar with zero lasting fuel.",
    strengths: [
      "Targeted the massive healthy active lifestyle demographic",
      "$6.7M in revenue before entering the tank",
      "Consistent product re-order velocity at Target and grocery chains"
    ],
    weaknessesFlagged: [
      "Thin grocery retail margins (grocery slotting fees)",
      "Crowded shelf space dominated by legacy conglomerates like Aunt Jemima"
    ],
    sharkFeedback: "Kevin O'Leary: 'Your sales are impressive, but the grocery business is a bloodbath of slotting fees. Your valuation is too rich for a pancake mix.'",
    keywords: ["food", "pancake", "protein", "breakfast", "grain", "health", "nutrition", "snack", "grocery", "wellness"]
  },
  {
    id: "case-07",
    name: "Simple Sugars",
    season: "Season 4",
    industry: "Health & Skincare",
    ask: "$100,000 for 10%",
    valuation: "$1,000,000",
    outcome: "Funded",
    investor: "Mark Cuban",
    summary: "All-natural sugar scrubs specifically formulated for eczema and sensitive skin.",
    hook: "If you suffer from sensitive skin or eczema, 90% of commercial lotions make your breakouts worse because they are packed with synthetic preservatives.",
    strengths: [
      "Authentic 18-year-old founder story solving her own medical eczema condition",
      "High gross margins (>82%) on direct-to-consumer e-commerce",
      "Cult-like loyal repeat customer base"
    ],
    weaknessesFlagged: [
      "No preservative shelf-life risk (under 12 months)",
      "Scaling production out of a home basement"
    ],
    sharkFeedback: "Mark Cuban: 'I love that you understand your unit economics. You make a jar for $2.40 and sell it for $14. That's real margin, and the repeat orders are insane.'",
    keywords: ["skincare", "skin", "eczema", "sugar", "beauty", "cosmetics", "lotion", "organic", "natural", "dermatology"]
  },
  {
    id: "case-08",
    name: "SaaS & AI DevTools (YC Model)",
    season: "YC Demo Day",
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
    sharkFeedback: "Tech Investor: 'The 130% NDR tells me once an engineering team plugs this in, they never turn it off. That's the hallmark of an essential utility.'",
    keywords: ["software", "saas", "developer", "cloud", "api", "ai", "code", "platform", "tool", "enterprise", "tech"]
  }
];

export const SHARK_PERSONAS = [
  {
    name: "The Tech & Scalability Shark",
    avatar: "🦈",
    focus: "Customer Acquisition & Market Moat",
    archetype: "Mark Cuban Style",
    evaluate: (metrics, pitch) => {
      const hasNumbers = /\d+/.test(pitch);
      const isTech = /software|app|platform|ai|tech|code|system|cloud/i.test(pitch);
      if (!hasNumbers) {
        return "Where are your unit economics? Anyone can have an idea, but without knowing your cost to acquire a customer (CAC) versus lifetime value (LTV), you're just burning cash. You need hard numbers.";
      }
      if (isTech) {
        return "I like the tech angle, but what is your defensible moat? If Google, Apple, or an open-source team builds this next Tuesday, why do users stay with you?";
      }
      return "The market size is interesting, but you need to demonstrate how you scale outside your local circle without your marketing costs exploding.";
    }
  },
  {
    name: "The Numbers & Margin Shark",
    avatar: "💰",
    focus: "Gross Margins & Free Cash Flow",
    archetype: "Kevin O'Leary Style",
    evaluate: (metrics, pitch) => {
      const hasCTA = /\b(buy|try|order|invest|pricing|sale|call|contact)\b/i.test(pitch);
      const hasMargin = /margin|cost|profit|revenue|price|dollar|\$|\%/i.test(pitch);
      if (!hasMargin) {
        return "You haven't told me what it costs to make and what you sell it for! All business is math. If you don't have at least a 60% gross margin, you are working for charity. Give me the numbers!";
      }
      if (!hasCTA) {
        return "You walked into the tank and didn't even tell the customer how to hand you their money! A pitch without an aggressive close is just a story. What is the ask?";
      }
      return "You have numbers, but I want to know when I get my investment back. Prove to me the cash flow is predictable, or I'm out.";
    }
  },
  {
    name: "The Retail & Hero Product Shark",
    avatar: "✨",
    focus: "Demonstration & Consumer Appeal",
    archetype: "Lori Greiner Style",
    evaluate: (metrics, pitch) => {
      const hasHook = pitch.trim().split(/[.!?]+/)[0].split(' ').length <= 14;
      const isDemonstrable = /see|look|demonstrat|feel|watch|experience|notice/i.test(pitch);
      if (!hasHook) {
        return "Your opening sentence is way too long! You have 5 seconds on television or social media to hook the consumer before they scroll away. Make it visual and punchy.";
      }
      if (isDemonstrable) {
        return "I love that you can demonstrate this instantly! That is the hallmark of a hero product that can sell millions on QVC, Amazon, or retail shelves.";
      }
      return "Show, don't just tell. Put the product in the customer's hands within the first 10 seconds so they instantly feel the transformation.";
    }
  }
];
