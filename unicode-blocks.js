'use strict';

// ユニコードブロックの定義
const DEFAULT_BLOCKS = [
  { name: '数字',        range: { from: 0x30, to: 0x39 } },
  { name: '英字(大文字)', range: { from: 0x41, to: 0x5A } },
  { name: '英字(小文字)', range: { from: 0x61, to: 0x7A } },
  {
    name: '記号',
    ranges: [
      { from: 0x21, to: 0x2F },
      { from: 0x3A, to: 0x40 },
      { from: 0x5B, to: 0x60 },
      { from: 0x7B, to: 0x7E },
    ],
  },
];

/**
 * ランダムな文字を生成
 * @param min
 * @param max
 * @returns string
 */
const randomUnicodeChar = (min = 0x21, max = 0x7e) => {
  if (min > max) [min, max] = [max, min];

  return String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));
};
