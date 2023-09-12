import { randomUnicodeChar } from './unicode-blocks.js';

/** 文字列のシャッフルアニメーション */
class ShuffleEffect {
  #idNum = 0;
  #frame = 0;
  #rafId = null;

  constructor(id, element) {
    this.id = id;
    this.element = element;
    this.originalString = element.innerText;

    /** @type {HTMLElement[]} */
    this.spans = [];

    this.createSpans();
  }

  /** 文字列を 1文字ごとに span タグで分割 */
  createSpans() {
    this.element.innerHTML = [...this.originalString]
      .map((string) => `<span>${string}</span>`).join('');

    this.spans = [...this.element.querySelectorAll('span')];
  }

  /** frame % number 毎に文字を代入 */
  animate(from, to) {
    if (this.#idNum !== this.originalString.length) {
      const span = this.spans[this.#idNum];

      span.style.opacity = 1;

      // Unicode の [from ... to] の範囲で randomUnicodeChar を代入
      if (this.#frame % 6 === 0) {
        span.innerHTML = randomUnicodeChar(from, to);
      }

      if (this.#frame % 60 === 0 && this.#frame !== 0) {
        span.innerHTML = this.originalString[this.#idNum];
        this.#idNum += 1;
      }

      this.#frame += 1;

      this.#rafId = requestAnimationFrame(this.animate.bind(this, from, to));
    }
  }

  /** 文字列を非表示状態にする */
  reset() {
    this.#idNum = 0;
    this.#frame = 0;

    this.spans.forEach((span) => {
      span.style.opacity = 0;
    });

    cancelAnimationFrame(this.#rafId);
  }
}

export default ShuffleEffect;
