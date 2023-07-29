'use strict';

import { randomUnicodeChar } from './unicode-blocks.js';

/**
 * 文字列のシャッフルアニメーション
 */
class ShuffleEffect {
  #rafId = null;

  constructor(id, element) {
    this.id = id;
    this.idx = 0;
    this.frame = 0;
    this.element = element;
    this.element.className = `${id}`;
    this.originalString = element.innerText;
    this.innerHtml = '';
    this.intersecting = false; //
    this.spans = [];

    this.createSpans();
  }

  createSpans() {
    for (let i = 0; i < this.originalString.length; i++) {
      this.innerHtml += `<span>${this.originalString[i]}</span>`;
    }
    this.element.innerHTML = this.innerHtml;
    this.spans = [...this.element.querySelectorAll('span')];
  }

  animate(from, to) {
    if (this.idx !== this.originalString.length && this.intersecting) {
      this.spans[this.idx].style.opacity = 1;
      this.spans[this.idx].style.transform = `translateX(0)`;

      if (this.frame % 6 === 0) {
        this.spans[this.idx].innerHTML = randomUnicodeChar(from, to);
      }
      if (this.frame % 60 === 0 && this.frame !== 0) {
        this.spans[this.idx].innerHTML = this.originalString[this.idx];
        this.idx += 1;
      }

      this.frame += 1;

      this.#rafId = requestAnimationFrame(this.animate.bind(this, from, to));
    }
  }

  reset() {
    this.idx = 0;
    this.frame = 0;
    this.intersecting = false;
    [...this.spans].forEach((span) => {
      span.style.opacity = 0;
      span.style.transform = `translateX(-20px)`;
    });

    cancelAnimationFrame(this.#rafId);
  }
}

export { ShuffleEffect };
