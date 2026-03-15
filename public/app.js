// =============================================
//  HEATHER'S CRAFT STUDIO — Frontend Logic
// =============================================

// ---- Craft type config ----
let currentCraft = 'crochet';

const CROCHET_HOOKS = [
  '2.0mm (B/1)', '2.25mm (B/1)', '2.75mm (C/2)', '3.25mm (D/3)',
  '3.5mm (E/4)', '3.75mm (F/5)', '4.0mm (G/6)', '4.5mm (7)',
  '5.0mm (H/8)', '5.5mm (I/9)', '6.0mm (J/10)', '6.5mm (K/10.5)',
  '8.0mm (L/11)', '9.0mm (M/13)', '10.0mm (N/15)', '11.5mm (P/16)', '15.0mm (Q)'
];

const KNITTING_NEEDLE_SIZES = [
  '2.0mm (US 0)', '2.25mm (US 1)', '2.75mm (US 2)', '3.0mm (US 2.5)',
  '3.25mm (US 3)', '3.5mm (US 4)', '3.75mm (US 5)', '4.0mm (US 6)',
  '4.5mm (US 7)', '5.0mm (US 8)', '5.5mm (US 9)', '6.0mm (US 10)',
  '6.5mm (US 10.5)', '8.0mm (US 11)', '9.0mm (US 13)', '10.0mm (US 15)',
  '12.75mm (US 17)', '15.0mm (US 19)', '19.0mm (US 35)', '25.0mm (US 50)'
];

const KNITTING_NEEDLE_TYPES = [
  'Straight Needles', 'Circular Needles', 'Double-Pointed Needles (DPNs)',
  'Interchangeable Circular Needles', 'Not sure — recommend for me!'
];

const CROCHET_PROJECT_TYPES = [
  { value: '', label: 'Choose one...' },
  { value: 'blanket', label: 'Blanket / Afghan' },
  { value: 'scarf', label: 'Scarf / Cowl' },
  { value: 'hat', label: 'Hat / Beanie' },
  { value: 'sweater', label: 'Sweater / Cardigan' },
  { value: 'shawl', label: 'Shawl / Wrap' },
  { value: 'amigurumi', label: 'Amigurumi (Stuffed Toy)' },
  { value: 'bag', label: 'Bag / Tote' },
  { value: 'socks', label: 'Socks / Slippers' },
  { value: 'mittens', label: 'Mittens / Gloves' },
  { value: 'top', label: 'Top / Shirt' },
  { value: 'dress', label: 'Dress / Skirt' },
  { value: 'home decor', label: 'Home Decor (Pillow, Coaster, etc.)' },
  { value: 'baby item', label: 'Baby Item (Booties, Bib, etc.)' },
  { value: 'granny square', label: 'Granny Square Project' },
  { value: 'doily', label: 'Doily / Table Runner' },
  { value: 'accessory', label: 'Accessory (Headband, Earrings, etc.)' },
  { value: 'other', label: 'Other' },
];

const KNITTING_PROJECT_TYPES = [
  { value: '', label: 'Choose one...' },
  { value: 'blanket', label: 'Blanket / Afghan / Throw' },
  { value: 'scarf', label: 'Scarf / Cowl' },
  { value: 'hat', label: 'Hat / Beanie' },
  { value: 'sweater', label: 'Sweater / Pullover / Cardigan' },
  { value: 'shawl', label: 'Shawl / Wrap / Stole' },
  { value: 'socks', label: 'Socks' },
  { value: 'mittens', label: 'Mittens / Gloves / Fingerless Gloves' },
  { value: 'vest', label: 'Vest' },
  { value: 'top', label: 'Top / Tank' },
  { value: 'dress', label: 'Dress / Skirt' },
  { value: 'baby item', label: 'Baby Item (Booties, Blanket, etc.)' },
  { value: 'home decor', label: 'Home Decor (Pillow, Dishcloth, etc.)' },
  { value: 'bag', label: 'Bag / Tote' },
  { value: 'accessory', label: 'Accessory (Headband, Ear Warmer, etc.)' },
  { value: 'toy', label: 'Knitted Toy / Stuffy' },
  { value: 'cable project', label: 'Cable Knit Project' },
  { value: 'lace project', label: 'Lace Knitting Project' },
  { value: 'other', label: 'Other' },
];

