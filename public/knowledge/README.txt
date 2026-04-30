# FinMind AI Knowledge Base

Welcome to 'The Vault'. This directory is where you can 'train' your AI with expert investment books and hedge fund strategies.

### How to use:
1. Place your books as '.txt' files in this folder (e.g., 'hedge_fund_secrets.txt').
2. Open 'manifest.json' in this same folder.
3. Add an entry for your book in the 'books' array.

### Example manifest.json:
{
  "books": [
    {
      "title": "Hedge Fund Market Wizards",
      "filename": "market_wizards.txt"
    },
    {
      "title": "Institutional Investment Principles",
      "filename": "institutional_principles.txt"
    }
  ]
}

### Important:
- Large books (over 500 pages) should be split or summarized for optimal performance.
- The AI will automatically 'read' these books at the start of every session and use them to ground its responses.
- Ensure the 'filename' exactly matches your .txt file.
