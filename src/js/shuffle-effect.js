import { randomUnicodeChar } from './unicode-blocks.js';

/** 文字列のシャッフルアニメーション */
class ShuffleEffect {
  #idNum = 0;
  #frame = 0;
  #rafId = null;

  constructor(id, element) {
    this.id = id;
    this.element = element;
    this.element.className = `${id}`;
    this.originalString = element.innerText;
    this.innerHtml = '';
    this.spans = [];

    this.createSpans();
  }

  /* 文字列を 1文字ごとにタグで分割 */
  createSpans() {
    for (let i = 0; i < this.originalString.length; i++) {
      this.innerHtml += `<span>${this.originalString[i]}</span>`;
    }
    this.element.innerHTML = this.innerHtml;
    this.spans = [...this.element.querySelectorAll('span')];
  }

  /** Unicodeの [from ... to] の範囲で frame % number 毎に randomUnicodeChar を代入 */
  animate(from, to) {
    if (this.#idNum !== this.originalString.length) {
      this.#rafId = requestAnimationFrame(this.animate.bind(this, from, to));
      this.spans[this.#idNum].style.opacity = 1;

      if (this.#frame % 6 === 0) {
        this.spans[this.#idNum].innerHTML = randomUnicodeChar(from, to);
      }

      if (this.#frame % 60 === 0 && this.#frame !== 0) {
        this.spans[this.#idNum].innerHTML = this.originalString[this.#idNum];
        this.#idNum += 1;
      }

      this.#frame += 1;
    }
  }

  /** 文字列を非表示状態にする */
  reset() {
    this.#idNum = 0;
    this.#frame = 0;

    [...this.spans].forEach((span) => {
      span.style.opacity = 0;
    });

    cancelAnimationFrame(this.#rafId);
  }
}

export default ShuffleEffect;
