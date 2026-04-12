import { describe, it, expect } from 'vitest';
import { getSeason, getVolumeLabel } from '../src/utils/season';

describe('getSeason', () => {
  it('returns 春 for March', () => {
    expect(getSeason(new Date('2026-03-15'))).toBe('春');
  });

  it('returns 夏 for July', () => {
    expect(getSeason(new Date('2026-07-01'))).toBe('夏');
  });

  it('returns 秋 for October', () => {
    expect(getSeason(new Date('2026-10-10'))).toBe('秋');
  });

  it('returns 冬 for January', () => {
    expect(getSeason(new Date('2026-01-15'))).toBe('冬');
  });
});

describe('getVolumeLabel', () => {
  it('formats volume label', () => {
    expect(getVolumeLabel(7, new Date('2026-03-15'))).toBe('VOL. 07 · 2026 春');
  });

  it('pads single digit volume', () => {
    expect(getVolumeLabel(3, new Date('2026-07-01'))).toBe('VOL. 03 · 2026 夏');
  });
});
