import { describe, it, expect } from 'vitest';
import { getReadingTime } from '../src/utils/reading-time';

describe('getReadingTime', () => {
  it('returns 1 min for short Chinese text', () => {
    const text = '这是一段测试文字。'.repeat(50); // ~450 chars
    const result = getReadingTime(text);
    expect(result.minutes).toBe(1);
    expect(result.words).toBeGreaterThan(0);
  });

  it('returns correct time for longer text', () => {
    // ~300 chars/min for Chinese, 200 words/min for English
    const text = '这是一段较长的中文测试文字内容。'.repeat(200); // ~2800 chars
    const result = getReadingTime(text);
    expect(result.minutes).toBeGreaterThanOrEqual(5);
    expect(result.text).toMatch(/\d+ 分钟/);
  });

  it('handles mixed Chinese and English', () => {
    const text = 'Hello world. ' + '这是中文。'.repeat(100);
    const result = getReadingTime(text);
    expect(result.minutes).toBeGreaterThan(0);
  });

  it('returns 1 min minimum for empty text', () => {
    const result = getReadingTime('');
    expect(result.minutes).toBe(1);
  });
});
