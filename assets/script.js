const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting){
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.surge').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.06) + 's';
  observador.observe(el);
});
