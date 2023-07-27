'use strict';

import { BASIC_BLOCKS, UNICODE_BLOCKS, randomUnicodeChar } from './unicode-blocks.js';

const basicBlockList = document.querySelectorAll('input[name=blocks]');
const unicodeBlockList = document.querySelectorAll('input[name=ucblocks]');
const textLength = document.querySelector('#textLength');
const createCount = document.querySelector('#createCount');
const generateButton = document.querySelector('#generateButton');
const resetButton = document.querySelector('#resetButton');
const resultList = document.querySelector('#result');

const MAX_LENGTH = 20;
const MAX_COUNT = 10;
let checkedArray = [];
let checkedKanjiArray = [];

/**
 * 選択された文字種からランダムに 1つ選択
 * @param array
 * @returns {number}
 */
const randomBlock = (array) => Math.floor(Math.random() * array.length);

/**
 * 半角文字と漢字ブロックを切り替える
 */
const toggleBlockList = () => {
  if ([...unicodeBlockList].some((c) => c.checked)) {
    [...basicBlockList].every((c) => (c.disabled = true));
  } else {
    [...basicBlockList].forEach((c) => (c.disabled = false));
  }
};

/**
 * 選択された文字種のみを checkedArray に更新
 * @param array
 * @param checkbox
 * @returns {array}
 */
const toggleCheckedArray = (array, checkbox) => {
  if (array.includes(checkbox.value)) {
    array = [...array].filter((v) => v !== checkbox.value);
  } else {
    array = [...array, checkbox.value].sort();
  }
  return array;
};

basicBlockList.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    checkedArray = toggleCheckedArray(checkedArray, checkbox);
  });
});

unicodeBlockList.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    toggleBlockList();
    checkedKanjiArray = toggleCheckedArray(checkedKanjiArray, checkbox);
  });
});

generateButton.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const resultList = document.querySelector('#result');
  const length = parseInt(textLength.value) > MAX_LENGTH ? MAX_LENGTH : textLength.value;
  const count = parseInt(createCount.value) > MAX_COUNT ? MAX_COUNT : createCount.value;

  resultList.textContent = '';

  for (let j = 0; j < count; j++) {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    let result = [];

    for (let i = 0; i < length; i++) {
      const block = BASIC_BLOCKS[checkedArray[randomBlock(checkedArray)]];
      const block2 = UNICODE_BLOCKS[checkedKanjiArray[randomBlock(checkedKanjiArray)]];

      if ([...unicodeBlockList].some((c) => c.checked)) {
        result = [...result, randomUnicodeChar(block2.range.from, block2.range.to)];
        continue;
      }

      if (block.name === '記号') {
        let randomKigou = [];

        block.ranges.forEach((range) => {
          randomKigou = [...randomKigou, randomUnicodeChar(range.from, range.to)];
        });
        // 複数の range からランダムに 1つ代入
        result = [...result, randomKigou[Math.floor(Math.random() * block.ranges.length)]];
      } else {
        result = [...result, randomUnicodeChar(block.range.from, block.range.to)];
      }
    }

    result = [...result].join('');

    h3.appendChild(document.createTextNode(result));
    li.appendChild(h3);
    resultList.insertAdjacentElement('beforeend', li);
  }

});


window.addEventListener('DOMContentLoaded', () => {
  // 選択された文字種のみを checkedArray に代入
  document.querySelectorAll('input[name=blocks]:checked').forEach((checkbox) => {
    checkedArray = [...checkedArray, checkbox.value];
  });

  document.querySelectorAll('input[name=ucblocks]:checked').forEach((checkbox) => {
    checkedKanjiArray = [...checkedKanjiArray, checkbox.value];
  });

  toggleBlockList();
});
