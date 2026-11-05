/* LP do AUVP Private Day 2027 */
(function () {
    var raiz = document.documentElement;
    var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var porId = function (id) { return document.getElementById(id); };
    var todos = function (seletor) { return Array.prototype.slice.call(document.querySelectorAll(seletor)); };

    /* ========== Clarity: fila criada pelo snippet no <head> ========== */
    var tag = function (chave, valor) { if (window.clarity && valor) window.clarity('set', chave, String(valor).slice(0, 255)); };
    var evento = function (nome) { if (window.clarity) window.clarity('event', nome); };
    var prioriza = function (motivo) { if (window.clarity) window.clarity('upgrade', motivo); };

    /* ========== Menu do celular ========== */
    var navbar = porId('navbar');
    var botaoMenu = porId('mobile-menu-btn');
    var menu = porId('mobile-menu');
    var menuAberto = function () { return !menu.classList.contains('hidden'); };
    var alternaMenu = function (abrir) {
        menu.classList.toggle('hidden', !abrir);
        botaoMenu.setAttribute('aria-expanded', abrir ? 'true' : 'false');
        botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
        botaoMenu.querySelector('use').setAttribute('href', abrir ? '#i-fechar' : '#i-lista');
        if (abrir) navbar.classList.remove('compacto');
    };
    botaoMenu.addEventListener('click', function () { alternaMenu(!menuAberto()); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { alternaMenu(false); }); });

    /* ========== O segredo do topo: a festa abre a partir do sol ou da frase em destaque ========== */
    var segredo = porId('segredo');
    var segredoSol = porId('segredo-sol');
    var segredoFrase = porId('segredo-frase');
    var segredoVer = porId('segredo-ver');
    var segredoFechar = porId('segredo-fechar');
    var alternaSegredo = function (abrir, origem) {
        if (abrir) {
            var h = segredo.getBoundingClientRect(), o = origem.getBoundingClientRect();
            segredo.style.setProperty('--x', (o.left + o.width / 2 - h.left) + 'px');
            segredo.style.setProperty('--y', (o.top + o.height / 2 - h.top) + 'px');
        }
        segredo.classList.toggle('aberto', abrir);
        segredo.setAttribute('aria-hidden', abrir ? 'false' : 'true');
        [segredoSol, segredoFrase].forEach(function (el) { el.setAttribute('aria-expanded', abrir ? 'true' : 'false'); });
        [segredoVer, segredoFechar].forEach(function (el) { el.setAttribute('tabindex', abrir ? '0' : '-1'); });
        if (abrir) segredoFechar.focus({ preventScroll: true });
        agenda();
    };
    [segredoSol, segredoFrase].forEach(function (el) {
        el.addEventListener('click', function () { alternaSegredo(true, el); evento('segredo_aberto'); });
    });
    segredoFechar.addEventListener('click', function () { alternaSegredo(false); segredoSol.focus({ preventScroll: true }); });
    segredoVer.addEventListener('click', function () { setTimeout(function () { alternaSegredo(false); }, 900); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && segredo.classList.contains('aberto')) { alternaSegredo(false); segredoSol.focus({ preventScroll: true }); }
    });

    /* ========== Isopor ========== */
    var isopor = porId('isopor');
    var botaoIsopor = porId('isopor-botao');
    var abreIsopor = function (abrir) {
        isopor.classList.toggle('aberto', abrir);
        botaoIsopor.setAttribute('aria-expanded', abrir ? 'true' : 'false');
        botaoIsopor.setAttribute('aria-label', abrir ? 'Fechar o isopor' : 'Abrir o isopor');
    };
    if (semMovimento) abreIsopor(true);
    botaoIsopor.addEventListener('click', function () { abreIsopor(!isopor.classList.contains('aberto')); evento('isopor_aberto'); });

    /* ========== Surgir ao rolar ========== */
    var surgem = todos('.surge');
    if ('IntersectionObserver' in window) {
        var observaSurgir = new IntersectionObserver(function (itens) {
            itens.forEach(function (i) { if (i.isIntersecting) { i.target.classList.add('visivel'); observaSurgir.unobserve(i.target); } });
        }, { threshold: 0.12 });
        surgem.forEach(function (el) { observaSurgir.observe(el); });
    } else {
        surgem.forEach(function (el) { el.classList.add('visivel'); });
    }

    /* ========== Rolagem: virada, parallax e navegação ========== */
    var virada = porId('virada');
    var comVirada = !semMovimento;
    if (comVirada) raiz.classList.add('com-cola');

    var topo = porId('topo');
    var secoes = todos('main [data-tom], footer[data-tom]');
    var links = todos('.nav-link');
    var marca = document.querySelector('.nav-marca');
    var parallax = semMovimento ? [] : todos('[data-par]');
    var LINHA_DA_BARRA = 44;
    var FOLGA_DO_TOPO = 80;
    var SENSIBILIDADE = 6;
    var ultimoY = window.scrollY;
    var pendente = false;

    /* A demarcação acompanha o item atual, inclusive enquanto a barra muda de largura */
    var posicionaMarca = function () {
        var atual = document.querySelector('.nav-link.atual');
        marca.classList.toggle('ativa', !!atual);
        if (!atual) return;
        marca.style.setProperty('--x', atual.offsetLeft + 'px');
        marca.style.setProperty('--w', atual.offsetWidth + 'px');
    };

    var marcaLinkAtual = function (id) {
        var mudou = false;
        links.forEach(function (l) {
            var eAtual = l.getAttribute('data-secao') === id;
            if (l.classList.contains('atual') !== eAtual) mudou = true;
            l.classList.toggle('atual', eAtual);
            if (eAtual) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
        });
        if (mudou) posicionaMarca();
    };

    var atualiza = function () {
        pendente = false;
        var alturaTela = window.innerHeight;
        var y = window.scrollY;

        /* Barra: encolhe ao descer e abre ao subir ou perto do topo */
        var delta = y - ultimoY;
        if (y < FOLGA_DO_TOPO) {
            navbar.classList.remove('compacto');
            ultimoY = y;
        } else if (Math.abs(delta) >= SENSIBILIDADE) {
            if (!menuAberto()) navbar.classList.toggle('compacto', delta > 0);
            ultimoY = y;
        }

        var progresso = 1;
        if (comVirada) {
            var r = virada.getBoundingClientRect();
            progresso = Math.min(1, Math.max(0, -r.top / (r.height - alturaTela)));
            virada.style.setProperty('--p', progresso.toFixed(3));
        }

        parallax.forEach(function (el) {
            var c = el.parentElement.getBoundingClientRect();
            if (c.bottom < -200 || c.top > alturaTela + 200) return;
            var d = (c.top + c.height / 2 - alturaTela / 2) * parseFloat(el.getAttribute('data-par'));
            el.style.transform = 'translateY(' + d.toFixed(1) + 'px)';
        });

        /* Dobra atrás da barra: define o tom do vidro e o item marcado */
        var ativa = null;
        secoes.forEach(function (s) {
            var b = s.getBoundingClientRect();
            if (b.top <= LINHA_DA_BARRA && b.bottom > LINHA_DA_BARRA) ativa = s;
        });
        if (!ativa) return;
        var tom = ativa.getAttribute('data-tom');
        var id = ativa.getAttribute('data-pertence') || ativa.id;
        if (ativa === topo && segredo.classList.contains('aberto')) tom = 'claro';
        if (ativa === virada && progresso < 0.5) { tom = 'escuro'; id = 'palestras'; }
        navbar.setAttribute('data-tom', tom);
        marcaLinkAtual(id);
    };
    var agenda = function () { if (!pendente) { pendente = true; requestAnimationFrame(atualiza); } };
    window.addEventListener('scroll', agenda, { passive: true });
    window.addEventListener('resize', function () { agenda(); posicionaMarca(); });
    if ('ResizeObserver' in window) new ResizeObserver(posicionaMarca).observe(document.querySelector('.nav-links'));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(posicionaMarca);
    atualiza();

    /* ========== Repasse de UTMs para os links de pagamento (Guru) ========== */
    var linksDeCompra = todos('a[href*="auvpag.com.br/pay/"]');
    var parametros = new URLSearchParams(window.location.search);
    var utmsDaVisita = new URLSearchParams();
    parametros.forEach(function (valor, chave) { if (/^utm_/i.test(chave)) utmsDaVisita.append(chave, valor); });
    var temUtm = Array.from(utmsDaVisita.keys()).length > 0;
    linksDeCompra.forEach(function (link) {
        var url = new URL(link.getAttribute('href'), window.location.href);
        var padrao = new URLSearchParams(url.search);
        var final = new URLSearchParams();
        padrao.forEach(function (valor, chave) { if (!/^utm_/i.test(chave)) final.set(chave, valor); });
        (temUtm ? utmsDaVisita : padrao).forEach(function (valor, chave) { if (/^utm_/i.test(chave)) final.set(chave, valor); });
        url.search = final.toString();
        link.setAttribute('href', url.toString());
    });

    /* ========== Clarity: contexto e eventos ========== */
    tag('pagina', 'private-day-2027');
    tag('dispositivo', window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop');
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (chave) { tag(chave, parametros.get(chave)); });
    try {
        tag('origem', document.referrer ? new URL(document.referrer).hostname : 'direto');
    } catch (e) {
        tag('origem', 'direto');
    }

    linksDeCompra.forEach(function (link) {
        link.addEventListener('click', function () {
            evento('checkout_ingresso_unico');
            prioriza('intencao_de_compra');
        });
    });
    todos('a[href="#ingressos"]').forEach(function (link) { link.addEventListener('click', function () { evento('cta_ver_ingressos'); }); });
    todos('a[href*="form.auvp.com.br"]').forEach(function (link) { link.addEventListener('click', function () { evento('cta_patrocinio'); }); });
    todos('a[href*="api.whatsapp.com"]').forEach(function (link) {
        link.addEventListener('click', function () {
            evento('cta_whatsapp');
            prioriza('contato_whatsapp');
        });
    });
    todos('#faq details').forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (!item.open) return;
            var pergunta = item.querySelector('summary span');
            tag('faq_pergunta', pergunta ? pergunta.textContent.trim() : '');
            evento('faq_aberto');
        });
    });

    /* Profundidade de rolagem: cada marco dispara uma única vez */
    var atingidos = {};
    window.addEventListener('scroll', function () {
        var altura = raiz.scrollHeight - window.innerHeight;
        if (altura <= 0) return;
        var percentual = (window.scrollY / altura) * 100;
        [25, 50, 75, 90].forEach(function (marco) {
            if (percentual >= marco && !atingidos[marco]) {
                atingidos[marco] = true;
                evento('scroll_' + marco);
            }
        });
    }, { passive: true });

    /* Seções-chave realmente vistas */
    if ('IntersectionObserver' in window) {
        [['ingressos', 'secao_ingressos_vista'], ['palestrantes', 'secao_palestrantes_vista']].forEach(function (par) {
            var secao = porId(par[0]);
            if (!secao) return;
            var observador = new IntersectionObserver(function (entradas) {
                entradas.forEach(function (entrada) {
                    if (!entrada.isIntersecting) return;
                    evento(par[1]);
                    observador.disconnect();
                });
            }, { threshold: 0.4 });
            observador.observe(secao);
        });
    }
})();