function renderToolSection(craft) {
  const section = document.getElementById('toolSection');
  if (craft === 'crochet') {
    const hookOptions = CROCHET_HOOKS.map(h =>
      `<option value="${h}"${h.includes('5.0mm') ? ' selected' : ''}>${h}</option>`
    ).join('');
    section.innerHTML = `
      <div class="form-group">
        <label for="toolSize">Crochet Hook Size</label>
        <select id="toolSize" required>
          ${hookOptions}
          <option value="not sure - please recommend">Not sure \u2014 recommend one!</option>
        </select>
      </div>
    `;
  } else {
    const sizeOptions = KNITTING_NEEDLE_SIZES.map(s =>
      `<option value="${s}"${s.includes('5.0mm') ? ' selected' : ''}>${s}</option>`
    ).join('');
    const typeOptions = KNITTING_NEEDLE_TYPES.map(t =>
      `<option value="${t}"${t.includes('Straight') ? ' selected' : ''}>${t}</option>`
    ).join('');
    section.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label for="toolSize">Needle Size</label>
          <select id="toolSize" required>
            ${sizeOptions}
            <option value="not sure - please recommend">Not sure \u2014 recommend one!</option>
          </select>
        </div>
        <div class="form-group">
          <label for="needleType">Needle Type</label>
          <select id="needleType" required>
            ${typeOptions}
          </select>
        </div>
      </div>
    `;
  }
}

function renderProjectTypes(craft) {
  const select = document.getElementById('projectType');
  const types = craft === 'crochet' ? CROCHET_PROJECT_TYPES : KNITTING_PROJECT_TYPES;
  select.innerHTML = types.map(t => `<option value="${t.value}">${t.label}</option>`).join('');
}

function switchCraft(craft) {
  currentCraft = craft;
  document.getElementById('craftType').value = craft;

  // Toggle active button
  document.querySelectorAll('.craft-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.craft === craft);
  });

  // Update tool section
  renderToolSection(craft);

  // Update project types
  renderProjectTypes(craft);

  // Update placeholder text
  const desc = document.getElementById('projectDescription');
  if (craft === 'crochet') {
    desc.placeholder = 'e.g., A cozy baby blanket with a star pattern, a cute amigurumi fox, a lacy summer top...';
  } else {
    desc.placeholder = 'e.g., A chunky cable-knit scarf, a Fair Isle sweater, cozy ribbed socks...';
  }
}

// ---- Yarn entry template ----
let yarnCounter = 0;

const YARN_WEIGHTS = [
  'Lace (0)',
  'Super Fine / Fingering (1)',
  'Fine / Sport (2)',
  'Light / DK (3)',
  'Medium / Worsted (4)',
  'Bulky (5)',
  'Super Bulky (6)',
  'Jumbo (7)'
];

const COMMON_COLORS = [
  'White', 'Cream', 'Ivory', 'Black', 'Gray', 'Charcoal',
  'Baby Pink', 'Dusty Rose', 'Hot Pink', 'Red', 'Burgundy', 'Coral',
  'Peach', 'Orange', 'Rust', 'Mustard', 'Yellow', 'Gold',
  'Sage Green', 'Mint', 'Forest Green', 'Olive', 'Teal',
  'Baby Blue', 'Sky Blue', 'Navy', 'Royal Blue',
  'Lavender', 'Purple', 'Plum', 'Mauve',
  'Tan', 'Taupe', 'Brown', 'Chocolate',
  'Variegated / Multi'
];

function createYarnEntry() {
  yarnCounter++;
  const div = document.createElement('div');
  div.className = 'yarn-entry';
  div.dataset.yarnId = yarnCounter;

  const colorOptions = COMMON_COLORS.map(c => `<option value="${c}">${c}</option>`).join('');
  const weightOptions = YARN_WEIGHTS.map(w => `<option value="${w}"${w.includes('Worsted') ? ' selected' : ''}>${w}</option>`).join('');

  div.innerHTML = `
    <div class="yarn-entry-header">
      <span class="yarn-entry-label">🧶 Yarn #${yarnCounter}</span>
      <button type="button" class="btn-remove-yarn" title="Remove this yarn" onclick="removeYarn(this)">✕</button>
    </div>
    <div class="yarn-fields">
      <div>
        <select class="yarn-color" required>
          <option value="">Color...</option>
          ${colorOptions}
          <option value="custom">Other (type below)</option>
        </select>
      </div>
      <input type="text" class="yarn-color-custom" placeholder="Custom color" style="display:none;">
      <input type="text" class="yarn-brand" placeholder="Brand (optional)">
      <select class="yarn-weight" required>
        ${weightOptions}
      </select>
      <input type="number" class="yarn-quantity" placeholder="# of skeins" min="1" value="1" required>
      <input type="number" class="yarn-yardage" placeholder="Yards per skein (optional)" min="1">
    </div>
  `;

  // Handle "Other" color choice
  const colorSelect = div.querySelector('.yarn-color');
  const customInput = div.querySelector('.yarn-color-custom');
  colorSelect.addEventListener('change', () => {
    if (colorSelect.value === 'custom') {
      customInput.style.display = '';
      customInput.required = true;
      customInput.focus();
    } else {
      customInput.style.display = 'none';
      customInput.required = false;
      customInput.value = '';
    }
  });

  return div;
}

function removeYarn(btn) {
  const entry = btn.closest('.yarn-entry');
  const list = document.getElementById('yarnList');
  if (list.children.length <= 1) return; // keep at least one
  entry.style.animation = 'slideIn 0.2s ease reverse';
  setTimeout(() => entry.remove(), 200);
}

function collectYarns() {
  const entries = document.querySelectorAll('.yarn-entry');
  return Array.from(entries).map(entry => {
    const colorSelect = entry.querySelector('.yarn-color');
    const customColor = entry.querySelector('.yarn-color-custom');
    let color = colorSelect.value;
    if (color === 'custom') color = customColor.value;

    return {
      color,
      brand: entry.querySelector('.yarn-brand').value.trim(),
      weight: entry.querySelector('.yarn-weight').value,
      quantity: parseInt(entry.querySelector('.yarn-quantity').value) || 1,
      yardage: entry.querySelector('.yarn-yardage').value.trim() || null
    };
  });
}

// ---- Simple markdown-to-HTML ----
function renderMarkdown(md) {
  let html = md
    // Headings
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // HR
    .replace(/^---+$/gm, '<hr>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Paragraphs — wrap lines that aren't already tags
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<')) return line;
    return `<p>${line}</p>`;
  }).join('\n');

  return html;
}

// ---- Error toast ----
let toastTimeout;
function showError(message) {
  let toast = document.querySelector('.error-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'error-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => toast.classList.add('visible'));
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 5000);
}

// ---- Progress step animation ----
function startProgressTracker(trackerId, intervalMs) {
  const tracker = document.getElementById(trackerId);
  if (!tracker) return null;
  const steps = tracker.querySelectorAll('.progress-step');
  let currentStep = 0;

  // Reset all steps
  steps.forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i === 0) s.classList.add('active');
  });

  const timer = setInterval(() => {
    if (currentStep < steps.length - 1) {
      steps[currentStep].classList.remove('active');
      steps[currentStep].classList.add('done');
      currentStep++;
      steps[currentStep].classList.add('active');
    } else {
      // Stay on last step (active + spinning) until complete
      clearInterval(timer);
    }
  }, intervalMs);

  return {
    timer,
    complete() {
      clearInterval(timer);
      steps.forEach(s => { s.classList.remove('active'); s.classList.add('done'); });
    }
  };
}

// ---- Main form submission ----
async function handleSubmit(e) {
  e.preventDefault();

  const formData = {
    craftType: document.getElementById('craftType').value,
    projectDescription: document.getElementById('projectDescription').value.trim(),
    projectType: document.getElementById('projectType').value,
    skillLevel: document.getElementById('skillLevel').value,
    toolSize: document.getElementById('toolSize').value,
    needleType: document.getElementById('needleType')?.value || null,
    yarns: collectYarns(),
    desiredWidth: document.getElementById('desiredWidth').value.trim(),
    desiredHeight: document.getElementById('desiredHeight').value.trim(),
    dimensionUnit: document.getElementById('dimensionUnit').value,
    specialRequests: document.getElementById('specialRequests').value.trim()
  };

  // Validate at least one yarn has a color
  if (!formData.yarns.length || !formData.yarns[0].color) {
    showError('Please add at least one yarn with a color!');
    return;
  }

  // Show results section, hide form submit
  const btn = document.getElementById('generateBtn');
  const btnText = btn.querySelector('.btn-text');
  const btnLoading = btn.querySelector('.btn-loading');
  btn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = '';

  const resultsSection = document.getElementById('resultsSection');
  resultsSection.style.display = '';

  // Reset results
  document.getElementById('previewLoading').style.display = '';
  document.getElementById('previewImageWrap').style.display = 'none';
  document.getElementById('patternLoading').style.display = '';
  document.getElementById('patternContent').style.display = 'none';
  document.getElementById('resultActions').style.display = 'none';

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Start progress step animations
  // Pattern has 5 steps, image gen takes ~20-40s so space steps out
  const patternProgress = startProgressTracker('patternProgressTracker', 6000);
  const imageProgress = startProgressTracker('imageProgressTracker', 8000);

  // Fire both requests in parallel
  const patternDone = fetch('/api/generate-pattern', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
    .then(res => res.json())
    .then(data => {
      if (patternProgress) patternProgress.complete();
      document.getElementById('patternLoading').style.display = 'none';
      if (data.error) {
        showError(data.error);
        return;
      }
      const content = document.getElementById('patternContent');
      content.innerHTML = renderMarkdown(data.pattern);
      content.style.display = '';
      document.getElementById('resultActions').style.display = '';
      window._lastPatternText = data.pattern;
      window._lastFormData = formData;
    })
    .catch(err => {
      if (patternProgress) patternProgress.complete();
      document.getElementById('patternLoading').style.display = 'none';
      showError('Failed to generate pattern: ' + err.message);
    })
    .finally(() => {
      btn.disabled = false;
      btnText.style.display = '';
      btnLoading.style.display = 'none';
    });

  const imageDone = fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
    .then(res => res.json())
    .then(data => {
      if (imageProgress) imageProgress.complete();
      document.getElementById('previewLoading').style.display = 'none';
      if (data.error) {
        document.getElementById('previewContainer').style.display = 'none';
        return;
      }
      const img = document.getElementById('previewImage');
      img.src = `data:${data.mimeType};base64,${data.image}`;
      document.getElementById('previewImageWrap').style.display = '';
      window._lastImageBase64 = data.image;
    })
    .catch(() => {
      if (imageProgress) imageProgress.complete();
      document.getElementById('previewLoading').style.display = 'none';
      document.getElementById('previewContainer').style.display = 'none';
    });

  // Auto-save to library once both pattern and image are done
  Promise.allSettled([patternDone, imageDone]).then(() => {
    if (window._lastPatternText) {
      saveToLibrary();
    }
  });
}

// ---- Theme System ----
const THEMES = [
  { id: 'lavender',    label: '💜 Lavender Fields',   colors: ['#F8F0FF', '#B088C4', '#8B5CA0', '#9B8EC4'] },
  { id: 'cottage',     label: '🌸 Cottage Rose',      colors: ['#FFF5F5', '#D4A0A0', '#B07878', '#E8C8C8'] },
  { id: 'mossy',       label: '🌿 Mossy Garden',      colors: ['#F0F8F0', '#7FA87A', '#5C805A', '#A8C4A0'] },
  { id: 'honeycomb',   label: '🍯 Honeycomb',         colors: ['#FFFDF0', '#D4A843', '#B8860B', '#E8D088'] },
  { id: 'bluebell',    label: '🔵 Bluebell Meadow',   colors: ['#F0F4FF', '#7B9BC4', '#5A78A0', '#A0B8D8'] },
];

const THEME_VARS = {
  lavender: {
    '--cream':'#F8F0FF','--warm-white':'#FDFAFF','--linen':'#E8D8F0',
    '--dusty-rose':'#B088C4','--rose-dark':'#8B5CA0','--sage':'#9B8EC4','--sage-dark':'#7B6AA8',
    '--warm-brown':'#6E5580','--dark-brown':'#3D2952','--text':'#3A2848','--text-light':'#6B5A7A',
  },
  cottage: {
    '--cream':'#FFF5F5','--warm-white':'#FFFAFA','--linen':'#F0DCD8',
    '--dusty-rose':'#D4A0A0','--rose-dark':'#B07878','--sage':'#C4A0A0','--sage-dark':'#9A7070',
    '--warm-brown':'#8B6F5E','--dark-brown':'#5C3D33','--text':'#4A3228','--text-light':'#7A5545',
  },
  mossy: {
    '--cream':'#F0F8F0','--warm-white':'#F8FDF8','--linen':'#D0E0D0',
    '--dusty-rose':'#7FA87A','--rose-dark':'#5C805A','--sage':'#8BB888','--sage-dark':'#5E8A5A',
    '--warm-brown':'#4A6648','--dark-brown':'#2A3E28','--text':'#283A26','--text-light':'#5A7A55',
  },
  honeycomb: {
    '--cream':'#FFFDF0','--warm-white':'#FFFEF8','--linen':'#F0E4C8',
    '--dusty-rose':'#D4A843','--rose-dark':'#B8860B','--sage':'#C8B060','--sage-dark':'#A08830',
    '--warm-brown':'#806820','--dark-brown':'#4A3C10','--text':'#3A3010','--text-light':'#7A6830',
  },
  bluebell: {
    '--cream':'#F0F4FF','--warm-white':'#F8FAFF','--linen':'#D0D8F0',
    '--dusty-rose':'#7B9BC4','--rose-dark':'#5A78A0','--sage':'#8898C4','--sage-dark':'#6070A0',
    '--warm-brown':'#4A5880','--dark-brown':'#2A3452','--text':'#283248','--text-light':'#5A6A8A',
  },
};

function applyTheme(themeId) {
  const vars = THEME_VARS[themeId];
  if (!vars) return;
  const root = document.documentElement;
  for (const [prop, val] of Object.entries(vars)) {
    root.style.setProperty(prop, val);
  }
  localStorage.setItem('craft-studio-theme', themeId);

  // Update active state in popup
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === themeId);
  });
}

function renderThemePopup() {
  const popup = document.getElementById('themePopup');
  popup.innerHTML = THEMES.map(t => `
    <button class="theme-option${t.id === (localStorage.getItem('craft-studio-theme') || 'lavender') ? ' active' : ''}" data-theme="${t.id}">
      <div class="theme-swatch">
        ${t.colors.map(c => `<span style="background:${c}"></span>`).join('')}
      </div>
      ${t.label}
    </button>
  `).join('');

  popup.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      popup.style.display = 'none';
    });
  });
}

// ---- Library System ----
let libraryEntries = [];

async function fetchLibrary() {
  try {
    const res = await fetch('/api/library');
    const data = await res.json();
    libraryEntries = data.entries || [];
    updateLibraryCount();
  } catch { /* server may be starting up */ }
}

function updateLibraryCount() {
  const el = document.getElementById('libraryCount');
  if (el) el.textContent = libraryEntries.length;
}

async function saveToLibrary() {
  if (!window._lastPatternText) {
    showError('No pattern to save yet!');
    return;
  }

  const formData = window._lastFormData || {};
  const patternTitle = (window._lastPatternText.match(/^# (.+)$/m) || [])[1] || 'Untitled Pattern';

  const body = {
    name: patternTitle,
    craftType: formData.craftType || 'crochet',
    projectType: formData.projectType || 'other',
    skillLevel: formData.skillLevel || 'intermediate',
    pattern: window._lastPatternText,
    image: window._lastImageBase64 || null,
    formData,
  };

  try {
    const res = await fetch('/api/library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.entry) {
      libraryEntries.push(data.entry);
      updateLibraryCount();
      const btn = document.getElementById('saveBtn');
      const orig = btn.textContent;
      btn.textContent = '✅ Saved!';
      setTimeout(() => btn.textContent = orig, 2500);
    }
  } catch (err) {
    showError('Failed to save: ' + err.message);
  }
}

function showLibrary() {
  document.getElementById('formSection').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('librarySection').style.display = '';
  renderLibraryList();
}

function hideLibrary() {
  document.getElementById('librarySection').style.display = 'none';
  document.getElementById('formSection').style.display = '';
}

function renderLibraryList() {
  const listEl = document.getElementById('libraryList');
  const emptyEl = document.getElementById('libraryEmpty');

  if (libraryEntries.length === 0) {
    listEl.style.display = 'none';
    emptyEl.style.display = '';
    return;
  }

  listEl.style.display = '';
  emptyEl.style.display = 'none';

  // Sort newest first
  const sorted = [...libraryEntries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  listEl.innerHTML = sorted.map(entry => {
    const craftIcon = entry.craftType === 'knitting' ? '🧶' : '🧶';
    const craftLabel = entry.craftType === 'knitting' ? 'Knitting' : 'Crochet';
    const date = new Date(entry.createdAt).toLocaleDateString();
    const modified = entry.modifiedAt && entry.modifiedAt !== entry.createdAt
      ? ` · Edited ${new Date(entry.modifiedAt).toLocaleDateString()}` : '';
    const stars = [1,2,3,4,5].map(s =>
      `<span class="library-star${s <= entry.rating ? ' filled' : ''}" data-id="${entry.id}" data-star="${s}">★</span>`
    ).join('');

    return `
      <div class="library-entry" data-id="${entry.id}">
        ${entry.image ? `<div class="library-thumb"><img src="data:image/png;base64,${entry.image}" alt="${entry.name}" loading="lazy"></div>` : ''}
        <div class="library-entry-body">
          <div class="library-entry-header">
            <h3 class="library-entry-name" data-id="${entry.id}" title="Click to rename">${entry.name}</h3>
            <span class="library-badge">${craftIcon} ${craftLabel}</span>
            <span class="library-badge">${entry.projectType || ''}</span>
          </div>
          <div class="library-entry-meta">
            <span>📅 ${date}${modified}</span>
            <span>🎯 ${entry.skillLevel || 'intermediate'}</span>
          </div>
          <div class="library-stars">${stars}</div>
          <div class="library-entry-actions">
            <button class="lib-action-btn lib-view-btn" data-id="${entry.id}" title="View pattern">📖 View</button>
            <button class="lib-action-btn lib-edit-btn" data-id="${entry.id}" title="Edit pattern">✏️ Edit</button>
            <button class="lib-action-btn lib-print-btn" data-id="${entry.id}" title="Print pattern">🖨️ Print</button>
            <button class="lib-action-btn lib-delete-btn" data-id="${entry.id}" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Wire up event handlers
  listEl.querySelectorAll('.library-star').forEach(star => {
    star.addEventListener('click', async () => {
      const id = star.dataset.id;
      const rating = parseInt(star.dataset.star);
      const entry = libraryEntries.find(e => e.id === id);
      const newRating = entry.rating === rating ? 0 : rating;
      await fetch(`/api/library/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating }),
      });
      entry.rating = newRating;
      renderLibraryList();
    });
  });

  listEl.querySelectorAll('.library-entry-name').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const entry = libraryEntries.find(e => e.id === id);
      const newName = prompt('Rename pattern:', entry.name);
      if (newName && newName.trim()) {
        fetch(`/api/library/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName.trim() }),
        }).then(() => {
          entry.name = newName.trim();
          renderLibraryList();
        });
      }
    });
  });

  listEl.querySelectorAll('.lib-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const entry = libraryEntries.find(e => e.id === btn.dataset.id);
      if (!entry) return;
      showLibraryPattern(entry, false);
    });
  });

  listEl.querySelectorAll('.lib-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const entry = libraryEntries.find(e => e.id === btn.dataset.id);
      if (!entry) return;
      showLibraryPattern(entry, true);
    });
  });

  listEl.querySelectorAll('.lib-print-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const entry = libraryEntries.find(e => e.id === btn.dataset.id);
      if (!entry) return;
      showLibraryPattern(entry, false);
      setTimeout(() => window.print(), 300);
    });
  });

  listEl.querySelectorAll('.lib-delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this pattern?')) return;
      const id = btn.dataset.id;
      await fetch(`/api/library/${id}`, { method: 'DELETE' });
      libraryEntries = libraryEntries.filter(e => e.id !== id);
      updateLibraryCount();
      renderLibraryList();
    });
  });
}

