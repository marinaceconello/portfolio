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
