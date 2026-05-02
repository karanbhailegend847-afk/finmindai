const getKeysFromEnv = () => {
  const multiKeys = import.meta.env.VITE_GEMINI_API_KEYS;
  let keys = [];
  
  if (multiKeys) {
    keys = multiKeys.split(/[,\n]+/).map(k => k.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  } else {
    const singleKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (singleKey) {
      keys = [singleKey.trim().replace(/^["']|["']$/g, '')];
    }
  }

  // Debug logging with masking
  console.log(`[FinMind AI] Detected ${keys.length} API keys:`);
  keys.forEach((k, i) => {
    const masked = k.length > 8 ? `${k.slice(0, 4)}...${k.slice(-4)}` : '****';
    console.log(`  Key #${i + 1}: ${masked}`);
  });

  return keys;
};

const GEMINI_API_KEYS = getKeysFromEnv();

const GEMINI_MODELS = [
  'gemini-2.0-flash',        // Standard High Speed
  'gemini-2.0-flash-lite',   // Low Latency Fallback
  'gemini-1.5-flash',        // High Stability Fallback
  'gemini-2.5-flash-lite',   // User Requested (Beta/Private)
  'gemini-2.5-pro',         // User Requested (Beta/Private)
  'gemini-3-flash',          // User Requested (Future Proofing)
  'gemini-1.5-pro'           // High Reasoning (Last Resort)
];

const getGeminiUrl = (key, modelIdx = 0) => {
  const model = GEMINI_MODELS[modelIdx % GEMINI_MODELS.length];
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
};

// Track the current key index in localStorage to persist across refreshes
const getStoredKeyIndex = () => {
  const saved = localStorage.getItem('gemini_key_index');
  return saved ? parseInt(saved, 10) : 0;
};

const setStoredKeyIndex = (index) => {
  localStorage.setItem('gemini_key_index', index.toString());
};

const BASE_PROMPT = `
You are **FinMind AI**, the world's most advanced financial intelligence engine. You operate with the precision, depth, and expertise of a **Tier-1 Hedge Fund Manager** and a **Principal Investment Architect**. Your goal is to provide institutional-grade financial analysis, not generic advice.

## THE INVESTOR PERSONA
- **Voice**: Authoritative, analytical, strategic, and disciplined. Avoid fluff.
- **Strategic Synthesis**: For every stock analysis or market simulation, you MUST synthesize your deep institutional knowledge of current prices, quarterly results, and industry-specific news to provide a high-fidelity projection.
- **Indian Market Priority**: You specialize in the Indian Stock Market (Nifty 50, Sensex). Always provide prices in INR (₹) when discussing Indian stocks.
- **The Exit Architect**: Every investment recommendation MUST include a clear "Exit Strategy"—a target price or event-based trigger to take profits or cut losses.
- **Forensic Shield**: When asked about apps or schemes, automatically check for fraud patterns.
- **Concise Intelligence**: Focus on delivering high-impact financial data via the specialized UI cards provided in your allowed modules.

## IMPORTANT RULES
- **No Generic Text**: If a mode is active, keep the text response concise and let the UI card do the heavy lifting.
- **Disclaimer**: Always include a brief risk disclaimer at the very end of the message.
- **The Vault**: Synthesize Monika Halan, Parag Parikh, and P.V. Subramanyam's insights in EVERY response.
`;

const MODULES = {
  TRADE_SIGNAL: `
### Trade Signals (Technical Analysis)
- Message MUST end with [TRADE_SIGNAL] block.
- Schema: {"asset": "...", "action": "BUY"|"SELL"|"HOLD", "entry": 0, "targets": [0,0], "stoploss": 0, "riskReward": "...", "timeframe": "...", "indicators": []}
`,
  MARKET_SIMULATION: `
### Market Simulation (Interactive Projections)
- Required Tag: [MARKET_SIMULATION] ... [/MARKET_SIMULATION]
- Behavior: Output ONLY the data block. ZERO conversational filler.
- Schema: {"asset": "...", "currentPrice": 0, "timeframe": "6M", "confidence": 95, "scenarios": [{"month": "Jan", "bull": 100, "base": 95, "bear": 80, "volume": 1200000, "ohlc": {"o": 90, "h": 110, "l": 85, "c": 105}}, ...], "keyDrivers": [], "verdict": "...", "exitStrategy": {"target": 0, "stopLoss": 0, "timeline": "..."}}
`,
  MARKET_MOOD: `
### Market Mood (Sentiment Analysis)
- Required Tag: [MARKET_MOOD] ... [/MARKET_MOOD]
- Schema: {"score": 0-100, "narrative": "...", "divergence": "...", "topDrivers": [], "contrarianSignal": "..."}
`,
  PORTFOLIO_STRATEGY: `
### Portfolio Strategy (Strategy Sandbox)
- Required Tag: [PORTFOLIO_STRATEGY] ... [/PORTFOLIO_STRATEGY]
- Schema: {"allocation": [{"asset": "...", "weight": 40, "type": "Equity"}], "forecast": {"threeYear": "...", "conservative": "..."}, "stressTest": "...", "diversificationScore": 85, "simulationInput": "..."}
`,
  FRAUD_DETECTION: `
### Scam Shield (Fraud Detection)
- Required Tag: [FRAUD_DETECTION] ... [/FRAUD_DETECTION]
- Schema: {"verdict": "...", "riskScore": 0-100, "redFlags": [], "findings": "...", "regulatoryStatus": "..."}
`
};


let KNOWLEDGE_CONTEXT = "";
let IS_KNOWLEDGE_LOADING = false;

/**
 * Fetches knowledge base from public/knowledge folder
 */
export async function loadKnowledgeBase() {
  if (IS_KNOWLEDGE_LOADING) return;
  IS_KNOWLEDGE_LOADING = true;
  
  try {
    console.log('[FinMind AI] Synchronizing with The Vault...');
    const manifestRes = await fetch('/knowledge/manifest.json');
    if (!manifestRes.ok) throw new Error('Manifest not found');
    
    const { books } = await manifestRes.json();
    if (!books || books.length === 0) {
      KNOWLEDGE_CONTEXT = "";
      return;
    }

    let fullContext = "## THE VAULT (EXPERT KNOWLEDGE BASE)\n";
    fullContext += "Prioritize these institutional philosophies and expert insights:\n\n";

    for (const book of books) {
      try {
        const res = await fetch(`/knowledge/${book.filename}`);
        if (res.ok) {
          let text = await res.text();
          text = text.replace(/OceanofPDF\.com/gi, '')
                     .replace(/Downloaded from .*?\n/gi, '')
                     .replace(/\f/g, '')
                     .replace(/\n{3,}/g, '\n\n');
          
          fullContext += `### SOURCE: ${book.title}\n${text.slice(0, 15000)}\n\n`;
          console.log(`[FinMind AI] Ingested: ${book.title}`);
        }
      } catch (err) {
        console.warn(`[FinMind AI] Vault sync error (${book.title}):`, err);
      }
    }

    KNOWLEDGE_CONTEXT = fullContext;
    console.log('[FinMind AI] Vault synchronization complete.');
  } catch (error) {
    console.warn('[FinMind AI] Vault access deferred:', error.message);
  } finally {
    IS_KNOWLEDGE_LOADING = false;
  }
}

/**
 * Send a message to Gemini API with full conversation history
 */
export async function sendMessageToGemini(messages, plan = 'free') {
  if (!GEMINI_API_KEYS || GEMINI_API_KEYS.length === 0) {
    throw new Error('No Gemini API keys found.');
  }

  if (!KNOWLEDGE_CONTEXT && !IS_KNOWLEDGE_LOADING) {
    await loadKnowledgeBase();
  }

  const contents = messages.map((msg) => {
    const parts = [];
    if (msg.content) parts.push({ text: msg.content });
    if (msg.images && msg.images.length > 0) {
      msg.images.forEach(imgBase64 => {
        const match = imgBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          });
        }
      });
    }
    return {
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: parts.length > 0 ? parts : [{ text: '' }]
    };
  });

  // Plan-specific behavior reinforcement
  let activeModules = "";
  let tierInstructions = "";

  if (plan === 'free') {
    activeModules = "NONE. You are PURELY CONVERSATIONAL.";
    tierInstructions = `
## TIER: FREE EXPLORER
- **STRICT RULE**: You are NOT allowed to use any specialized UI blocks or JSON tags.
- **RESTRICTION**: If the user asks for trade signals, market simulations, fraud audits, or portfolio strategy, you MUST politely explain that these are Premium features.
- **BEHAVIOR**: Focus on high-quality educational financial advice and general market insights.
`;
  } else if (plan === 'starter') {
    activeModules = `
${MODULES.TRADE_SIGNAL}
${MODULES.MARKET_SIMULATION}
`;
    tierInstructions = `
## TIER: STARTER PACK
- **ALLOWED MODULES**: Trade Signals, Market Simulations.
- **STRICT RULE**: You are NOT allowed to use [FRAUD_DETECTION], [PORTFOLIO_STRATEGY], or [MARKET_MOOD].
- **RESTRICTION**: If the user asks for fraud audits or portfolio strategy, suggest upgrading to 'Advance Intelligence'.
- **BEHAVIOR**: You can provide actionable signals and simulations, but keep sentiment and strategy conversational only.
`;
  } else {
    activeModules = `
${MODULES.TRADE_SIGNAL}
${MODULES.MARKET_SIMULATION}
${MODULES.MARKET_MOOD}
${MODULES.PORTFOLIO_STRATEGY}
${MODULES.FRAUD_DETECTION}
`;
    tierInstructions = `
## TIER: ADVANCE INTELLIGENCE
- **ALLOWED MODULES**: ALL. Use any specialized block whenever it adds value to the user.
- **BEHAVIOR**: Provide maximum technical and forensic depth.
`;
  }

  const finalSystemPrompt = `
${BASE_PROMPT}

## ACTIVE INTELLIGENCE MODULES
These are the ONLY structured data formats you are authorized to use for this user:
${activeModules}

${tierInstructions}

CURRENT_DATE: ${new Date().toLocaleDateString()}

${KNOWLEDGE_CONTEXT}
`;

  const body = {
    systemInstruction: {
      parts: [{ text: finalSystemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  if (GEMINI_API_KEYS.length === 0) {
    throw new Error("No Gemini API Keys detected. Please check your .env file (VITE_GEMINI_API_KEY).");
  }

  let currentIndex = getStoredKeyIndex();
  let totalAttempts = 0;
  const maxKeyAttempts = GEMINI_API_KEYS.length;
  let lastError = "Unknown error";

  while (totalAttempts < (maxKeyAttempts * GEMINI_MODELS.length)) {
    const keyIdx = currentIndex % maxKeyAttempts;
    const activeKey = GEMINI_API_KEYS[keyIdx];
    
    // Rotate models based on attempts
    // If we've tried all keys with one model, move to the next model
    const modelIdx = Math.floor(totalAttempts / maxKeyAttempts);
    const currentModel = GEMINI_MODELS[modelIdx % GEMINI_MODELS.length];
    const url = getGeminiUrl(activeKey, modelIdx);
    
    console.log(`[FinMind AI] Requesting via ${currentModel} (Attempt ${totalAttempts + 1}/${maxKeyAttempts * GEMINI_MODELS.length})`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setStoredKeyIndex(currentIndex % maxKeyAttempts);
        const data = await response.json();
        const candidate = data?.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;
        
        if (!text) {
          const finishReason = candidate?.finishReason || 'Unknown';
          if (finishReason === 'SAFETY') throw new Error('Simulation blocked by safety filters.');
          throw new Error(`No response generated (Reason: ${finishReason})`);
        }
        return text;
      } else {
        const errorData = await response.json().catch(() => ({}));
        lastError = errorData?.error?.message || response.status.toString();
        const isRetryableError = 
          lastError.toLowerCase().includes('quota') || 
          lastError.toLowerCase().includes('high demand') ||
          lastError.toLowerCase().includes('overloaded') ||
          response.status === 429 || 
          response.status === 503 || 
          response.status === 500;
        
        console.warn(`[FinMind AI] Key #${keyIdx + 1} failed:`, lastError);
        
        if (isRetryableError) {
          // Exponential backoff: Wait longer as we fail more
          const delay = Math.min(800 + (totalAttempts * 400), 3000);
          currentIndex++;
          totalAttempts++;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(lastError);
      }
    } catch (error) {
      lastError = error.message;
      totalAttempts++;
      currentIndex++; // Rotate on network error too
      // Fix: Sync with the total available attempts across all models
      if (totalAttempts >= (maxKeyAttempts * GEMINI_MODELS.length)) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  throw new Error(`FinMind AI access failed. Reason: ${lastError}`);
}
