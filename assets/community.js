(() => {
  'use strict';
  const trigger = document.getElementById('wechat-link');
  const dialog = document.getElementById('wechat-dialog');
  if (!trigger || !dialog || typeof dialog.showModal !== 'function') return;
  let previousOverflow = '';

  trigger.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
    event.preventDefault();
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
  dialog.querySelector('.wechat-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    trigger.focus({preventScroll: true});
  });
})();
