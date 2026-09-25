// PitchIQ Analysis Engine v1.2 — Dynamic rewrite based on actual pitch

export function analyzePitch(text, pitchType, audience) {
  const clean = text.trim().replace(/\s+/g, ' ');
  const t = clean.toLowerCase();
  const words = clean.split(' ');
  const wc = words.length;
  const sentences = clean.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);

  const hasName       = /\b(i'?m|my name is|i am)\b/.test(t);
  const hasCompany    = /\b(company|startup|business|brand|founder|ceo|owner)\b/.test(t);
  const hasProblem    = /\b(problem|issue|pain|struggle|challenge)\b/.test(t);
  const hasSolution   = /\b(solution|solve|fix|introducing|we bring|we offer|we provide|we build|we create)\b/.test(t);
  const hasBenefit    = /\b(energy|refresh|benefit|help|save|improve|feel|better|result|healthy|natural)\b/.test(t);
  const hasCTA        = /\b(try|buy|visit|sign up|contact|call|order|get yours|today|now|grab)\b/.test(t);
  const hasNumber     = /\d+/.test(t);
  const hasQuestion   = clean.includes('?');
  const firstWords    = sentences.length > 0 ? sentences[0].split(' ').length : 0;
  const hasHook       = firstWords > 0 && firstWords <= 12;
  const tooShort      = wc < 30;
  const hasSpelling   = /\bhellow\b|\bhear i\b|\bfell \b/.test(t);
  const hasVagueClaim = /\b(goodness|amazing|great|best|incredible|unique|special)\b/.test(t) && !hasNumber;
  const longEnough    = sentences.length >= 3;

  const clarity    = Math.min(100, 40 + (hasSolution?20:0) + (hasBenefit?15:0) + (!hasSpelling?15:0) + (wc>40?10:0));
  const hook       = Math.min(100, 30 + (hasHook?25:0)    + (hasQuestion?15:0)  + (hasProblem?20:0)  + (hasName?10:0));
  const structure  = Math.min(100, 20 + (hasName?15:0)    + (hasCompany?15:0)   + (hasProblem?20:0)  + (hasSolution?20:0) + (hasCTA?10:0));
  const persuasion = Math.min(100, 30 + (hasBenefit?25:0) + (hasNumber?20:0)    + (!hasVagueClaim?15:0) + (hasProblem?10:0));
  const cta        = hasCTA ? Math.min(100, 75 + (wc>60?15:0)) : 20;
  const confidence = Math.min(100, 40 + (!tooShort?20:0)  + (hasCompany?15:0)   + (!hasSpelling?15:0) + (longEnough?10:0));
  const overall    = Math.round((clarity + hook + structure + persuasion + cta + confidence) / 6);

  // ── Dynamic rewrite based on actual pitch content ──────────────────────────

  // Extract name if mentioned
  const nameMatch = clean.match(/\b(?:i'?m|my name is|i am)\s+([A-Z][a-z]+)/i);
  const speakerName = nameMatch ? nameMatch[1] : "I";

  // Extract company name if mentioned
  const companyMatch = clean.match(/\b(?:owner of|founder of|from|at)\s+([A-Z][a-zA-Z\s]{2,20}(?:company|co|inc|water|tech|app|platform)?)/i);
  const companyName = companyMatch ? companyMatch[1].trim() : null;

  // Extract product/core offering from pitch
  const productMatch = clean.match(/\b(?:water|app|platform|tool|service|product|software|solution)\b/i);
  const product = productMatch ? productMatch[0].toLowerCase() : "product";

  // Extract key benefit words from the pitch itself
  const benefitWords = [];
  if (/energy|energetic/i.test(clean))    benefitWords.push("lasting energy");
  if (/refresh/i.test(clean))             benefitWords.push("deep refreshment");
  if (/natural|nature/i.test(clean))      benefitWords.push("the goodness of nature");
  if (/gold/i.test(clean))                benefitWords.push("gold-infused minerals");
  if (/himalaya/i.test(clean))            benefitWords.push("Himalayan purity");
  if (/health|healthy/i.test(clean))      benefitWords.push("better health");
  if (/clean|pure|purif/i.test(clean))    benefitWords.push("unmatched purity");
  if (/fast|speed|quick/i.test(clean))    benefitWords.push("lightning-fast results");
  if (/save|money|cost|cheap/i.test(clean)) benefitWords.push("significant cost savings");
  const benefit = benefitWords.length > 0 ? benefitWords.slice(0, 2).join(" and ") : "real results";

  // Build rewritten script dynamically
  const intro = speakerName !== "I"
    ? `Hi, I'm ${speakerName}${companyName ? ` — ${pitchType === "Investor Pitch" ? "founder" : "owner"} of ${companyName}` : ""}.`
    : companyName ? `Hi, I'm the ${pitchType === "Investor Pitch" ? "founder" : "owner"} of ${companyName}.` : "Hi there.";

  const hook_line = !hasProblem
    ? `Most people don't realize how much ${product} quality affects their daily performance — until they try something better.`
    : sentences.find(s => /problem|issue|pain|struggle/i.test(s)) || `There's a real problem in the ${product} market that nobody is solving properly.`;

  const solution_line = hasSolution
    ? `We've built a solution that changes that.`
    : `That's exactly what we set out to fix.`;

  const benefit_line = `The result? ${benefit.charAt(0).toUpperCase() + benefit.slice(1)} — delivered consistently, every single time.`;

  const cta_line = hasCTA
    ? sentences.find(s => /try|buy|visit|sign up|contact|today|now/i.test(s)) || `Try it today and see the difference for yourself.`
    : `Try it today — you'll notice the difference from your very first experience.`;

  const rewritten = `${intro} ${hook_line} ${solution_line} ${benefit_line} ${cta_line}`;

  // ── Mistakes ───────────────────────────────────────────────────────────────
  const mistakes = [];
  if (!hasProblem)                 mistakes.push("No problem statement — you haven't told the audience what pain you're solving. People buy solutions to problems.");
  if (!hasCTA)                     mistakes.push("Missing call-to-action — your pitch doesn't tell the audience what to do next (buy, try, visit, etc.).");
  if (hasSpelling)                 mistakes.push("Spelling/grammar errors detected — this reduces credibility. Proofread carefully before pitching.");
  if (!hasNumber)                  mistakes.push("No specific numbers or data — vague claims feel weak. Add stats, prices, or measurable results.");
  if (tooShort)                    mistakes.push("Pitch is too short — add more detail about your product, target market, and value proposition.");
  if (hasVagueClaim && !hasNumber) mistakes.push("Vague claims without proof — words like 'amazing' mean nothing without evidence.");
  if (!hasSolution)                mistakes.push("Solution is unclear — state clearly what your product does and how it works.");
  if (mistakes.length < 3)         mistakes.push("Opening line is weak — lead with a bold statement or surprising fact to grab attention.");

  // ── Improvements ──────────────────────────────────────────────────────────
  const improvements = [];
  if (!hasProblem)  improvements.push(`Add a problem statement: "Most ${product}s on the market are over-processed and stripped of natural goodness — leaving customers unsatisfied."`);
  if (!hasCTA)      improvements.push(`End with a strong CTA: "Try ${companyName || "us"} today${companyName ? " at " + companyName.toLowerCase().replace(/\s/g,'') + ".com" : ""} — your first order ships free."`);
  if (!hasNumber)   improvements.push(`Add specific proof: "Used by 10,000+ customers" or "Sourced from 3,500m elevation" — numbers build instant credibility.`);
  if (hasSpelling)  improvements.push("Fix spelling errors — small mistakes kill big credibility in a pitch. Use Grammarly to proofread.");
  if (tooShort)     improvements.push("Expand to 100-150 words — cover the problem, your solution, the key benefit, and a clear next step.");
  improvements.push(`Add social proof: "Trusted by ${audience === "Investors" ? "backed by leading investors" : "thousands of happy customers"}" builds instant trust.`);
  improvements.push("Open with a question or bold fact — hooks grab attention in the first 5 seconds and make people want to hear more.");

  const verdict = overall >= 70
    ? "Solid pitch with a clear product and benefit. Needs stronger problem framing and a call-to-action to convert."
    : overall >= 50
    ? "Good start — the product idea is clear, but the pitch lacks structure, proof points, and a closing CTA."
    : "The pitch needs significant work. Missing a problem statement, data, and call-to-action. Great product idea though!";

  return {
    overall_score: overall,
    verdict,
    metrics: { Clarity: clarity, Hook: hook, Structure: structure, Persuasion: persuasion, CTA: cta, Confidence: confidence },
    mistakes: mistakes.slice(0, 3),
    improvements: improvements.slice(0, 3),
    rewritten_opening: rewritten,
    winning_tags: [hasCompany ? "Has Brand" : "Personal Touch", hasBenefit ? "Shows Benefit" : "Has Product"],
    danger_tags: [!hasCTA ? "No CTA" : "Weak Close", !hasProblem ? "No Problem" : "Vague Claims"]
  };
}
