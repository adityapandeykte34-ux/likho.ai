// This file runs on the SERVER, never in the student's browser.
// Uses Google Gemini (free tier) instead of a paid API.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { system, messages, max_tokens } = req.body;
    const userText = (messages && messages[0]) ? messages[0].content : '';

    if (!userText) {
      return res.status(400).json({ error: 'No content provided.' });
    }

    const geminiRes = await fetch(
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

    const data = await geminiRes.json();

    // Gemini returned an HTTP error (bad key, rate limit, quota, etc.)
    if (!geminiRes.ok) {
      console.error('Gemini API error:', geminiRes.status, JSON.stringify(data));
      const reason = data?.error?.message || 'Unknown Gemini error';
      return res.status(geminiRes.status).json({ error: 'Gemini error: ' + reason });
    }

    const candidate = data.candidates && data.candidates[0];

    // Request succeeded but content was blocked or empty
    if (!candidate || !candidate.content) {
      console.error('Gemini returned no usable candidate:', JSON.stringify(data));
      const blockReason = data?.promptFeedback?.blockReason || candidate?.finishReason || 'empty response';
      return res.status(200).json({
        content: [{ type: 'text', text: `(Couldn't generate this — reason: ${blockReason}. Try shorter or different content.)` }]
      });
    }

    const text = candidate.content.parts.map(p => p.text || '').join('');
    res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
