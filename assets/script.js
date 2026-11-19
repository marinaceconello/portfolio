const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting){
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// agrupa os elementos .surge por "vizinhança" (mesmo grid/contêiner pai) pra que
// o stagger reinicie a cada seção, em vez de acumular delay pela página inteira
const grupos = new Map();
document.querySelectorAll('.surge').forEach((el) => {
  const pai = el.parentElement;
  if (!grupos.has(pai)) grupos.set(pai, []);
  grupos.get(pai).push(el);
});

grupos.forEach((elementos) => {
  elementos.forEach((el, i) => {
    el.style.transitionDelay = (i * 0.09) + 's';
    observador.observe(el);
  });
});

// nos grids de vídeo, alterna leve rotação pra esquerda/direita pra dar mais
// sensação de movimento fluido na entrada
document.querySelectorAll('.videos-grid').forEach((grid) => {
  Array.from(grid.children).forEach((card, i) => {
    card.classList.add(i % 2 === 0 ? 'surge-esq' : 'surge-dir');
  });
});

/* Carrossel dos manuais (Behance): lê slides de media/behance/, clique na imagem abre o Behance */
document.querySelectorAll('.behance-modal').forEach((modal) => {
  const slidesEl = modal.querySelector('.slides');
  const contador = modal.querySelector('.contador');
  const prefixo = modal.dataset.prefixo, max = parseInt(modal.dataset.max, 10), link = modal.dataset.link;
  let slides = [], atual = 0, carregado = false;

  function mostrar(i){
    if (!slides.length) return;
    atual = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('ativo', k === atual));
    contador.textContent = (atual + 1) + ' / ' + slides.length;
  }
  function carregar(){
    if (carregado) return; carregado = true;
    let pendentes = max;
    for (let n = 1; n <= max; n++){
      const img = new Image();
      img.alt = 'Slide ' + n;
      img.onload = () => {
        const d = document.createElement('div'); d.className = 'slide'; d.dataset.ordem = n;
        const a = document.createElement('a'); a.href = link; a.target = '_blank'; a.rel = 'noopener';
        a.appendChild(img); d.appendChild(a); slides.push(d);
        fim();
      };
      img.onerror = fim;
      img.src = prefixo + n + '.jpg';
    }
    function fim(){
      if (--pendentes) return;
      slides.sort((x, y) => x.dataset.ordem - y.dataset.ordem);
      if (!slides.length){
        slidesEl.innerHTML = '<p class="slide-aviso">Slides ainda não adicionados. <a href="' + link + '" target="_blank" rel="noopener">Ver no Behance</a></p>';
        modal.querySelectorAll('.seta').forEach(b => b.style.display = 'none');
        return;
      }
      slides.forEach(s => slidesEl.appendChild(s));
      mostrar(0);
    }
  }
  new MutationObserver(() => { if (modal.classList.contains('aberto')) carregar(); })
    .observe(modal, { attributes: true, attributeFilter: ['class'] });
  modal.querySelector('.ant').onclick = () => mostrar(atual - 1);
  modal.querySelector('.prox').onclick = () => mostrar(atual + 1);
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('aberto')) return;
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
    if (e.key === 'ArrowRight') mostrar(atual + 1);
    if (e.key === 'Escape') modal.classList.remove('aberto');
  });
  let x0 = null;
  slidesEl.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  slidesEl.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) mostrar(atual + (dx < 0 ? 1 : -1));
    x0 = null;
  });
});
