export function escapeHtml(value = '') {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[ch]));
}

export function escapeAttr(value = '') {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

export function safeHexColor(value, fallback = '#64748b') {
  const s = String(value || '').trim();
  return /^#[0-9A-Fa-f]{6}$/.test(s) ? s : fallback;
}

export function safeImageDataUrl(value) {
  const s = String(value || '').trim();
  return /^data:image\/(?:png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=\s]+$/i.test(s) ? s : '';
}

export function setLabeledText(element, label, value) {
  if (!element) return;
  element.replaceChildren();
  const strong = document.createElement('b');
  strong.textContent = `${label}:`;
  element.append(strong, document.createTextNode(` ${String(value ?? '—')}`));
}
