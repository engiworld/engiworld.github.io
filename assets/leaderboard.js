(() => {
  'use strict';
  const results = window.ENGIWORLD_RESULTS;
  const chart = document.querySelector('#efficiency-chart');
  if (!chart || !Array.isArray(results)) return;
  const detail = document.querySelector('#chart-detail');
  const caption = document.querySelector('#chart-caption');
  const xButtons = [...document.querySelectorAll('[data-chart-x]')];
  const yButtons = [...document.querySelectorAll('[data-chart-y]')];
  const modelButtons = [...document.querySelectorAll('[data-chart-model]')];
  const colors = ['#16816b', '#30363f', '#7855ba', '#397bbd', '#bd7b1f', '#c95180', '#aa89cc'];
  const metrics = {
    steps: { label: 'Mean steps / task', short: 'steps / task', interval: 25, format: v => v.toFixed(1) },
    tokens_k: { label: 'Mean output tokens / step (K)', short: 'K output tokens / step', interval: 2, format: v => v.toFixed(1) },
    cost: { label: 'Mean API cost / task ($)', short: 'API cost / task', interval: 5, format: v => '$' + v.toFixed(2) }
  };
  const subsets = { overall: 'Overall · 300 tasks', cli: 'CLI · 152 tasks', gui: 'GUI · 148 tasks' };
  let xKey = 'steps', yKey = 'overall', selected = null;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const left = 74, right = 1126, top = 34, bottom = 396, yMax = 60;

  function layoutLabels(points) {
    const occupied = points.map(p => ({ x: p.x - 9, y: p.y - 9, w: 18, h: 18 }));
    const intersects = (a, b) => a.x < b.x + b.w + 6 && a.x + a.w + 6 > b.x && a.y < b.y + b.h + 5 && a.y + a.h + 5 > b.y;
    // Put higher scores first; move nearby labels with short leader lines.
    return [...points].sort((a, b) => a.y - b.y || a.x - b.x).map(point => {
      const width = point.row.name.length * 10 + 30;
      const preferLeft = point.x + width + 18 > right;
      const preferredX = preferLeft ? point.x - width - 16 : point.x + 16;
      const alternateX = preferLeft ? point.x + 16 : point.x - width - 16;
      const xPositions = [preferredX, alternateX].map(x => Math.max(left + 6, Math.min(right - width, x)));
      const offsets = [-29, 12, -66, 49, -103, 86, -140, 123, -177, 160];
      const yPositions = [...new Set([
        ...offsets.map(offset => Math.min(bottom - 26, Math.max(top, point.y + offset))),
        ...Array.from({ length: 11 }, (_, i) => top + i * 32)
      ])].sort((a, b) => Math.abs(a + 13 - point.y) - Math.abs(b + 13 - point.y));
      let box;
      for (const x of xPositions) {
        for (const y of yPositions) {
          const candidate = { x, y, w: width, h: 26 };
          if (!occupied.some(other => intersects(candidate, other))) { box = candidate; break; }
        }
        if (box) break;
      }
      if (!box) box = { x: left + 6, y: top, w: width, h: 26 };
      occupied.push(box);
      return { ...point, box, onLeft: box.x + box.w / 2 < point.x };
    });
  }

  function describeModel(name) {
    const row = results.find(model => model.name === name);
    if (!row) return;
    detail.innerHTML = `<strong>${escape(row.name)}</strong> · ${subsets[yKey]} EngiScore <strong>${row[yKey].toFixed(1)}</strong> · ${metrics[xKey].format(row[xKey])} ${metrics[xKey].short}`;
  }

  function highlight(name) {
    selected = selected === name ? null : name;
    modelButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.chartModel === selected)));
    render();
  }

  function render() {
    const metric = metrics[xKey];
    const xMax = Math.ceil(Math.max(...results.map(row => row[xKey])) / metric.interval) * metric.interval;
    const points = results.map((row, index) => ({ row, color: colors[index], x: left + row[xKey] / xMax * (right - left), y: bottom - row[yKey] / yMax * (bottom - top) }));
    let grid = '';
    for (let value = 0; value <= yMax; value += 15) {
      const y = bottom - value / yMax * (bottom - top);
      grid += `<line class="chart-grid" stroke="#e8eceb" stroke-width="1" x1="${left}" y1="${y}" x2="${right}" y2="${y}"/><text class="chart-tick" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#677579" x="${left - 14}" y="${y + 5}" text-anchor="end">${value}</text>`;
    }
    for (let value = 0; value <= xMax; value += metric.interval) {
      const x = left + value / xMax * (right - left);
      grid += `<line class="chart-grid" stroke="#e8eceb" stroke-width="1" x1="${x}" y1="${top}" x2="${x}" y2="${bottom}"/><text class="chart-tick" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#677579" x="${x}" y="${bottom + 29}" text-anchor="middle">${xKey === 'cost' ? '$' : ''}${value}</text>`;
    }
    const labels = layoutLabels(points).map(({ row, color, x, y, box, onLeft }) => {
      const labelY = box.y + 19;
      const anchorX = onLeft ? box.x + box.w : box.x;
      const muted = selected && selected !== row.name ? ' is-muted' : '';
      const label = `${row.name}. ${subsets[yKey]} EngiScore ${row[yKey].toFixed(1)}. ${metric.format(row[xKey])} ${metric.short}.`;
      return `<g class="chart-point${muted}" tabindex="0" role="button" data-point="${escape(row.name)}" aria-pressed="${selected === row.name}" aria-label="${escape(label)}"><title>${escape(label)}</title><line x1="${x}" y1="${y}" x2="${anchorX}" y2="${labelY - 6}" stroke="${color}" stroke-opacity=".35"/><circle class="chart-marker" cx="${x}" cy="${y}" r="7.5" fill="${color}" stroke="white" stroke-width="2.5"/><image href="assets/logos/${row.logo}.webp" x="${box.x}" y="${box.y + 2}" width="20" height="20" aria-hidden="true"/><text class="chart-model-label" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" x="${box.x + 27}" y="${labelY}" fill="${color}">${escape(row.name)}</text></g>`;
    }).join('');
    chart.innerHTML = `<title id="efficiency-title">${escape(metric.label)} against ${subsets[yKey]} EngiScore</title><desc id="efficiency-description">One point per model, using the supplied main evaluation. Resource means cover all 300 tasks. Exact values appear in the table below.</desc>${grid}<path class="chart-axis" fill="none" stroke="#536266" stroke-width="1.5" d="M${left} ${top}V${bottom}H${right}"/>${labels}<text class="chart-axis-label" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#38474b" x="${(left + right) / 2}" y="464" text-anchor="middle">${escape(metric.label)}</text><text class="chart-axis-label" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#38474b" transform="translate(22 ${(top + bottom) / 2}) rotate(-90)" text-anchor="middle">${escape(subsets[yKey])} EngiScore</text>`;
    caption.textContent = (xKey === 'tokens_k'
      ? 'Output tokens are per-step means (K), averaged over 300 tasks; they are not total tokens per task.'
      : `${xKey === 'steps' ? 'Steps' : 'API cost'} are per-task means over all 300 tasks, including unsuccessful runs.`)
      + (yKey === 'overall' ? ' Each point is one model. Lower resource use and higher EngiScore are better.' : ' The selected score uses its CLI or GUI subset; resource means still cover all 300 tasks. CLI and GUI use different tasks.');
    chart.querySelectorAll('[data-point]').forEach(point => {
      point.addEventListener('click', () => highlight(point.dataset.point));
      point.addEventListener('keydown', event => {
        if (!['Enter', ' '].includes(event.key)) return;
        event.preventDefault(); highlight(point.dataset.point);
        chart.querySelector(`[data-point="${point.dataset.point}"]`).focus();
      });
      point.addEventListener('mouseenter', () => describeModel(point.dataset.point));
      point.addEventListener('focus', () => describeModel(point.dataset.point));
    });
    if (selected) describeModel(selected);
    else detail.textContent = 'Select a model to highlight it and see its exact values.';
  }

  xButtons.forEach(button => button.addEventListener('click', () => {
    xKey = button.dataset.chartX;
    xButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));
  yButtons.forEach(button => button.addEventListener('click', () => {
    yKey = button.dataset.chartY;
    yButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));
  modelButtons.forEach(button => button.addEventListener('click', () => highlight(button.dataset.chartModel)));
  render();
})();
