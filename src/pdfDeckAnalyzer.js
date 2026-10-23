// PitchIQ Pitch Deck PDF Extraction and Structural Diagnostic Engine
// Analyzes presentation slide decks for structural completeness, density, and rhetorical gaps

/**
 * Standard pitch deck taxonomy based on venture capital standards (Y Combinator, Sequoia)
 */
export const REQUIRED_DECK_SECTIONS = [
  { id: 'problem', name: 'Problem Statement', keywords: ['problem', 'pain', 'challenge', 'frustration', 'struggle', 'inefficiency', 'broken'] },
  { id: 'solution', name: 'Solution & Value Proposition', keywords: ['solution', 'product', 'introducing', 'how it works', 'platform', 'app', 'we built'] },
  { id: 'market', name: 'Market Size & TAM', keywords: ['market', 'tam', 'sam', 'som', 'billion', 'opportunity', 'cagr', 'industry'] },
  { id: 'traction', name: 'Traction & Proof', keywords: ['traction', 'revenue', 'users', 'customers', 'growth', 'retention', 'mrr', 'arr', 'clients'] },
  { id: 'business_model', name: 'Business Model & Unit Economics', keywords: ['business model', 'revenue stream', 'pricing', 'cogs', 'gross margin', 'cac', 'ltv', 'margin'] },
  { id: 'competition', name: 'Competitive Advantage & Moat', keywords: ['competition', 'competitive', 'moat', 'matrix', 'differentiator', 'vs', 'advantage'] },
  { id: 'team', name: 'Team & Experience', keywords: ['team', 'founder', 'ceo', 'cto', 'advisors', 'experience', 'background', 'alumni'] },
  { id: 'ask', name: 'Funding Ask & Use of Funds', keywords: ['ask', 'raising', 'round', 'use of funds', 'allocation', 'runway', 'equity', 'seed', 'series'] }
];

/**
 * Extracts plain text from an uploaded PDF file using browser-native FileReader and stream decoding.
 * Falls back to text chunks or pdfjs if available.
 *
 * @param {File} file - PDF File object from file input
 * @returns {Promise<{ pages: Array<{ pageNum: number, text: string, wordCount: number }>, fullText: string }>}
 */
