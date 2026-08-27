(function () {
    'use strict';

    const REPO = 'https://github.com/diego-ruas/maleta.dev';

    // Toast
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }
    let toastTimer;
    function showToast(message, iconClass) {
        toast.replaceChildren();
        const icon = document.createElement('i');
        icon.setAttribute('aria-hidden', 'true');
        icon.className = 'ph ' + (iconClass || 'ph-check-circle');
        const text = document.createElement('span');
        text.textContent = message;
        toast.append(icon, text);
        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Copiar comando (botoes .cmd-copy e [data-copy])
    function copyText(text, btn) {
        const done = () => showToast('Comando copiado!', 'ph-clipboard-text');
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done).catch(() => fallback());
        } else {
            fallback();
        }
        function fallback() {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'absolute';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                done();
            } catch (e) {
                showToast('Nao foi possivel copiar', 'ph-warning');
            }
            ta.remove();
        }
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                const original = icon.className;
                icon.className = 'ph ph-check';
                setTimeout(() => { icon.className = original; }, 1500);
            }
        }
    }

    document.querySelectorAll('[data-copy], .cmd-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.copy) {
                copyText(btn.dataset.copy, btn);
                return;
            }
            const code = btn.parentElement.querySelector('code');
            copyText(code ? code.textContent : '', btn);
        });
    });

    // Filtro de skills: busca + categoria (AND)
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid) {
        const cards = Array.from(skillsGrid.querySelectorAll('.skill-card'));
        const chips = Array.from(document.querySelectorAll('.filter-btn[data-filter]'));
        const search = document.getElementById('skills-search');
        const countEl = document.getElementById('skills-count');
        const emptyEl = document.getElementById('skills-empty');
        let activeCat = 'all';

        function applySkillFilter() {
            const q = search.value.trim().toLowerCase();
            let shown = 0;
            cards.forEach(card => {
                const matchCat = activeCat === 'all' || card.dataset.category === activeCat;
                const matchQ = !q || card.textContent.toLowerCase().includes(q) ||
                    (card.dataset.desc && card.dataset.desc.toLowerCase().includes(q));
                const show = matchCat && matchQ;
                card.hidden = !show;
                if (show) shown++;
            });
            countEl.textContent = shown + (shown === 1 ? ' skill' : ' skills');
            emptyEl.hidden = shown !== 0;
        }

        chips.forEach(chip => chip.addEventListener('click', () => {
            chips.forEach(c => {
                const active = c === chip;
                c.classList.toggle('active', active);
                c.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            activeCat = chip.dataset.filter;
            applySkillFilter();
        }));
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                search.value = '';
                activeCat = 'all';
                chips.forEach(c => {
                    const active = c.dataset.filter === 'all';
                    c.classList.toggle('active', active);
                    c.setAttribute('aria-pressed', active ? 'true' : 'false');
                });
                applySkillFilter();
            });
        }
        search.addEventListener('input', applySkillFilter);
        applySkillFilter();

        // Selecao personalizada (quais skills instalar)
        const STORE_KEY = 'aitoolkit-selected-skills';
        const personalizeToggle = document.getElementById('personalize-toggle');
        const selectionControls = document.getElementById('selection-controls');
        const selectionCountEl = document.getElementById('selection-count');
        const selectAllBtn = document.getElementById('select-all');
        const selectNoneBtn = document.getElementById('select-none');
        const downloadBtn = document.getElementById('download-selection');
        const copyBtn = document.getElementById('copy-command');

        function cardName(card) {
            for (const node of card.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    return node.textContent.trim();
                }
            }
            return '';
        }

        let selected = new Set();
        try {
            const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
            if (Array.isArray(saved)) {
                const valid = new Set(cards.map(cardName));
                selected = new Set(saved.filter(n => valid.has(n)));
            }
        } catch (e) { /* ignore */ }

        function persistSelection() {
            try { localStorage.setItem(STORE_KEY, JSON.stringify([...selected])); } catch (e) { }
        }

        function renderChecks() {
            cards.forEach(card => {
                const name = cardName(card);
                let cb = card.querySelector('.skill-check');
                if (!cb) {
                    cb = document.createElement('input');
                    cb.type = 'checkbox';
                    cb.className = 'skill-check';
                    cb.setAttribute('aria-label', 'Selecionar ' + name);
                    cb.addEventListener('change', () => {
                        if (cb.checked) selected.add(name); else selected.delete(name);
                        card.classList.toggle('selected', cb.checked);
                        persistSelection();
                        updateSelectionCount();
                    });
                    card.prepend(cb);
                }
                cb.checked = selected.has(name);
                card.classList.toggle('selected', selected.has(name));
            });
        }

        function removeChecks() {
            cards.forEach(card => {
                const cb = card.querySelector('.skill-check');
                if (cb) cb.remove();
                card.classList.remove('selected');
            });
        }

        function updateSelectionCount() {
            const can = selected.size > 0;
            selectionCountEl.textContent = selected.size + ' de ' + cards.length + ' selecionadas';
            downloadBtn.disabled = !can;
            copyBtn.disabled = !can;
        }

        function setSelecting(on) {
            skillsGrid.classList.toggle('selecting', on);
            selectionControls.hidden = !on;
            personalizeToggle.querySelector('span').textContent = on ? 'Fechar personalização' : 'Personalizar seleção';
            cards.forEach(c => { c.tabIndex = on ? -1 : 0; });
            if (on) { renderChecks(); } else { removeChecks(); }
            updateSelectionCount();
        }

        function toggleSelect(name, card) {
            if (selected.has(name)) selected.delete(name); else selected.add(name);
            if (card) {
                const cb = card.querySelector('.skill-check');
                if (cb) cb.checked = selected.has(name);
                card.classList.toggle('selected', selected.has(name));
            }
            persistSelection();
            updateSelectionCount();
        }

        personalizeToggle.addEventListener('click', () => setSelecting(!skillsGrid.classList.contains('selecting')));
        selectAllBtn.addEventListener('click', () => {
            cards.forEach(c => selected.add(cardName(c)));
            persistSelection(); renderChecks(); updateSelectionCount();
        });
        selectNoneBtn.addEventListener('click', () => {
            selected.clear();
            persistSelection(); renderChecks(); updateSelectionCount();
        });
        downloadBtn.addEventListener('click', () => {
            if (!selected.size) { showToast('Selecione ao menos uma skill', 'ph-warning'); return; }
            const content = '# Maleta.dev — skills selecionadas\n# Salve como claude/skills-selection.txt no repo clonado e rode claude/install.ps1\n' +
                [...selected].sort().join('\n');
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'skills-selection.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showToast('skills-selection.txt baixado', 'ph-download-simple');
        });
        copyBtn.addEventListener('click', () => {
            if (!selected.size) { showToast('Selecione ao menos uma skill', 'ph-warning'); return; }
            const list = [...selected].sort().map(n => "'" + n.replace(/'/g, "''") + "'").join(', ');
            const cmd = '$s = @(' + list + '); New-Item -ItemType Directory "$env:USERPROFILE\\.claude\\skills" -Force | Out-Null; foreach ($n in $s) { Copy-Item ".\\claude\\skills\\$n" "$env:USERPROFILE\\.claude\\skills\\$n" -Recurse -Force }';
            copyText(cmd, copyBtn);
        });

        // Tooltip por toque nas skills (hover sozinho nao funciona no touch)
        function closeSkillTip() {
            document.querySelectorAll('.skill-card.tip-open').forEach(c => c.classList.remove('tip-open'));
        }
        skillsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.skill-card');
            if (!card) {
                closeSkillTip();
                return;
            }
            if (skillsGrid.classList.contains('selecting')) {
                toggleSelect(cardName(card), card);
                return;
            }
            const wasOpen = card.classList.contains('tip-open');
            closeSkillTip();
            if (!wasOpen) card.classList.add('tip-open');
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.skills-grid')) closeSkillTip();
        });
    }

    // Toggle de tema no fim da nav
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const toggleLi = document.createElement('li');
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.type = 'button';
        const setIcon = () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const label = isLight ? 'Ativar tema escuro' : 'Ativar tema claro';
            themeToggle.innerHTML = `<i aria-hidden="true" class="ph ${isLight ? 'ph-moon' : 'ph-sun'}"></i>`;
            themeToggle.setAttribute('aria-label', label);
            themeToggle.setAttribute('title', label);
        };
        setIcon();
        themeToggle.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            setIcon();
        });
        toggleLi.appendChild(themeToggle);
        navLinks.appendChild(toggleLi);
    }

    // Highlight das palavras do hero
    const highlights = document.querySelectorAll('.highlight-word');
    highlights.forEach((el, i) => {
        setTimeout(() => el.classList.add('active'), 400 + i * 600);
        setTimeout(() => el.classList.remove('active'), 3400 + i * 600);
    });

    // Scroll reveal
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    }
})();
