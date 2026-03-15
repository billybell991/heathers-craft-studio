require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Gemini setup ----------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------- Library Persistence ----------
const DATA_DIR = path.join(__dirname, 'data');
const LIBRARY_PATH = path.join(DATA_DIR, 'library.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadLibrary() {
  try {
    if (fs.existsSync(LIBRARY_PATH)) {
      return JSON.parse(fs.readFileSync(LIBRARY_PATH, 'utf-8'));
    }
  } catch { /* corrupted — start fresh */ }
  return [];
}

function saveLibrary(entries) {
  fs.writeFileSync(LIBRARY_PATH, JSON.stringify(entries, null, 2));
}

let library = loadLibrary();

// ---------- Build the system prompt for pattern generation ----------
function buildPatternPrompt(formData) {
  const {
    craftType = 'crochet',
    projectDescription,
    projectType,
    skillLevel,
    yarns,
    toolSize,
    needleType,
    desiredWidth,
    desiredHeight,
    dimensionUnit,
    specialRequests
  } = formData;

  const isCrochet = craftType === 'crochet';
  const craftName = isCrochet ? 'crochet' : 'knitting';

  const yarnList = yarns.map((y, i) => {
    let desc = `  Yarn ${i + 1}: Color="${y.color}"`;
    if (y.brand) desc += `, Brand="${y.brand}"`;
    desc += `, Weight=${y.weight}`;
    desc += `, Skeins/Balls=${y.quantity}`;
    if (y.yardage) desc += `, Yardage per skein=~${y.yardage} yards`;
    return desc;
  }).join('\n');

  let dimensions = '';
  if (desiredWidth || desiredHeight) {
    dimensions = `\nDesired finished dimensions: ${desiredWidth || '?'} x ${desiredHeight || '?'} ${dimensionUnit || 'inches'}`;
  }

  const toolDesc = isCrochet
    ? `- Crochet Hook Size: ${toolSize}`
    : `- Knitting Needle Size: ${toolSize}\n- Needle Type: ${needleType || 'Straight Needles'}`;

  const toolMaterial = isCrochet
    ? `- ${toolSize} crochet hook`
    : `- ${toolSize} ${needleType || 'straight'} knitting needles`;

  const abbreviations = isCrochet
    ? `- ch = chain
- sc = single crochet
- dc = double crochet
- [etc — include every abbreviation used]`
    : `- k = knit
- p = purl
- CO = cast on
- BO = bind off
- [etc — include every abbreviation used]`;

  const instructionFormat = isCrochet
    ? `**Row/Round N:** [Exact stitch instructions] — [stitch count at end of row]`
    : `**Row/Round N:** [Exact stitch instructions] — [stitch count at end of row]`;

  return `You are an expert ${craftName} pattern designer with decades of experience writing professional, publication-quality ${craftName} patterns. A crafter has requested a custom pattern. Generate a COMPLETE, DETAILED ${craftName} pattern based on their specifications.

PROJECT REQUEST:
- Description: "${projectDescription}"
- Project Type: ${projectType}
- Skill Level: ${skillLevel}
${toolDesc}${dimensions}

YARN INVENTORY:
${yarnList}

${specialRequests ? `SPECIAL REQUESTS: ${specialRequests}` : ''}

IMPORTANT RULES:
1. The pattern MUST only use the yarn colors and quantities provided. If the requested project would require more yarn than available, note this clearly and adjust the pattern to fit what they have.
2. Tailor complexity to the stated skill level.
3. Be extremely specific — every single row/round must have explicit stitch-by-stitch instructions and stitch counts.

Generate the pattern in this EXACT format:

# [Creative Pattern Name]
## By Heather's Craft Studio

### Overview
[Brief description of the finished item, including approximate dimensions]

### Skill Level
${skillLevel}

### Materials Needed
- [List each yarn with color, weight, and estimated yardage needed]
${toolMaterial}
- [Any other tools: tapestry needle, stitch markers, etc.]

### Abbreviations
[List ALL abbreviations used in the pattern with full names]
${abbreviations}

### Gauge
[Specify gauge swatch dimensions]

### Notes Before You Begin
[Any important tips, techniques to know, or setup instructions]

### Pattern Instructions

[DETAILED step-by-step instructions. For each row/round:]
${instructionFormat}

[Include color change instructions inline where needed]
[Include increases, decreases, and shaping details]
${isCrochet ? '[For amigurumi/3D items, include assembly instructions]' : '[For garments, include separate pieces and seaming instructions]'}

### Color Change Guide
[If multiple colors are used, provide a clear summary of when to switch colors]

### Finishing
[Weaving in ends, blocking instructions, any final assembly]

### Tips & Variations
[Optional modifications, size adjustments, or creative variations]

---
Make the pattern warm, encouraging, and fun to read — like advice from a friend at a yarn shop. Use a friendly tone throughout.`;
}

