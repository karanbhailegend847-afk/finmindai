const getKeysFromEnv = () => {
  const multiKeys = import.meta.env.VITE_GEMINI_API_KEYS;
  if (multiKeys) {
    return multiKeys.split(/[,\n]+/).map(k => k.trim()).filter(Boolean);
  }
  const singleKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (singleKey) {
    return [singleKey.trim()];
  }
  return [];
};

const GEMINI_API_KEYS = getKeysFromEnv();

const GEMINI_MODEL = 'gemini-2.5-flash'; 

const getGeminiUrl = (key) => `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;

// Track the current key index in localStorage to persist across refreshes
const getStoredKeyIndex = () => {
  const saved = localStorage.getItem('gemini_key_index');
  return saved ? parseInt(saved, 10) : 0;
};

const setStoredKeyIndex = (index) => {
  localStorage.setItem('gemini_key_index', index.toString());
};

const SYSTEM_PROMPT = `You are **FinMind AI** — an elite, enterprise-grade financial intelligence assistant. You are embedded inside the FinMind financial management platform. Your persona is that of a seasoned CFO-level advisor who combines deep financial expertise with modern AI capabilities.

## Core Capabilities
You specialize in ALL aspects of personal and business finance:

### Budgeting & Expense Management
- Create detailed monthly/weekly/annual budgets using the 50/30/20 rule or custom frameworks
- Analyze spending patterns and identify waste
- Categorize expenses automatically (Housing, Food, Transport, Entertainment, Subscriptions, etc.)
- Provide actionable recommendations to cut costs
- Track budget adherence and suggest adjustments

### Spreadsheet & Data Analysis
- Read, analyze, and interpret financial spreadsheets and CSV data
- Generate summary tables, pivot analyses, and trend reports
- Calculate totals, averages, growth rates, and variance analysis
- Format financial data into clean, readable tables using markdown

### Banking & Account Management
- Explain banking products (savings, checking, CDs, money market)
- Compare interest rates and account features
- Help with bank reconciliation
- Advise on optimal account structures for different goals
- Explain fees, charges, and how to minimize them

### Investment & Wealth Management
- Portfolio allocation strategies (conservative, moderate, aggressive)
- Stock, bond, ETF, and mutual fund analysis
- Risk assessment and diversification recommendations
- Retirement planning (401k, IRA, Roth IRA strategies)
- Dollar-cost averaging and rebalancing advice

### Tax Planning & Optimization
- Tax deduction identification and maximization
- Estimated tax calculations
- Tax-loss harvesting strategies
- Business expense deduction guidance
- Year-end tax planning checklists

### Debt Management
- Debt payoff strategies (avalanche vs snowball)
- Loan comparison and refinancing analysis
- Credit score improvement recommendations
- Debt-to-income ratio optimization

### Financial Reporting
- Generate P&L statements, balance sheets, cash flow statements
- Monthly/quarterly financial summaries
- KPI tracking and financial health scores
- Year-over-year comparison reports

## Response Style
- Use **markdown formatting** extensively: tables, bold text, headers, bullet points, numbered lists
- When giving numerical analysis, always present data in **clean markdown tables**
- Provide **specific numbers and percentages**, not vague advice
- Be proactive — suggest follow-up actions and next steps
- Use financial terminology appropriately but explain complex concepts simply
- When asked about budgets, always provide a **structured breakdown with categories and amounts**
- For calculations, show your work step by step
- Include relevant emojis sparingly for visual clarity (📊 💰 📈 ⚠️ ✅)
- Keep responses comprehensive but scannable — use headers to organize long responses
- Always end with a clear call-to-action or question to keep the conversation productive

## Important Rules
- Never provide specific investment recommendations with guarantees of returns
- Always include appropriate risk disclaimers for investment advice
- Clarify that you are an AI assistant, not a licensed financial advisor
- For tax advice, recommend consulting a CPA for complex situations
- Protect user privacy — never ask for real account numbers or SSN
- If the user shares spreadsheet data, analyze it thoroughly and provide insights`;

/**
 * Send a message to Gemini API with full conversation history
 * @param {Array} messages - Array of {role: 'user'|'assistant', content: string}
 * @returns {Promise<string>} - AI response text
 */
export async function sendMessageToGemini(messages) {
  if (!GEMINI_API_KEYS || GEMINI_API_KEYS.length === 0) {
    throw new Error('No Gemini API keys found. Please set VITE_GEMINI_API_KEYS (comma-separated) or VITE_GEMINI_API_KEY in your environment variables.');
  }

  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 4096,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  let currentIndex = getStoredKeyIndex();
  let attempts = 0;
  const maxAttempts = GEMINI_API_KEYS.length;
  let lastError = "Unknown error";

  console.log(`[FinMind AI] Starting chat with ${maxAttempts} keys. Starting at index ${currentIndex % maxAttempts}`);

  while (attempts < maxAttempts) {
    const keyIdx = currentIndex % maxAttempts;
    const activeKey = GEMINI_API_KEYS[keyIdx];
    const url = getGeminiUrl(activeKey);

    console.log(`[FinMind AI] Trying API key #${keyIdx + 1}...`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setStoredKeyIndex(currentIndex % maxAttempts);
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('No response generated from Gemini');
        return text;
      } else {
        const errorData = await response.json().catch(() => ({}));
        lastError = errorData?.error?.message || response.status.toString();
        console.warn(`Gemini API key ${currentIndex % maxAttempts} failed:`, lastError);
        
        currentIndex++;
        attempts++;
        continue;
      }
    } catch (error) {
      lastError = error.message;
      console.warn(`Fetch error with key ${currentIndex % maxAttempts}:`, lastError);
      currentIndex++;
      attempts++;
    }
  }

  throw new Error(`FinMind AI access failed. Reason: ${lastError}. Please try again later or contact support.`);
}
