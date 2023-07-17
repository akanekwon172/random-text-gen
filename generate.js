'use strict';

const checkboxList = document.querySelectorAll('input[name=blocks]');
const textLength = document.querySelector('#textLength');
const createCount = document.querySelector('#createCount');
const generateButton = document.querySelector('#generateButton');
const resultList = document.querySelector('#result');

//
let checkedArray = [];

/** ランダムな文字列を生成
 *
 */
const randomUnicodeChar = (min = 0x21, max = 0x7e) => {
  if (min > max) [min, max] = [max, min];

  return String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));
};

// 選択された文字種から
const randomBlock = () => Math.floor(Math.random() * checkedArray.length);

checkboxList.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    // 選択された文字種のみをcheckedArrayに更新
    if (checkedArray.includes(checkbox.value)) {
      checkedArray = [...checkedArray].filter(v => v !== checkbox.value);
    } else {
      checkedArray = [...checkedArray, checkbox.value].sort();
    }
  });
});

generateButton.addEventListener('click', e => {
  // let result = [];
  e.preventDefault();
  e.stopPropagation();

  const length = parseInt(textLength.value) > 20 ? 20 : textLength.value;
  const count = parseInt(createCount.value) > 10 ? 10 : createCount.value;

  resultList.textContent = '';

  //
  for (let j = 0; j < count; j++) {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    let result = [];

    for (let i = 0; i < length; i++) {
      // let rb = randomBlock();
      let block = defaultBlocks[checkedArray[randomBlock()]];

      if (block.name === '記号') {
        let randomkigou = [];

        block.ranges.forEach(range => {
          randomkigou = [...randomkigou, randomUnicodeChar(range.from, range.to)];
        });

        // 複数のrangeからランダムに1つ代入
        result = [...result, randomkigou[Math.floor(Math.random() * block.ranges.length)]];
      } else {
        //
        block.ranges.forEach(range => {
          result = [...result, randomUnicodeChar(range.from, range.to)];
        });
      }
    }

    result = [...result].join('');

    h3.appendChild(document.createTextNode(result));
    li.appendChild(h3);
    resultList.insertAdjacentElement('beforeend', li);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  // 選択された文字種のみをcheckedArrayに代入
  document.querySelectorAll('input[name=blocks]:checked').forEach(checkbox => {
    checkedArray = [...checkedArray, checkbox.value];
  });
});
