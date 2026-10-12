import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize GoogleGenAI SDK with server-side API key
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt defining the persona and function-execution guidance
const SYSTEM_INSTRUCTION = `You are BANKO — Your Smart Banking Assistant.
You are an intelligent banking assistant developed as part of the Smart Banking Assistant project by MLRIT students (Vamshi Krishna, Abhiram, Priyanshu).

You help users manage accounts, monitor balances, analyze spending, plan monthly budgets, track savings goals, and calculate loan EMIs.

User details:
- Name: Vamshi Krishna (Email: 25r21a67b5@mlrit.ac.in)
- Savings Account (•••• 4192): ₹45,250.00
- Current Account (•••• 8821): ₹1,20,000.00
- Monthly Income: ₹45,000.00 (Salary credited)
- Total Monthly Spending: ₹18,450.00
- Highest Spending Category: Food (₹6,200.00)
- Active Savings Goal: Emergency Fund (₹32,500 saved of ₹50,000 target - 65%)

When responding:
1. Greet courteously and introduce yourself as BANKO if asked.
2. Provide direct, helpful answers with concrete rupee (₹) figures based on user data.
3. If asked about spending, explain categories clearly (Food ₹6,200, Shopping ₹4,800, Bills ₹3,500, Transport ₹2,100, Other ₹1,850).
4. If asked to calculate EMI, provide the monthly formula and exact EMI breakdown.
5. Keep responses concise, structured, and easy to read (2-4 sentences or short bullet points).`;

// API endpoint for Smart Banking Assistant
app.post('/api/assistant', async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `User request: ${prompt}\n\nCurrent banking context: ${JSON.stringify(context || {})}`,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const reply = response.text || "Hi! I'm BANKO. I've reviewed your accounts. Your total balance is ₹1,65,250 across Savings and Current accounts.";
        res.json({ reply, source: 'gemini' });
        return;
      } catch (err: any) {
        console.warn('Gemini API request failed, falling back to heuristic engine:', err?.message || err);
      }
    }

    // Heuristic fallback engine if API key is unconfigured or rate limited
    const lower = prompt.toLowerCase();
    let fallbackReply = "Hi! I'm BANKO. How can I help you with your banking today? You can ask about your balance, spending, budgets, savings goals, or loan EMI.";

    if (lower.includes('balance') || lower.includes('how much') && lower.includes('have')) {
      fallbackReply = "Your total available balance is ₹1,65,250.00 (Savings Account: ₹45,250.00, Current Account: ₹1,20,000.00).";
    } else if (lower.includes('spend') || lower.includes('spent') || lower.includes('expense')) {
      fallbackReply = "You spent ₹18,450.00 this month. Your highest spending category is Food (₹6,200.00), followed by Shopping (₹4,800.00) and Utility Bills (₹3,500.00).";
    } else if (lower.includes('category') || lower.includes('most')) {
      fallbackReply = "Your highest spending category this month is Food at ₹6,200.00 (33.6% of your total expenses).";
    } else if (lower.includes('saving') || lower.includes('goal')) {
      fallbackReply = "Your Emergency Fund goal has ₹32,500.00 saved toward the ₹50,000.00 target (65% completed). You need ₹17,500.00 more to reach your goal.";
    } else if (lower.includes('transaction') || lower.includes('recent')) {
      fallbackReply = "Your recent transactions include: Salary (+₹45,000.00), Grocery Supermarket (-₹2,500.00), Electricity Bill (-₹1,500.00), and Shopping (-₹3,200.00).";
    } else if (lower.includes('emi') || lower.includes('loan')) {
      fallbackReply = "For an example personal loan of ₹1,00,000 at 10.5% interest for 2 years (24 months), your monthly EMI is approximately ₹4,638.00. Total interest payable will be ₹11,312.00.";
    } else if (lower.includes('budget')) {
      fallbackReply = "Your monthly Food budget is ₹6,000.00 with ₹4,200.00 spent and ₹1,800.00 remaining. You are at 70% of your allocated budget.";
    } else if (lower.includes('transfer') || lower.includes('send')) {
      fallbackReply = "You can initiate a money transfer from the 'Money Transfer' tab. Enter the receiver account number and amount to validate and process.";
    }

    res.json({ reply: fallbackReply, source: 'fallback' });
  } catch (error: any) {
    console.error('Assistant endpoint error:', error);
    res.status(500).json({ error: 'Internal assistant error', details: error?.message });
  }
});

// Setup Vite in middleware mode for dev or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const PORT = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ConSentinel Banking server running on port ${PORT}`);
  });
}

startServer();
