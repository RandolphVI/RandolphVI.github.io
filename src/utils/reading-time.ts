interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
}

export function getReadingTime(content: string): ReadingTimeResult {
  // Count Chinese characters (CJK Unified Ideographs)
  const chineseChars = (content.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  // Count English words
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;

  // Reading speed: ~300 Chinese chars/min, ~200 English words/min
  const totalMinutes = chineseChars / 300 + englishWords / 200;
  const minutes = Math.max(1, Math.round(totalMinutes));
  const words = chineseChars + englishWords;

  return {
    minutes,
    words,
    text: `${minutes} 分钟`,
  };
}