// ---------- Build the image prompt ----------
function buildImagePrompt(formData) {
  const { craftType = 'crochet', projectDescription, projectType, yarns, specialRequests } = formData;

  const colorList = yarns.map(y => y.color).join(', ');
  const craftWord = craftType === 'crochet' ? 'crocheted' : 'hand-knitted';
  const textureDesc = craftType === 'crochet'
    ? 'You should be able to see the individual crochet stitches and texture of the yarn clearly.'
    : 'You should be able to see the individual knit stitches, cable textures, and yarn texture clearly.';

  return `Create a beautiful, realistic photograph of a finished ${craftWord} ${projectType}: "${projectDescription}". 

The item is made with yarn in these colors: ${colorList}. 

Show the ${craftWord} item styled in a cozy, warm setting — perhaps on a wooden table, draped over a chair, or held in someone's hands. The lighting should be warm and natural, like a craft room or living room. ${textureDesc}

${specialRequests ? `Additional details: ${specialRequests}` : ''}

Style: Warm, inviting lifestyle photography. The image should make someone excited to start ${craftType === 'crochet' ? 'crocheting' : 'knitting'} this project. Show realistic yarn texture with visible stitch definition.`;
}

// ---------- API: Generate Pattern ----------
app.post('/api/generate-pattern', async (req, res) => {
  try {
    const formData = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      return res.status(500).json({ error: 'Gemini API key not configured. Please add your key to the .env file.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = buildPatternPrompt(formData);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const pattern = response.text();

    res.json({ pattern });
  } catch (err) {
    console.error('Pattern generation error:', err);
    res.status(500).json({ error: 'Failed to generate pattern. ' + err.message });
  }
});

// ---------- Image Generation (BellForge-proven 3-tier fallback) ----------
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const IMAGE_MODELS = [
  { id: 'imagen-4.0-generate-001', type: 'predict', name: 'Imagen 4.0' },
  { id: 'imagen-4.0-fast-generate-001', type: 'predict', name: 'Imagen 4.0 Fast' },
  { id: 'gemini-2.5-flash-image', type: 'generateContent', name: 'Gemini Flash Image' },
];

const exhaustedModels = new Set();

async function tryImagenPredict(model, prompt, apiKey) {
  const url = `${API_BASE}/models/${model.id}:predict?key=${apiKey}`;
  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 90000);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: '1:1' },
        }),
      });
      clearTimeout(timer);

      if (res.status === 429) {
        const body = await res.text();
        if (body.includes('RESOURCE_EXHAUSTED') || body.includes('quota')) return 'QUOTA_EXHAUSTED';
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 4000 * Math.pow(2, attempt)));
          continue;
        }
        return null;
      }
      if (!res.ok) { console.error(`[${model.name}] HTTP ${res.status}`); return null; }

      const data = await res.json();
      if (data.predictions?.[0]?.bytesBase64Encoded) return data.predictions[0].bytesBase64Encoded;
      return null;
    } catch (err) {
      console.error(`[${model.name}] Error:`, err.message);
      if (attempt < MAX_RETRIES) { await new Promise(r => setTimeout(r, 3000 * Math.pow(2, attempt))); continue; }
      return null;
    }
  }
  return null;
}

