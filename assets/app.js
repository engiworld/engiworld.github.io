(() => {
  'use strict';
  const results = window.ENGIWORLD_RESULTS;
  const scope = window.ENGIWORLD_SCOPE;
  const table = document.querySelector('#results-table');
  const columns = {
    overall: [['overall', 'EngiScore'], ['cli', `CLI (${scope.evaluation.cli})`], ['gui', `GUI (${scope.evaluation.gui})`], ['turns', 'Turns'], ['tokens_k', 'Tokens (K)'], ['cost', 'Cost ($)']],
    category: [['overall', 'EngiScore'], ...scope.task_types.map(item => [item.key, `${item.short} (${item.evaluation_count})`])]
  };
  const descriptions = {
    overall: 'EngiScore = 100 × mean task score. Binary tasks require every criterion to pass; Design Optimization tasks score 0–1 after feasibility checks. Infeasible outputs score 0.',
    cli: `CLI EngiScore over ${scope.evaluation.cli} tasks; CLI and GUI use different task subsets.`,
    gui: `GUI EngiScore over ${scope.evaluation.gui} tasks; CLI and GUI use different task subsets.`,
    turns: `Mean turns per task over all ${scope.evaluation.total} tasks, including unsuccessful runs. One turn is one model call.`,
    tokens_k: `Mean output tokens per turn, in thousands, averaged over all ${scope.evaluation.total} tasks.`,
    cost: `Mean API cost in US dollars per task over all ${scope.evaluation.total} tasks, including unsuccessful runs.`,
    ...Object.fromEntries(scope.task_types.map(item => [item.key, `${item.name} (${item.evaluation_count} tasks)`]))
  };
  let currentView = 'overall', sortKey = 'overall', ascending = false;
  function renderResults() {
    const data = [...results].sort((a, b) => (a[sortKey] - b[sortKey]) * (ascending ? 1 : -1) || b.overall - a.overall);
    const cols = columns[currentView];
    table.querySelector('thead tr').innerHTML = '<th scope="col">Model</th>' + cols.map(([key,label]) => `<th scope="col"${key === sortKey ? ` aria-sort="${ascending ? 'ascending' : 'descending'}"` : ''}><button type="button" data-sort="${key}" title="${descriptions[key]}" aria-label="Sort by ${label}">${label}<span class="sort-arrow" aria-hidden="true">${key === sortKey ? (ascending ? '↑' : '↓') : '↕'}</span></button></th>`).join('');
    table.querySelector('tbody').innerHTML = data.map((row, index) => `<tr><td><span class="model-cell"><span class="rank">${String(index+1).padStart(2,'0')}</span><img src="assets/logos/${row.logo}.webp" alt="" width="22" height="22">${row.name}</span></td>${cols.map(([key]) => `<td${key === 'overall' ? ' class="score-cell"' : ''}>${key === 'overall' ? `<span class="scorebar" aria-hidden="true"><i style="width:${row[key]}%"></i></span>` : ''}${row[key].toFixed(key === 'cost' ? 2 : 1)}</td>`).join('')}</tr>`).join('');
  }
  table.addEventListener('click', event => {
    const button = event.target.closest('[data-sort]');
    if (!button) return;
    ascending = button.dataset.sort === sortKey ? !ascending : ['turns','tokens_k','cost'].includes(button.dataset.sort);
    sortKey = button.dataset.sort;
    renderResults();
    table.querySelector(`[data-sort="${sortKey}"]`).focus({preventScroll:true});
    document.querySelector('#sort-status').textContent = `Results sorted by ${columns[currentView].find(([key])=>key===sortKey)[1]}, ${ascending ? 'ascending' : 'descending'}.`;
  });
  const tabs = [...document.querySelectorAll('[data-view]')];
  function selectTab(tab) {
    currentView = tab.dataset.view;
    sortKey = 'overall'; ascending = false;
    tabs.forEach(button => { button.setAttribute('aria-selected', String(button === tab)); button.tabIndex = button === tab ? 0 : -1; });
    document.querySelector('#results-panel').setAttribute('aria-labelledby',tab.id);
    renderResults();
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 : (index+(event.key === 'ArrowRight' ? 1 : -1)+tabs.length)%tabs.length;
      selectTab(tabs[next]); tabs[next].focus();
    });
  });
  const dialog = document.querySelector('#figure-dialog');
  document.querySelectorAll('[data-figure]').forEach(button => button.addEventListener('click', () => {
    const image = button.querySelector('img');
    document.querySelector('#figure-dialog-image').src = button.dataset.figure;
    document.querySelector('#figure-dialog-image').alt = image.alt;
    document.querySelector('#figure-dialog-title').textContent = image.alt;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  document.querySelector('#copy-citation').addEventListener('click', async () => {
    const button = document.querySelector('#copy-citation');
    const value = document.querySelector('#bibtex').textContent;
    let copied = false;
    try { await navigator.clipboard.writeText(value); copied = true; }
    catch {
      const textarea = document.createElement('textarea'); textarea.value = value;
      textarea.style.position = 'fixed'; textarea.style.opacity = '0';
      document.body.appendChild(textarea); textarea.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      textarea.remove(); button.focus({preventScroll:true});
    }
    button.querySelector('span').textContent = copied ? 'Copied!' : 'Select citation below';
    document.querySelector('#copy-status').textContent = copied ? 'Citation copied to clipboard.' : 'Copy was unavailable. Select and copy the citation text below.';
    if (!copied) { const range = document.createRange(); range.selectNodeContents(document.querySelector('#bibtex')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); }
    setTimeout(() => { button.querySelector('span').textContent = 'Copy citation'; },2500);
  });
  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.nav-links a')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (!entry.isIntersecting) return; navLinks.forEach(link => { if(link.hash === '#'+entry.target.id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }); });
    },{rootMargin:'-12% 0px -65% 0px'});
    navLinks.forEach(link => observer.observe(document.querySelector(link.hash)));
  }
})();

(() => {
  const video = document.getElementById("hero-video");
  if (!video) return;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  function respectMotionPreference() {
    if (preference.matches) { video.autoplay = false; video.pause(); }
    else { video.autoplay = true; video.play().catch(() => {}); }
  }
  preference.addEventListener("change", respectMotionPreference);
  respectMotionPreference();
})();
