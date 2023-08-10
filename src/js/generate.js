import { BASIC_BLOCKS, UNICODE_BLOCKS, randomUnicodeChar } from './unicode-blocks.js';
import { ShuffleEffect } from './shuffle-effect.js';

const basicBlockList    = document.querySelectorAll('input[name=blocks]');
const unicodeBlockList  = document.querySelectorAll('input[name=ucblocks]');
const incrementButtons  = document.querySelectorAll('.input-number-increment');
const decrementButtons  = document.querySelectorAll('.input-number-decrement');
const textLength        = document.querySelector('#text-length');
const createCount       = document.querySelector('#create-count');
const generateButton    = document.querySelector('#generate-button');
const resetButton       = document.querySelector('#reset-button');

const resultList        = document.querySelector('#result');

const MAX_LENGTH = 20; // 表示最大文字数 (1行)
const MAX_COUNT  = 10; // 表示最大行数

/**
 * 選択された文字種別からランダムに 1つ選択
 * @param array
 * @returns {number}
 */
const randomBlock = (array) => Math.floor(Math.random() * array.length);

/**
 * [漢字] ブロックが選択されたか
 * @returns {boolean}
 */
const isKanjiBlockChecked = () => [...unicodeBlockList].some((c) => c.checked);

/** [漢字] ブロックが選択されたら、[半角文字] ブロックを不可にする */
const toggleBlockList = () => {
  if (isKanjiBlockChecked()) {
    [...basicBlockList].every((c) => (c.disabled = true));
  } else {
    [...basicBlockList].forEach((c) => (c.disabled = false));
  }
};

unicodeBlockList.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    toggleBlockList();
  });
});

/** Number input の カスタムスピナー */
const customSpinner = (button, direction) => {
  let _spinTimer;
  const _stopSpinning = () => {
    clearInterval(_spinTimer);
  };
  const _startSpinning = () => {
    _stopSpinning();
    _spinTimer = setInterval(() => {
      (direction === 'inc')
        ? button.previousElementSibling.stepUp()
        : button.previousElementSibling.previousElementSibling.stepDown();
    }, 200);
  };

  button.addEventListener('mousedown', (e) => {
    e.preventDefault();
    _startSpinning();
  });
  button.addEventListener('mouseup', _stopSpinning);
  button.addEventListener('mouseleave', _stopSpinning);
};

for (const button of incrementButtons) {
  customSpinner(button, 'inc');
}

for (const button of decrementButtons) {
  customSpinner(button, 'dec');
}

generateButton.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const selectedBlocks = [...document.querySelectorAll('input[name=blocks]:checked')]
    .map((checkbox) => checkbox.value);
  const selectedKanjiBlocks = [...document.querySelectorAll('input[name=ucblocks]:checked')]
    .map((checkbox) => checkbox.value);

  if (selectedBlocks.length === 0 && selectedKanjiBlocks.length === 0) {
    return;
  }

  // 数字以外が入力された場合のバリデーション
  const notBeginNumber = /^(?![0-9]).*$/g;
  if (notBeginNumber.test(textLength.value) || notBeginNumber.test(createCount.value)) {
    return;
  }

  const length = parseInt(textLength.value) > MAX_LENGTH ? MAX_LENGTH : textLength.value;
  const count = parseInt(createCount.value) > MAX_COUNT ? MAX_COUNT : createCount.value;

  resultList.textContent = '';

  for (let j = 0; j < count; j++) {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    let result = [];

    for (let i = 0; i < length; i++) {
      const bBlock = BASIC_BLOCKS[selectedBlocks[randomBlock(selectedBlocks)]];
      const uBlock = UNICODE_BLOCKS[selectedKanjiBlocks[randomBlock(selectedKanjiBlocks)]];

      if (isKanjiBlockChecked()) {
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

/** シャッフル演出アニメーション */
const showAnimation = () => {
  setTimeout(() => {
    let items = [];

    [...document.querySelectorAll('h3')].forEach((header, id) => {
      items = [...items, new ShuffleEffect(id, header)];
    });

    const callback = (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.className;

        items[id].reset();
        if (entry.isIntersecting) {
          if (isKanjiBlockChecked()) {
            items[id].animate(0x4e00, 0x9fff);
          } else {
            items[id].animate(0x21, 0x7e);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, { rootMargin: '0px', threshold: 0.0 });

    items.forEach((instance) => {
      observer.observe(instance.element);
    });
  }, 10);
};

resetButton.addEventListener('click', () => {
  [...basicBlockList].forEach((c) => c.disabled = false);
  [...unicodeBlockList].forEach((c) => c.checked = false);

  textLength.value = 10;
  createCount.value = 5;
});

window.addEventListener('DOMContentLoaded', () => {
  toggleBlockList();
});
