// UI, progress (localStorage), lesson rendering and the test runner.
(() => {
  const T = LESSONS.loops, $ = s => document.querySelector(s);
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const KEY = 'pythonlab.v1';
  let P; try { P = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  P = P || { xp: 0, done: {} };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} };
  const all = [...T.practice, T.build];
  let tab = 'learn', active = null, drafts = {}, hints = {}, timer = null;

  // ---- editor (falls back to a plain textarea if CodeMirror fails to load)
  const cm = window.CodeMirror ? CodeMirror.fromTextArea($('#code'), { mode: 'python', theme: 'material-darker', lineNumbers: true, indentUnit: 4, extraKeys: { Tab: c => c.replaceSelection('    ') } }) : null;
  const getCode = () => cm ? cm.getValue() : $('#code').value;
  const setCode = v => cm ? cm.setValue(v) : ($('#code').value = v);
  const lines = () => $('#inp').value ? $('#inp').value.split('\n') : [];
  const friendly = e => e.includes('EOF when reading') ? 'Your program asked for input but none was left. Type values in the Input box (one per line).' : e;
  function show(r) {
    const o = $('#out'); o.textContent = r.out || '';
    if (r.err) { const s = document.createElement('span'); s.className = 'err'; s.textContent = (r.out ? '\n' : '') + friendly(r.err); o.appendChild(s); }
    else if (!r.out) o.textContent = '(no output)';
  }
  const wait = () => { $('#load').hidden = false; PyRunner.ready().then(() => $('#load').hidden = true); };
  PyRunner.onRestart = wait; wait();

  function open(id, scroll) {
    drafts[active ? active.id : 'free'] = getCode();
    active = id === 'free' ? null : all.find(c => c.id === id);
    setCode(drafts[id] ?? (active ? active.starter : T.freeStarter));
    $('#inp').value = ''; $('#tests').innerHTML = ''; $('#out').textContent = '';
    $('#now').textContent = active ? active.title : 'Free play'; $('#tbtn').hidden = !active;
    if (scroll) $('#workspace').scrollIntoView({ behavior: 'smooth' });
  }
  $('#run').onclick = async () => { $('#out').textContent = 'Running…'; show(await PyRunner.run(getCode(), lines())); };
  $('#clear').onclick = () => { $('#out').textContent = ''; $('#tests').innerHTML = ''; };
  $('#reset').onclick = () => { setCode(active ? active.starter : T.freeStarter); $('#inp').value = ''; };

  // ---- tests: run the real program with each test's input and compare behaviour
  function check(t, r) {
    if (r.timeout) return 'Your program ran too long. Can the loop finish?';
    if (r.err) return friendly(r.err).split('\n').pop();
    const ls = r.out.split('\n').map(s => s.trim()).filter(Boolean);
    if (t.out) {
      if (ls.length !== t.out.length) return `Expected ${t.out.length} line(s) of output but got ${ls.length}.`;
      const k = ls.findIndex((l, i) => l !== t.out[i]);
      if (k >= 0) return `Line ${k + 1}: expected "${t.out[k]}" but got "${ls[k]}".`;
    }
    for (const s of t.has || []) if (!r.out.toLowerCase().includes(s.toLowerCase())) return `Your output should include "${s}".`;
    return '';
  }
  $('#tbtn').onclick = async () => {
    const box = $('#tests'), c = active, code = getCode(); box.innerHTML = 'Running tests…'; let html = '', ok = 0;
    for (const t of c.tests) {
      const m = check(t, await PyRunner.run(code, t.stdin || [])); ok += m ? 0 : 1;
      html += `<li class="${m ? 'bad' : 'ok'}">${m ? '❌' : '✅'} ${esc(t.name || 'Input: ' + ((t.stdin || []).join(', ') || '(none)'))}${m ? '<br><small>' + esc(m) + '</small>' : ''}</li>`;
    }
    box.innerHTML = `<li><b>${ok}/${c.tests.length} tests passed</b></li>` + html;
    if (ok === c.tests.length) complete(c);
  };
  function complete(c) {
    if (P.done[c.id]) return toast('Passed again — XP was already awarded.');
    P.done[c.id] = true; P.xp += c.xp; save();
    toast(`🎉 ${c.title} complete! +${c.xp} XP` + (all.every(x => P.done[x.id]) ? ` · Badge: ${T.badge.name}` : '')); render();
  }
  const toast = m => { const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => t.hidden = true, 4000); };

  // ---- views
  const card = c => { const n = hints[c.id] || 0, d = P.done[c.id]; return `<article class="card ${d ? 'done' : ''}"><span class="tag ${c.level}">${c.level}</span> <b>${c.title}</b> <span class="xpt">${d ? '✅ ' : ''}+${c.xp} XP</span><p>${c.prompt}</p>${c.hints.slice(0, n).map((h, i) => `<p class="hint">💡 Hint ${i + 1}: ${h}</p>`).join('')}<button data-a="open" data-id="${c.id}">Open in editor</button> ${n < c.hints.length ? `<button class="ghost" data-a="hint" data-id="${c.id}">Need a hint? (${n}/${c.hints.length})</button>` : ''}</article>`; };
  const fin = () => all.every(c => P.done[c.id]) ? `<div class="card win"><h3>${T.badge.icon} Badge unlocked: ${T.badge.name}</h3><p>Skills learned:</p><ul>${T.skills.map(s => `<li>${s}</li>`).join('')}</ul><p>${T.next}</p></div>` : '';
  const views = {
    learn: () => `<h2>${T.title}</h2><p>${T.desc}</p><h3>You will learn to</h3><ul>${T.objectives.map(o => `<li>${o}</li>`).join('')}</ul>` +
      T.learn.map((s, i) => `<article class="card"><h3>${s.h}</h3><p>${s.p}</p><pre><code>${esc(s.code)}</code></pre><button data-a="try" data-i="${i}">▶ Run it</button> <button class="ghost" data-a="edit" data-i="${i}">Edit in workspace</button><pre class="mini" id="try${i}" hidden></pre></article>`).join(''),
    explore: () => `<h2>Explore: how range() drives a loop</h2><p>Change the numbers, then press Play to watch the loop visit each value.</p><div class="ctl"><label>start <input id="r0" type="number" value="0"></label><label>stop <input id="r1" type="number" value="5"></label><label>step <input id="r2" type="number" value="1"></label></div><pre id="rcode"></pre><div id="chips"></div><p id="rinfo"></p><button data-a="play">▶ Play</button> <button class="ghost" data-a="rrun">Run this code in Python</button><pre class="mini" id="rout" hidden></pre>`,
    practice: () => `<h2>Practice</h2>${fin()}${T.practice.map(card).join('')}`,
    build: () => `<h2>Build</h2>${fin()}${card(T.build)}`,
    code: () => `<h2>Free Python editor</h2><p>Experiment in the workspace — no rules! Use the Input box for <code>input()</code>.</p><ul><li>Print a times table with a loop</li><li>Make a countdown with <code>while</code></li><li>Loop over your own list</li></ul>`
  };
  // Explore helpers
  const rv = () => { const [a, b, c] = ['r0', 'r1', 'r2'].map(i => parseInt($('#' + i).value)); const v = []; if (![a, b, c].some(isNaN) && c) for (let x = a; c > 0 ? x < b : x > b; x += c) { v.push(x); if (v.length >= 40) break; } return { a, b, c, v }; };
  function rangeUI() {
    clearInterval(timer); const { a, b, c, v } = rv();
    $('#rcode').textContent = `for i in range(${a}, ${b}, ${c}):\n    print(i)`;
    $('#chips').innerHTML = v.map(x => `<span class="chip">${x}</span>`).join('');
    $('#rinfo').textContent = !c ? 'step cannot be 0 — Python raises a ValueError.' : v.length ? `The loop runs ${v.length} time(s).` : 'range is empty, so the loop body never runs.';
  }
  function play() {
    rangeUI(); const { v } = rv(), chips = [...document.querySelectorAll('.chip')]; let k = 0;
    timer = setInterval(() => {
      chips.forEach(x => x.classList.remove('on'));
      if (k >= v.length) { clearInterval(timer); $('#rinfo').textContent = 'Loop finished — the range ran out.'; return; }
      chips[k].classList.add('on'); $('#rinfo').textContent = `Iteration ${k + 1}: i = ${v[k]}`; k++;
    }, 500);
  }
  $('#content').oninput = e => /^r[012]$/.test(e.target.id) && rangeUI();
  $('#content').onclick = async e => {
    const b = e.target.closest('button'); if (!b) return; const a = b.dataset.a, i = +b.dataset.i;
    if (a === 'try') { const o = $('#try' + i); o.hidden = false; o.textContent = 'Running…'; const r = await PyRunner.run(T.learn[i].code); o.textContent = (r.out || '') + (r.err ? friendly(r.err) : ''); }
    else if (a === 'edit') { open('free', true); setCode(T.learn[i].code); }
    else if (a === 'open') open(b.dataset.id, true);
    else if (a === 'hint') { hints[b.dataset.id] = (hints[b.dataset.id] || 0) + 1; render(); }
    else if (a === 'play') play();
    else if (a === 'rrun') { const o = $('#rout'); o.hidden = false; o.textContent = 'Running…'; const r = await PyRunner.run($('#rcode').textContent); o.textContent = (r.out || '') + (r.err ? friendly(r.err) : ''); }
  };
  function render() {
    clearInterval(timer); $('#content').innerHTML = views[tab]();
    document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
    if (tab === 'explore') rangeUI();
    const n = all.filter(c => P.done[c.id]).length;
    $('#lvl').textContent = 'Level ' + (Math.floor(P.xp / 100) + 1); $('#xp').textContent = P.xp + ' XP'; $('#bar').style.width = (P.xp % 100) + '%';
    $('#prog').textContent = `${n}/${all.length} challenges` + (n === all.length ? ` · ${T.badge.icon} ${T.badge.name}` : '');
  }
  $('#tabs').onclick = e => { const t = e.target.dataset.t; if (!t) return; tab = t; if (t === 'code') open('free'); render(); };
  $('#wipe').onclick = () => { if (confirm('Erase all XP and progress on this device?')) { P = { xp: 0, done: {} }; save(); render(); } };
  setCode(T.freeStarter); render();
})();
