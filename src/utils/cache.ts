// utils/cache.ts
import fs from 'fs/promises';
import path from 'path';

const CACHE_DIR = path.resolve('./.cache');
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export async function getCachedDrivers(year: number) {
  try {
    const file = path.join(CACHE_DIR, `${year}.json`);
    const stat = await fs.stat(file);
    if (Date.now() - stat.mtimeMs < CACHE_TTL_MS) {
      const content = await fs.readFile(file, 'utf8');
      return JSON.parse(content);
    }
  } catch {}
  return null;
}

export async function setCachedDrivers(year: number, data: any) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(path.join(CACHE_DIR, `${year}.json`), JSON.stringify(data), 'utf8');
  } catch (err) {
    console.error('Failed to write cache:', err);
  }
}
