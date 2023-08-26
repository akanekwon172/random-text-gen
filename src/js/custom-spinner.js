/** Number Input のカスタムスピナー */
class CustomSpinner {
  static DEFAULTS;

  /** @type {HTMLElement} */
  #_wrapper = null;
  /** @type {HTMLElement[]} */
  #_buttons = {};

  #_spinTimer = null;

  constructor(element, opts) {
    this.element = element;
    this.options = {};

    this._onMouseDown  = this._onMouseDown.bind(this);
    this._onMouseUp    = this._onMouseUp.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    this.build();
    this.update(opts);
  }

  build() {
    this.#_wrapper = document.createElement('div');
    if (this.element.parentNode) {
      this.element.parentNode.replaceChild(this.#_wrapper, this.element);
    }

    this.#_wrapper.appendChild(this.element);

    this.#_buttons = {
      inc: document.createElement('button'),
      dec: document.createElement('button'),
    };

    Object.keys(this.#_buttons).forEach((k) => {
      const b = this.#_buttons[k];
      b.appendChild(document.createElement('div'));
      b.setAttribute('type', 'button');
      b.addEventListener('mousedown', this._onMouseDown);
      b.addEventListener('mouseup', this._onMouseUp);
      b.addEventListener('mouseleave', this._onMouseLeave);

      this.#_wrapper.appendChild(b);
    });
  }

  update(opts) {
    opts = { ...CustomSpinner.DEFAULTS, ...this.options, ...opts };

    if (opts.wrapperClass !== this.options.wrapperClass) {
      if (this.options.wrapperClass) this.#_wrapper.classList.remove(this.options.wrapperClass);
      if (opts.wrapperClass) this.#_wrapper.classList.add(opts.wrapperClass);
    }

    if (opts.buttonsClass !== this.options.buttonsClass) {
      if (this.options.buttonsClass) {
        Object.keys(this.#_buttons).forEach((k) => {
          this.#_buttons[k].classList.remove(this.options.buttonsClass);
          this.#_buttons[k].children[0].classList.remove(`${this.options.buttonsClass}-${k}`);
        });
      }

      if (opts.buttonsClass) {
        Object.keys(this.#_buttons).forEach((k) => {
          this.#_buttons[k].classList.add(opts.buttonsClass);
          this.#_buttons[k].children[0].classList.add(`${opts.buttonsClass}-${k}`);
        });
      }
    }

    if (!opts.min || opts.min.trim().length === 0) {
      opts.min = -Infinity;
    }

    if (!opts.max || opts.max.trim().length === 0) {
      opts.max =  Infinity;
    }

    Object.assign(this.options, opts);
  }

  /* 最小値を下回ると最小値、最大値を上回ると最大値を返す */
  adjustValue(value) {
    value = Number(value).toFixed(this.precision);
    if (this.options?.min && value < Number(this.options.min)) {
      value = this.options.min;
    }
    if (this.options?.max && value > Number(this.options.max)) {
      value = this.options.max;
    }

    return value;
  }

  /* wrapOverflow オプションが true の場合、最小値を下回ると最大値、最大値を上回ると最小値を返す */
  wrapValue(value) {
    if (this.options?.wrapOverflow && this.options?.max && this.options?.min) {
      if      (value < this.options.min) value = this.options.max;
      else if (value > this.options.max) value = this.options.min;
    }

    return value;
  }

  spin(step) {
    this.value = this.adjustValue(this.wrapValue(this.value + step));
  }

  _startSpinning(direction) {
    this._stopSpinning();
    this.#_spinTimer = setInterval(
      () => this.spin(direction * this.options.step), this.options.repeatInterval
    );
  }

  _stopSpinning() {
    clearInterval(this.#_spinTimer);
  }

  _onMouseDown(e) {
    e.preventDefault();

    const direction = e.currentTarget === this.#_buttons.inc ? 1 : -1;
    this.spin(direction * this.options.step);
    this.element.focus();

    this._startSpinning(direction);
  }

  _onMouseUp(e) {
    this._stopSpinning();
  }

  _onMouseLeave(e) {
    this._stopSpinning();
  }

  get value() {
    return Number(this.element.value) || 0;
  }

  set value(value) {
    this.element.value = String(value);
  }

  get precision() {
    return Math.max(
      ...[this.options.step, this.options?.min]
        .filter((num) => num !== Number.NaN)
        .map((num) => {
          return (String(num).split('.')[1] || '').length;
        })
    );
  }
}

CustomSpinner.DEFAULTS = {
  wrapperClass: 'customspin-wrapper',
  buttonsClass: 'customspin-button',
  step: 1,
  repeatInterval: 200,
  wrapOverflow: false,
};

export default CustomSpinner;