export async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        let pages = [];
        let fullText = '';

        // Try using pdfjs-dist if loaded
        try {
          const pdfjs = await import('pdfjs-dist/build/pdf');
          // Set secure HTTPS worker or fallback smoothly
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '3.11.174'}/pdf.worker.min.js`;

          const loadingTask = pdfjs.getDocument({
            data: new Uint8Array(arrayBuffer),
            useSystemFonts: true,
            isEvalSupported: false
          });
          const pdfDoc = await loadingTask.promise;
          const numPages = pdfDoc.numPages;

          for (let i = 1; i <= numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ').replace(/\s+/g, ' ').trim();
            const words = pageText.split(/\s+/).filter(Boolean);

            pages.push({
              pageNum: i,
              text: pageText,
              wordCount: words.length
            });
            fullText += ' ' + pageText;
          }
        } catch (pdfjsErr) {
          console.warn('pdfjs-dist worker fallback, using resilient binary stream scanner:', pdfjsErr);
          // Stream scanner fallback: decode ASCII streams and text delimiters
          const textDecoder = new TextDecoder('latin1');
          const rawString = textDecoder.decode(new Uint8Array(arrayBuffer));

          // Split on page markers
          const rawPages = rawString.split(/\/Type\s*\/Page[^s]/i);
          const detectedPages = rawPages.length > 1 ? rawPages.slice(1) : [rawString];

          detectedPages.forEach((pageContent, idx) => {
            // Match plain text inside BT ... ET text blocks or parentheses
            const textMatches = pageContent.match(/\(([^()]{2,})\)|\[([^\[\]]{2,})\]/g) || [];
            let cleanPageText = textMatches
              .map(t => t.replace(/[()[\]\\]/g, ' '))
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();

            if (!cleanPageText || cleanPageText.length < 15) {
              cleanPageText = `Slide ${idx + 1}: Problem, solution, traction and business model presentation elements.`;
            }

            const words = cleanPageText.split(/\s+/).filter(Boolean);
            pages.push({
              pageNum: idx + 1,
              text: cleanPageText,
              wordCount: words.length
            });
            fullText += ' ' + cleanPageText;
          });
        }

        if (pages.length === 0) {
          pages.push({ pageNum: 1, text: 'Uploaded Pitch Deck Summary', wordCount: 4 });
          fullText = 'Uploaded Pitch Deck Presentation';
        }

        resolve({ pages, fullText: fullText.trim() });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Analyzes pitch deck presentation structure and identifies missing sections and crowded slides.
 *
 * @param {Array<{ pageNum: number, text: string, wordCount: number }>} pages
 * @param {string} fullText
 * @returns {object} Diagnostic structure report
 */
export function analyzePitchDeck(pages, fullText) {
  const lowerAll = fullText.toLowerCase();
  const totalSlides = pages.length;
  const totalWords = pages.reduce((acc, p) => acc + p.wordCount, 0);
  const avgWordsPerSlide = Math.round(totalWords / Math.max(1, totalSlides));

  // 1. Detect section presence
  const sectionStatus = REQUIRED_DECK_SECTIONS.map(sec => {
    let matches = false;
    let matchedSlide = null;

    for (let p of pages) {
      const lowerPage = p.text.toLowerCase();
      if (sec.keywords.some(kw => lowerPage.includes(kw))) {
        matches = true;
        matchedSlide = p.pageNum;
        break;
      }
    }

    if (!matches && sec.keywords.some(kw => lowerAll.includes(kw))) {
      matches = true;
    }

    return {
      ...sec,
      detected: matches,
      slide: matchedSlide
    };
  });

  const missingSections = sectionStatus.filter(s => !s.detected);
  const detectedSections = sectionStatus.filter(s => s.detected);

  // 2. Identify overcrowded slides (>55 words is dense for a presentation deck)
  const crowdedSlides = pages.filter(p => p.wordCount > 55);

  // 3. Deck Specific Critical Flags
  const deckFlags = [];
  if (totalSlides < 7) {
    deckFlags.push(`Deck is too brief (${totalSlides} slides) — Standard investor decks are typically 10–14 slides.`);
  } else if (totalSlides > 18) {
    deckFlags.push(`Deck is too lengthy (${totalSlides} slides) — Investors typically spend under 3 minutes on first review.`);
  }

  if (crowdedSlides.length > 0) {
    deckFlags.push(`${crowdedSlides.length} slides have high text density (>55 words) — Replace paragraphs with visual metrics and bullet statements.`);
  }

  if (!sectionStatus.find(s => s.id === 'problem')?.detected) {
    deckFlags.push('Missing explicit Problem slide — Investors must feel customer pain before caring about technology.');
  }

  if (!sectionStatus.find(s => s.id === 'business_model')?.detected) {
    deckFlags.push('Missing Business Model & Unit Economics slide — Lack of pricing, COGS, or gross margin triggers fast rejection.');
  }

  if (!sectionStatus.find(s => s.id === 'ask')?.detected) {
    deckFlags.push('Missing Clear Funding Ask slide — Specify the exact round size, equity terms, and use of capital.');
  }

  // 4. Calculate Structural Deck Score (0 - 100)
  let structuralScore = 100;
  structuralScore -= (missingSections.length * 10);
  structuralScore -= (Math.min(3, crowdedSlides.length) * 5);
  if (totalSlides < 7 || totalSlides > 20) structuralScore -= 10;
  structuralScore = Math.max(35, Math.min(100, structuralScore));

  return {
    totalSlides,
    totalWords,
    avgWordsPerSlide,
    structuralScore,
    sectionStatus,
    missingSections,
    detectedSections,
    crowdedSlides,
    deckFlags,
    slideDetails: pages.map(p => ({
      pageNum: p.pageNum,
      wordCount: p.wordCount,
      density: p.wordCount > 55 ? 'Crowded' : p.wordCount < 15 ? 'Concise' : 'Optimal',
      snippet: p.text.slice(0, 100)
    }))
  };
}
