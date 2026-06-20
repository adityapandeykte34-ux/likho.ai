// This file runs on the SERVER, never in the student's browser.
// That's what keeps your Anthropic API key secret and safe.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { system, messages, max_tokens } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // pulled from Vercel's secret settings, never from the frontend
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',       // hardcoded here on purpose — never trust the browser to pick the model
        max_tokens: Math.min(max_tokens || 1000, 1200), // cap it so one request can't run up a huge bill
        system,
        messages
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong generating a response.' });
  }
};
