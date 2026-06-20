// This file runs on the SERVER, never in the student's browser.
// Uses Google Gemini (free tier) instead of a paid API.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { system, messages, max_tokens } = req.body;
    const userText = (messages && messages[0]) ? messages[0].content : '';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userText }] }],
          systemInstruction: { parts: [{ text: system }] },
          generationConfig: { maxOutputTokens: Math.min(max_tokens || 1000, 1200) }
        })
      }
    );

    const data = await response.json();
    const text = (data.candidates && data.candidates[0])
      ? data.candidates[0].content.parts[0].text
      : '';

    // reshaped so the existing frontend code doesn't need to change
    res.status(response.status).json({ content: [{ type: 'text', text }] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong generating a response.' });
  }
};
