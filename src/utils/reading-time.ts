interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
}

export function getReadingTime(content: string): ReadingTimeResult {
  const stripped = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/^---[\s\S]*?---/m, '');
  const chineseChars = (stripped.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const englishWords = (stripped.match(/[a-zA-Z]+/g) || []).length;

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
