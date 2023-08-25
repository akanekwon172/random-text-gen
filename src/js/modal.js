'use strict';

const html       = document.querySelector('html');
const body       = document.querySelector('body');
const modal      = document.querySelector('#modal-dialog');
const modalOpen  = document.querySelector('.modal-open');
const modalClose = document.querySelector('.modal-close');

const MODAL_CLASS = 'is-modal';

const addClass    = (element, token) => element.classList.add(token);
const removeClass = (element, token) => element.classList.remove(token);

modalOpen.addEventListener('click', () => {
  [html, body].forEach((element) => addClass(element, MODAL_CLASS));

  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    alert('dialog 要素をサポートしていないブラウザです');
  }
});

modalClose.addEventListener('click', () => {
  [html, body].forEach((element) => removeClass(element, MODAL_CLASS));
  modal.close();
});

modal.addEventListener('click', (e) => {
  [html, body].forEach((element) => removeClass(element, MODAL_CLASS));

  if (!e.target.closest('.modal-content')) {
    modal.close();
  }
});

modal.addEventListener('cancel', () => {
  [html, body].forEach((element) => removeClass(element, MODAL_CLASS));
});
