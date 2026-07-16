// api/tts.js
export default async function handler(req, res) {
  const { text, lang = 'id' } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Parameter text diperlukan' });
  }

  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}`;
    const response = await fetch(ttsUrl);

    if (!response.ok) throw new Error('Gagal mengambil TTS');

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // Stream langsung ke response
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err) {
    res.status(500).json({ error: 'TTS gagal', detail: err.message });
  }
}
