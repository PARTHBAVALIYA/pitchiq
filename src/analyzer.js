// PitchIQ RAG & Case-Based Pitch Intelligence Engine v2.0
// Powered by Venture Capital & Early Stage Case-Grounded Retrieval

import { VENTURE_DEAL_CORPUS, INVESTOR_PERSONAS } from './data/sharkTankCorpus';

export function analyzePitch(text, pitchType = "Investor Pitch", audience = "Investors") {
  const clean = text.trim().replace(/\s+/g, ' ');
  const t = clean.toLowerCase();
  const words = clean.split(' ').filter(Boolean);
  const wc = words.length;
  const rawSentences = clean.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 3);

  // 1. Rhetorical Feature Flags
  const hasName       = /\b(i'?m|my name is|i am|we are|founder of)\b/i.test(clean);
  const hasCompany    = /\b(company|startup|business|brand|founder|ceo|owner|team)\b/i.test(clean);
  const hasProblem    = /\b(problem|issue|pain|struggle|frustrat|challenge|annoy|fail|lose|costly)\b/i.test(clean);
  const hasSolution   = /\b(solution|solve|fix|introducing|we bring|we offer|we provide|we build|we create|invented|designed)\b/i.test(clean);
  const hasBenefit    = /\b(energy|refresh|benefit|help|save|improve|feel|better|result|healthy|natural|fast|boost|profit|protect)\b/i.test(clean);
  const hasCTA        = /\b(try|buy|visit|sign up|contact|call|order|get yours|today|now|grab|invest|join|book|partner)\b/i.test(clean);
  const hasNumber     = /\d+/.test(clean);
  const hasQuestion   = clean.includes('?');
  const firstWords    = rawSentences.length > 0 ? rawSentences[0].split(' ').filter(Boolean).length : 0;
  const hasHook       = firstWords > 0 && firstWords <= 14;
  const tooShort      = wc < 25;
  const hasVagueClaim = /\b(goodness|amazing|great|best|incredible|unique|special|revolutionary|disruptive)\b/i.test(clean) && !hasNumber;
  const hasFinancials = /\b(revenue|margin|cost|profit|sale|valuation|price|dollar|\$|\%|mrr|arr)\b/i.test(clean);

  // 2. Multi-Dimensional Component Scores (0 - 100)
  const clarity    = Math.min(100, Math.max(25, 40 + (hasSolution ? 20 : 0) + (hasBenefit ? 15 : 0) + (wc >= 35 ? 15 : 0) + (hasFinancials ? 10 : 0)));
  const hook       = Math.min(100, Math.max(20, 25 + (hasHook ? 30 : 0) + (hasQuestion ? 20 : 0) + (hasProblem ? 15 : 0) + (hasName ? 10 : 0)));
  const structure  = Math.min(100, Math.max(20, 20 + (hasName ? 15 : 0) + (hasCompany ? 15 : 0) + (hasProblem ? 20 : 0) + (hasSolution ? 20 : 0) + (hasCTA ? 10 : 0)));
  const persuasion = Math.min(100, Math.max(25, 30 + (hasBenefit ? 20 : 0) + (hasNumber ? 25 : 0) + (hasFinancials ? 15 : 0) - (hasVagueClaim ? 10 : 0)));
  const cta        = hasCTA ? Math.min(100, 75 + (wc >= 45 ? 15 : 0) + (hasFinancials ? 10 : 0)) : 20;
  const confidence = Math.min(100, Math.max(30, 40 + (!tooShort ? 25 : 0) + (hasCompany ? 15 : 0) + (hasNumber ? 10 : 0) + (rawSentences.length >= 3 ? 10 : 0)));

  // Audience weighting
  let weightedOverall = (clarity * 0.18) + (hook * 0.20) + (structure * 0.18) + (persuasion * 0.22) + (cta * 0.12) + (confidence * 0.10);
  if (audience === "Investors" || pitchType === "Investor Pitch") {
    weightedOverall = (clarity * 0.15) + (hook * 0.15) + (structure * 0.15) + (persuasion * 0.30) + (cta * 0.15) + (confidence * 0.10);
  }
  const overall = Math.round(weightedOverall);

  // 3. RAG Retrieval over Venture Deal Corpus
  const pitchTokens = clean.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const tokenSet = new Set(pitchTokens);

  const scoredCases = VENTURE_DEAL_CORPUS.map(c => {
    let matchScore = 0;
    c.keywords.forEach(kw => {
      if (tokenSet.has(kw) || t.includes(kw)) matchScore += 3;
    });
    if (t.includes(c.industry.toLowerCase())) matchScore += 4;
    return { ...c, matchScore };
  }).sort((a, b) => b.matchScore - a.matchScore);

  // Top retrieved case studies
  const topMatch = scoredCases[0] || VENTURE_DEAL_CORPUS[0];
  const matchedFunded = scoredCases.find(c => c.outcome === "Funded") || VENTURE_DEAL_CORPUS[0];
  const matchedRejected = scoredCases.find(c => c.outcome === "Rejected") || VENTURE_DEAL_CORPUS[1];

  // 4. Entity Extraction for Synthesis
  const nameMatch = clean.match(/\b(?:i'?m|my name is|i am)\s+([A-Z][a-z]+)/i);
  const speakerName = nameMatch ? nameMatch[1] : "Founder";

  const companyMatch = clean.match(/\b(?:owner of|founder of|at|from)\s+([A-Z][a-zA-Z0-9\s]{2,18})/i);
  const companyName = companyMatch ? companyMatch[1].trim() : "our company";

  const productMatch = clean.match(/\b(water|beverage|app|platform|software|system|tool|service|product|device|sponge|hardware)\b/i);
  const product = productMatch ? productMatch[0].toLowerCase() : "solution";

  const numbersFound = clean.match(/\b\d+(?:[\.,]\d+)?(?:\%|k|m|x)?\b/gi) || [];

  // Extract Benefit Words
  const benefitTerms = [];
  if (/energy|power|active/i.test(clean)) benefitTerms.push("lasting energy");
  if (/refresh|pure|himalaya|clean|water/i.test(clean)) benefitTerms.push("uncompromised purity");
  if (/time|hour|speed|fast/i.test(clean)) benefitTerms.push("10x faster execution");
  if (/cost|save|cheap|affordable/i.test(clean)) benefitTerms.push("significant cost reduction");
  if (/safety|security|protect/i.test(clean)) benefitTerms.push("rock-solid protection");
  if (/health|wellness|organic/i.test(clean)) benefitTerms.push("healthier daily living");
  const benefit = benefitTerms.length > 0 ? benefitTerms.slice(0, 2).join(" and ") : "proven, measurable results";

  // 5. Case-Grounded Fatal Flaws & Mistakes
  const mistakes = [];
  if (!hasProblem) {
    mistakes.push("No explicit problem statement — Investors buy solutions to hair-on-fire problems. Without customer pain, you have a vitamin, not a painkiller.");
  }
  if (!hasNumber) {
    mistakes.push(`Zero traction numbers — In venture funding, deals like ${matchedRejected.name} struggled when unit economics were vague. You need verified revenue, margins, or user counts.`);
  }
  if (!hasCTA) {
    mistakes.push("Missing closing ask (Call-to-Action) — You walked through the pitch and never asked for the investment or next meeting.");
  }
  if (!hasHook) {
    mistakes.push("Opening hook is too long (>14 words) — Venture investor research shows listeners form an impression within the first 10 seconds.");
  }
  if (hasVagueClaim && !hasNumber) {
    mistakes.push("Unsubstantiated hype adjectives ('amazing', 'unique') — Buzzwords without empirical proof trigger immediate skepticism.");
  }
  if (mistakes.length < 3) {
    mistakes.push("Unit Economics unspecified — Mention cost of goods (COGS), gross margins, or customer acquisition cost (CAC).");
  }

  // 6. Actionable Improvements & Lessons Learned from Lead Investors
  const improvements = [];
  improvements.push(`Benchmark against ${matchedFunded.name} (${matchedFunded.outcome}): Open with their winning formula — "${matchedFunded.hook.slice(0, 95)}..."`);
  if (!hasProblem) {
    improvements.push(`Frame the villain: "Most ${product}s on the market suffer from high failure rates, leaving customers frustrated and wasting money."`);
  }
  if (!hasNumber) {
    improvements.push(`Add quantitative proof: State unit economics (e.g., "Cost to make: $3, Sells for: $18, with 70% gross margins and 1,200 active users").`);
  }
  if (!hasCTA) {
    improvements.push(`End with an Investor Ask: "We are seeking $150,000 for 10% equity to scale our inventory and distribution footprint. Join us."`);
  }
  improvements.push(`Apply ${matchedFunded.investor || "the lead investor"}'s guidance: "${matchedFunded.investorFeedback}"`);

  // 7. Investor Persona Reactions
  const investorReactions = INVESTOR_PERSONAS.map(p => ({
    name: p.name,
    archetype: p.archetype,
    feedback: p.evaluate({ clarity, hook, structure, persuasion, cta }, clean)
  }));

  // 8. Investor-Grade Dynamic Rewrite (5-Step Winning Pitch Architecture)
  const hookSentence = hasQuestion && rawSentences[0].includes('?')
    ? rawSentences[0]
    : `Did you know that 85% of customers struggle with inefficient, overpriced ${product}s every single day?`;

  const problemSentence = hasProblem
    ? (rawSentences.find(s => /problem|issue|pain|struggle/i.test(s)) || `There's a critical flaw in the current ${product} market that nobody is solving properly.`) + "."
    : `Current ${product} options on the market are outdated, costly, and fail to deliver on their promises.`;

  const solutionSentence = `Hi, I'm ${speakerName}${companyName !== "our company" ? `, founder of ${companyName}` : ""}. We engineered a proprietary ${product} that completely solves this problem through ${benefit}.`;

  const tractionSentence = hasNumber
    ? `In early customer rollouts, we have already achieved ${numbersFound.slice(0, 2).join(' and ')} in verified traction with 80%+ positive customer retention.`
    : `With healthy unit economics and strong organic demand, we are delivering high margins while keeping customer acquisition costs low.`;

  const askSentence = hasCTA
    ? (rawSentences.find(s => /try|buy|visit|order|invest/i.test(s)) || `Try our ${product} today and experience the difference yourself.`) + "."
    : `We are scaling our operations today — visit ${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com to partner with us.`;

  const investorGradeRewrite = `${hookSentence} ${problemSentence} ${solutionSentence} ${tractionSentence} ${askSentence}`;

  const verdict = overall >= 80
    ? "Investment-Ready: Exceptional balance of hook, quantifiable proof, and commercial viability. Ready for institutional investor presentations."
    : overall >= 60
    ? "Promising Concept: Strong foundational value, but needs harder unit economics (margins, CAC) and a more decisive closing ask."
    : "High Rejection Risk: Institutional investors would pass due to lack of problem framing and missing traction proof points.";

  return {
    overall_score: overall,
    verdict,
    metrics: {
      "Clarity & Logic": clarity,
      "Opening Hook": hook,
      "Rhetorical Structure": structure,
      "Persuasion & Proof": persuasion,
      "Call-to-Action": cta,
      "Investor Confidence": confidence
    },
    retrieved_case_studies: {
      primary: topMatch,
      funded_benchmark: matchedFunded,
      rejected_benchmark: matchedRejected
    },
    shark_reactions: investorReactions, // kept for backward-compatible prop in UI
    investor_reactions: investorReactions,
    mistakes: mistakes.slice(0, 3),
    improvements: improvements.slice(0, 3),
    rewritten_opening: investorGradeRewrite,
    winning_tags: [
      hasNumber ? "Traction Verified" : "Idea Stage",
      hasHook ? "Punchy Hook" : "Lengthy Opening",
      hasCTA ? "Clear Ask" : "No CTA"
    ],
    danger_tags: [
      !hasProblem ? "Missing Problem Frame" : "Defensible Pain",
      !hasFinancials ? "No Unit Economics" : "Margin Aware"
    ]
  };
}

// Preset pitches for instant 1-click test demonstrations
export const PRESET_PITCHES = [
  {
    title: "Enterprise B2B SaaS",
    type: "Investor Pitch",
    audience: "Investors",
    text: "Did you know enterprise sales teams waste 15 hours a week manually prepping discovery pitches? Hi, I'm Parth, founder of PitchIQ. We build an automated speech coaching platform that analyzes sales scripts against 200+ funded venture deals. We already have 1,400 active sales reps, $24,000 in monthly recurring revenue, and 78% gross margins. We are raising $250,000 for 10% equity to scale our enterprise pipeline. Join us today."
  },
  {
    title: "Consumer Beverage Brand",
    type: "Sales Demo",
    audience: "Investors",
    text: "Hi, I'm Parth, founder of King Water company. We bring pure Himalayan spring water infused with natural gold dust to help athletes and busy professionals feel refreshed and maintain lasting energy throughout the day. Our water is naturally mineral-rich, providing unmatched purity and better health without any artificial chemicals. Try our first batch today and feel the difference."
  },
  {
    title: "Hardware Consumer IoT",
    type: "Investor Pitch",
    audience: "Investors",
    text: "How many times have you lost your keys or phone right when you are running late for an important meeting? We invented KeyPulse, a Bluetooth rechargeable tracker that flashes and rings at 110 decibels through walls. We hold two utility patents, and it costs us $4 to manufacture and retails for $29 with an 86% margin. We have sold 8,000 units on Amazon. We are seeking $100,000 for 10% equity."
  },
  {
    title: "Unstructured Early Draft",
    type: "Investor Pitch",
    audience: "Investors",
    text: "Our product is really amazing and has incredible goodness. We are the best team out there and our solution is completely unique and special in the market. Everyone who has seen it really likes it and we know you will love it too. It is revolutionary and disruptive."
  }
];
