import * as THREE from 'three';

const cache = new Map<string, THREE.CanvasTexture>();

/**
 * A cached canvas texture of a single glyph on a parchment tile — the robust way
 * to put crisp, upright numerals on the curved display drum (one plane per digit)
 * without async fonts or wrapped-texture UV pain.
 */
export function glyphTexture(
  text: string,
  opts: { ink?: string; paper?: string; bold?: boolean } = {},
): THREE.CanvasTexture {
  const key = `${text}|${opts.ink ?? ''}|${opts.paper ?? ''}|${opts.bold ?? true}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context indisponible');

  ctx.fillStyle = opts.paper ?? '#ece0c4';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = opts.ink ?? '#20160c';
  ctx.font = `${opts.bold === false ? '' : 'bold '}92px Georgia, "Times New Roman", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2 + 6);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(key, tex);
  return tex;
}
