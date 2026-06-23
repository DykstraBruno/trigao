import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SlugService {
  toSlug(name: string, id?: number): string {
    const base = (name || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return id != null ? `${base}-${id}` : base;
  }

  extractId(slug: string): number | null {
    const match = slug.match(/-(\d+)$/);
    return match ? Number(match[1]) : null;
  }
}
