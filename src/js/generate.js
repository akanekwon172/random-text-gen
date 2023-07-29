'use strict';

import { BASIC_BLOCKS, UNICODE_BLOCKS, randomUnicodeChar } from './unicode-blocks.js';
import { ShuffleEffect } from './shuffle-effect.js';

const basicBlockList = document.querySelectorAll('input[name=blocks]');
const unicodeBlockList = document.querySelectorAll('input[name=ucblocks]');
const textLength = document.querySelector('#textLength');
const createCount = document.querySelector('#createCount');
const generateButton = document.querySelector('#generateButton');
const resetButton = document.querySelector('#resetButton');

const resultList = document.querySelector('#result');

const MAX_LENGTH = 20; // 表示最大文字数
const MAX_COUNT  = 10; // 表示最大生成回数

let checkedArray = [];
let checkedKanjiArray = [];

/**
 * 選択された文字種からランダムに 1つ選択
 * @param array
 * @returns {number}
 */
const randomBlock = (array) => Math.floor(Math.random() * array.length);

/**
 * [漢字] ブロックが選択されたか
 * @returns {boolean}
 */
const isKanjiBlock = () => [...unicodeBlockList].some((c) => c.checked);

/**
 * [半角文字]と[漢字] ブロックを切り替える
 */
const toggleBlockList = () => {
  if (isKanjiBlock()) {
    [...basicBlockList].every((c) => (c.disabled = true));
  } else {
    [...basicBlockList].forEach((c) => (c.disabled = false));
  }
};

/**
 * 選択された文字種のみを array に更新
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

  const length = parseInt(textLength.value) > MAX_LENGTH ? MAX_LENGTH : textLength.value;
  const count  = parseInt(createCount.value) > MAX_COUNT ? MAX_COUNT : createCount.value;

  resultList.textContent = '';

  for (let j = 0; j < count; j++) {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    let result = [];

    for (let i = 0; i < length; i++) {
      const bBlock = BASIC_BLOCKS[checkedArray[randomBlock(checkedArray)]];
      const uBlock = UNICODE_BLOCKS[checkedKanjiArray[randomBlock(checkedKanjiArray)]];

      if (isKanjiBlock()) {
        result = [...result, randomUnicodeChar(uBlock.range.from, uBlock.range.to)];
        continue;
      }

      if (bBlock.name === '記号') {
        let randomKigou = [];

        bBlock.range.forEach((range) => {
          randomKigou = [...randomKigou, randomUnicodeChar(range.from, range.to)];
        });
        // 複数の range からランダムに 1つ代入
        result = [...result, randomKigou[Math.floor(Math.random() * bBlock.range.length)]];
      } else {
        result = [...result, randomUnicodeChar(bBlock.range.from, bBlock.range.to)];
      }
    }

    result = [...result].join('');

    h3.appendChild(document.createTextNode(result));
    li.appendChild(h3);
    resultList.insertAdjacentElement('beforeend', li);
  }

  if (document.querySelector('#shuffle').checked) {
    showAnimation();
  }
});

/**
 * シャッフル演出アニメーション
 */
const showAnimation = () => {
  setTimeout(() => {
    const item = [];
    const resultArray = [...document.querySelectorAll('h3')];

    resultArray.forEach((header, idx) => {
      item[idx] = new ShuffleEffect(idx, header);
    });

    const callback = (entries) => {
      entries.forEach((entry) => {
        item[entry.target.className].reset();
        if (entry.isIntersecting) {
          item[entry.target.className].intersecting = true;
          if (isKanjiBlock()) {
            item[entry.target.className].animate(0x4e00, 0x9fff);
          } else {
            item[entry.target.className].animate(0x21, 0x7e);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, { rootMargin: '0px', threshold: 0.0 });

    item.forEach((instance) => {
      observer.observe(instance.element);
      instance.element.style.opacity = 1;
    });
  }, 10);
};

resetButton.addEventListener('click', () => {
  [...basicBlockList].forEach((c) => (c.disabled = false));
  [...unicodeBlockList].forEach((c) => (c.checked = false));

  textLength.value = 10;
  createCount.value = 5;
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