function showLibraryPattern(entry, editable) {
  document.getElementById('librarySection').style.display = 'none';
  document.getElementById('formSection').style.display = 'none';

  const resultsSection = document.getElementById('resultsSection');
  resultsSection.style.display = '';

  // Hide loading states
  document.getElementById('previewLoading').style.display = 'none';
  document.getElementById('patternLoading').style.display = 'none';

  // Show image if available
  if (entry.image) {
    const img = document.getElementById('previewImage');
    img.src = `data:image/png;base64,${entry.image}`;
    document.getElementById('previewImageWrap').style.display = '';
    document.getElementById('previewContainer').style.display = '';
  } else {
    document.getElementById('previewContainer').style.display = 'none';
  }

  // Show pattern
  const content = document.getElementById('patternContent');
  if (editable) {
    content.innerHTML = `
      <textarea id="patternEditor" class="pattern-editor">${entry.pattern}</textarea>
      <div class="editor-actions">
        <button class="btn-action btn-save" id="saveEditBtn">💾 Save Changes</button>
        <button class="btn-action" id="cancelEditBtn">✗ Cancel</button>
      </div>
    `;
    document.getElementById('saveEditBtn').addEventListener('click', async () => {
      const newPattern = document.getElementById('patternEditor').value;
      await fetch(`/api/library/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern: newPattern }),
      });
      entry.pattern = newPattern;
      entry.modifiedAt = new Date().toISOString();
      showLibraryPattern(entry, false);
    });
    document.getElementById('cancelEditBtn').addEventListener('click', () => {
      showLibraryPattern(entry, false);
    });
  } else {
    content.innerHTML = renderMarkdown(entry.pattern);
  }
  content.style.display = '';

  // Show actions with back-to-library button
  const actions = document.getElementById('resultActions');
  actions.style.display = '';
  window._lastPatternText = entry.pattern;

  // Temporarily swap "New Pattern" to "Back to Library"
  const newBtn = document.getElementById('newPatternBtn');
  newBtn.textContent = '📚 Back to Library';
  newBtn.onclick = () => {
    newBtn.textContent = '🧶 New Pattern';
    newBtn.onclick = handleNewPattern;
    showLibrary();
  };
}

// ---- Action buttons ----
function handlePrint() {
  window.print();
}

function handleCopy() {
  if (window._lastPatternText) {
    navigator.clipboard.writeText(window._lastPatternText).then(() => {
      const btn = document.getElementById('copyBtn');
      const orig = btn.textContent;
      btn.textContent = '✅ Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    });
  }
}

function handleNewPattern() {
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('previewContainer').style.display = '';

  // Reset form fields
  document.getElementById('patternForm').reset();

  // Reset craft type to crochet
  switchCraft('crochet');

  // Reset yarn list back to a single empty entry
  yarnCounter = 0;
  const yarnList = document.getElementById('yarnList');
  yarnList.innerHTML = '';
  yarnList.appendChild(createYarnEntry());

  document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  // Initialize craft type (default crochet)
  renderToolSection('crochet');
  renderProjectTypes('crochet');

  // Craft type toggle buttons
  document.querySelectorAll('.craft-btn').forEach(btn => {
    btn.addEventListener('click', () => switchCraft(btn.dataset.craft));
  });

  // Add first yarn entry
  document.getElementById('yarnList').appendChild(createYarnEntry());

  // Add yarn button
  document.getElementById('addYarnBtn').addEventListener('click', () => {
    const entry = createYarnEntry();
    document.getElementById('yarnList').appendChild(entry);
    entry.querySelector('.yarn-color').focus();
  });

  // Form submit
  document.getElementById('patternForm').addEventListener('submit', handleSubmit);

  // Action buttons
  document.getElementById('printBtn').addEventListener('click', handlePrint);
  document.getElementById('copyBtn').addEventListener('click', handleCopy);
  document.getElementById('saveBtn').addEventListener('click', saveToLibrary);
  document.getElementById('newPatternBtn').addEventListener('click', handleNewPattern);

  // Library
  document.getElementById('showLibraryBtn').addEventListener('click', showLibrary);
  document.getElementById('backFromLibraryBtn').addEventListener('click', hideLibrary);
  fetchLibrary();

  // Theme selector
  renderThemePopup();
  const savedTheme = localStorage.getItem('craft-studio-theme') || 'lavender';
  applyTheme(savedTheme);

  document.getElementById('themeBtn').addEventListener('click', () => {
    const popup = document.getElementById('themePopup');
    popup.style.display = popup.style.display === 'none' ? '' : 'none';
  });

  // Close theme popup on outside click
  document.addEventListener('click', (e) => {
    const popup = document.getElementById('themePopup');
    const btn = document.getElementById('themeBtn');
    if (!popup.contains(e.target) && !btn.contains(e.target)) {
      popup.style.display = 'none';
    }
  });
});
