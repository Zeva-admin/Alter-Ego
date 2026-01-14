// frontend/src/utils/formatter.ts

export function cleanText(raw: string): string {
  return raw
    .replace(/\r/g, '')              // убираем возвраты каретки
    .replace(/\t/g, ' ')             // табы → пробел
    .replace(/[ ]{2,}/g, ' ')        // двойные пробелы → один
    .replace(/\n{3,}/g, '\n\n')      // более двух переносов → два
    .replace(/ *\n */g, '\n')        // пробелы вокруг переносов
    .trim();                         // убираем пробелы в начале/конце
}
