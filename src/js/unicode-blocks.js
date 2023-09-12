/**
 * ユニコードブロック (半角文字) の定義
 * @see https://www.unicode.org/roadmaps/bmp/
*/
const BASIC_BLOCKS = [
  { blockName: '数字',      range: { from: 0x30, to: 0x39 }},
  { blockName: '英字(大文字)', range: { from: 0x41, to: 0x5a }},
  { blockName: '英字(小文字)', range: { from: 0x61, to: 0x7a }},
  {
    blockName: '記号',
    range: [
      { from: 0x21, to: 0x2f },
      { from: 0x3a, to: 0x40 },
      { from: 0x5b, to: 0x60 },
      { from: 0x7b, to: 0x7e },
    ],
  },
];

/**
 * ユニコードブロック (漢字) の定義
 * @see https://www.unicode.org/roadmaps/bmp/
 */
const UNICODE_BLOCKS = [
  { blockName: 'CJK統合漢字拡張A', range: { from: 0x3400, to: 0x4dbf }},
  { blockName: 'CJK統合漢字',    range: { from: 0x4e00, to: 0x9fff }},
  { blockName: 'CJK互換漢字',    range: { from: 0xf900, to: 0xfad9 }},
];

/**
 * [min, max] の範囲でランダムな文字を生成
 * @param min
 * @param max
 * @return {string}
 */
const randomUnicodeChar = (min = 0x21, max = 0x7e) => {
  if (min > max) [min, max] = [max, min];

  return String.fromCodePoint(Math.floor(Math.random() * (max - min + 1) + min));
};

export { BASIC_BLOCKS, UNICODE_BLOCKS, randomUnicodeChar };
