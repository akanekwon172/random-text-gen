'use strict';

/** ユニコードブロック(半角文字) の定義 */
const BASIC_BLOCKS = [
  { name: '数字',      range: { from: 0x30, to: 0x39 }},
  { name: '英字(大文字)', range: { from: 0x41, to: 0x5a }},
  { name: '英字(小文字)', range: { from: 0x61, to: 0x7a }},
  {
    name: '記号',
    ranges: [
      { from: 0x21, to: 0x2f },
      { from: 0x3a, to: 0x40 },
      { from: 0x5b, to: 0x60 },
      { from: 0x7b, to: 0x7e },
    ],
  },
];

/** ユニコードブロック(漢字) の定義 */
const UNICODE_BLOCKS = [
  { name: 'CJK統合漢字拡張A', range: { from:  0x3400, to:  0x4dbf }},
  { name: 'CJK統合漢字',    range: { from:  0x4e00, to:  0x9fff }},
  { name: 'CJK互換漢字',    range: { from:  0xf900, to:  0xfaff }},

/*   { name: 'CJK統合漢字拡張B', range: { from: 0x20000, to: 0x2a6df }},
  { name: 'CJK統合漢字拡張C', range: { from: 0x2a700, to: 0x2b73f }},
  { name: 'CJK統合漢字拡張D', range: { from: 177984, to: 178207 }},
  { name: 'CJK統合漢字拡張E', range: { from: 178208, to: 183983 }},
  { name: 'CJK統合漢字拡張F', range: { from: 183984, to: 191471 }},
  { name: 'CJK互換漢字補助',  range: { from: 194560, to: 195103 }}, */
];

/**
 * ランダムな文字を生成
 * @param min
 * @param max
 * @returns {string}
 */
const randomUnicodeChar = (min = 0x21, max = 0x7e) => {
  if (min > max) [min, max] = [max, min];

   return String.fromCodePoint(Math.floor(Math.random() * (max - min + 1) + min));
};

export { BASIC_BLOCKS, UNICODE_BLOCKS, randomUnicodeChar };