async function tryGeminiImage(model, prompt, apiKey) {
  const url = `${API_BASE}/models/${model.id}:generateContent?key=${apiKey}`;
  const MAX_RETRIES = 4;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 90000);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate an image: square 1:1 composition, ${prompt}` }] }],
          generationConfig: { responseModalities: ['IMAGE'] },
        }),
      });
      clearTimeout(timer);

      if (res.status === 429) {
        const body = await res.text();
        if (body.includes('RESOURCE_EXHAUSTED') || body.includes('quota')) return 'QUOTA_EXHAUSTED';
        if (attempt < MAX_RETRIES) { await new Promise(r => setTimeout(r, 5000 * Math.pow(2, attempt))); continue; }
        return null;
      }
      if (!res.ok) { console.error(`[${model.name}] HTTP ${res.status}`); return null; }

      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) return part.inlineData.data;
      }
      return null;
    } catch (err) {
      console.error(`[${model.name}] Error:`, err.message);
      if (attempt < MAX_RETRIES) { await new Promise(r => setTimeout(r, 5000 * Math.pow(2, attempt))); continue; }
      return null;
    }
  }
  return null;
}

async function generateImageMultiTier(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  for (const model of IMAGE_MODELS) {
    if (exhaustedModels.has(model.id)) continue;
    console.log(`[ImageGen] Trying ${model.name}...`);
    const result = model.type === 'predict'
      ? await tryImagenPredict(model, prompt, apiKey)
      : await tryGeminiImage(model, prompt, apiKey);

    if (result === 'QUOTA_EXHAUSTED') {
      exhaustedModels.add(model.id);
      console.warn(`[ImageGen] ${model.name} quota exhausted, trying next...`);
      continue;
    }
    if (result) {
      console.log(`[ImageGen] Success via ${model.name}`);
      return result;
    }
    console.warn(`[ImageGen] ${model.name} failed, trying next...`);
  }
  return null;
}

// ---------- API: Generate Preview Image ----------
app.post('/api/generate-image', async (req, res) => {
  try {
    const formData = req.body;
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      return res.status(500).json({ error: 'Gemini API key not configured.' });
    }

    const prompt = buildImagePrompt(formData);
    const base64 = await generateImageMultiTier(prompt);

    if (base64) {
      return res.json({ image: base64, mimeType: 'image/png' });
    }
    res.status(500).json({ error: 'No image was generated. All models exhausted — try again later.' });
  } catch (err) {
    console.error('Image generation error:', err);
    res.status(500).json({ error: 'Failed to generate preview image. ' + err.message });
  }
});

// ---------- Library API Endpoints ----------

// List all saved patterns
app.get('/api/library', (req, res) => {
  res.json({ entries: library });
});

// Save a pattern to library
app.post('/api/library', (req, res) => {
  const { name, craftType, projectType, skillLevel, pattern, image, formData } = req.body;

  const entry = {
    id: crypto.randomUUID(),
    name: name || 'Untitled Pattern',
    craftType: craftType || 'crochet',
    projectType: projectType || 'other',
    skillLevel: skillLevel || 'intermediate',
    pattern,
    image: image || null,
    formData: formData || null,
    rating: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  };

  library.push(entry);
  saveLibrary(library);
  res.json({ entry });
});

// Update a library entry (name, rating, notes, pattern)
app.patch('/api/library/:id', (req, res) => {
  const entry = library.find(e => e.id === req.params.id);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });

  if (req.body.name !== undefined) entry.name = String(req.body.name).slice(0, 150);
  if (req.body.rating !== undefined) {
    const r = Number(req.body.rating);
    if (r >= 0 && r <= 5) entry.rating = r;
  }
  if (req.body.notes !== undefined) entry.notes = String(req.body.notes).slice(0, 5000);
  if (req.body.pattern !== undefined) {
    entry.pattern = req.body.pattern;
    entry.modifiedAt = new Date().toISOString();
  }

  saveLibrary(library);
  res.json({ entry });
});

// Delete a library entry
app.delete('/api/library/:id', (req, res) => {
  const idx = library.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Entry not found' });
  library.splice(idx, 1);
  saveLibrary(library);
  res.json({ success: true });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`\n🧶 Heather's Craft Studio is running!`);
  console.log(`   Open http://localhost:${PORT} in your browser\n`);
});
