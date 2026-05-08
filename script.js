/**
 * THE VELVET ALCHEMIST — script.js
 * Funcionalidades:
 *  1. Toast "Bom apetite! Prepare o café!" (index.html)
 *  2. Animação de entrada dos elementos via IntersectionObserver
 *  3. Validação e envio do formulário de contato (contato.html)
 */

/* ========================================================
   1. TOAST — "Bom apetite! Prepare o café!"
   ======================================================== */
(function initToast() {
  const btn = document.getElementById('btn-bon-appetit');
  const overlay = document.getElementById('toast-overlay');
  if (!btn || !overlay) return;

  /** Abre o toast */
  function openToast() {
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('is-visible');
    overlay.focus();

    // Fecha automaticamente após 3,5 s
    setTimeout(closeToast, 3500);
  }

  /** Fecha o toast */
  function closeToast() {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    btn.focus();
  }

  btn.addEventListener('click', openToast);

  // Fecha ao clicar fora do card
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.closest('.toast-card')) {
      closeToast();
    }
  });

  // Fecha com Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-visible')) {
      closeToast();
    }
  });
})();


/* ========================================================
   2. SCROLL ANIMATIONS (IntersectionObserver)
   ======================================================== */
(function initScrollAnimations() {
  // Adiciona classe CSS base para os elementos animáveis
  const style = document.createElement('style');
  style.textContent = `
    .fade-up {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .fade-up.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Seleciona os elementos que receberão a animação
  const targets = document.querySelectorAll(
    '.section__header, .ing-col, .steps-list li, .glaze-image-wrap, ' +
    '.contact-form-wrap, .contact-info__block, .cta-section__inner'
  );

  targets.forEach(function (el) {
    el.classList.add('fade-up');
  });

  // Observador
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();


/* ========================================================
   3. FORMULÁRIO DE CONTATO — validação + feedback
   ======================================================== */
(function initContactForm() {
  var form = document.getElementById('contact-form');
  var successBox = document.getElementById('form-success');
  if (!form) return;

  /* --- helpers --- */
  function getField(id) { return document.getElementById(id); }
  function getError(id) { return document.getElementById(id + '-error'); }

  function setError(id, msg) {
    var field = getField(id);
    var error = getError(id);
    if (!field || !error) return;
    error.textContent = msg;
    if (msg) {
      field.classList.add('is-invalid');
      field.setAttribute('aria-describedby', id + '-error');
    } else {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-describedby');
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* --- validação --- */
  function validate() {
    var valid = true;

    var name = getField('name');
    if (!name || name.value.trim().length < 2) {
      setError('name', 'Por favor, informe seu nome completo.');
      valid = false;
    } else {
      setError('name', '');
    }

    var email = getField('email');
    if (!email || !validateEmail(email.value.trim())) {
      setError('email', 'Por favor, informe um e-mail válido.');
      valid = false;
    } else {
      setError('email', '');
    }

    var message = getField('message');
    if (!message || message.value.trim().length < 10) {
      setError('message', 'Por favor, escreva uma mensagem com pelo menos 10 caracteres.');
      valid = false;
    } else {
      setError('message', '');
    }

    return valid;
  }

  /* --- live validation (ao sair do campo) --- */
  ['name', 'email', 'message'].forEach(function (id) {
    var field = getField(id);
    if (!field) return;
    field.addEventListener('blur', function () {
      validate(); // re-valida todo o form para limpar erros corretamente
    });
  });

  /* --- submit --- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validate()) return;

    var submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.textContent = 'Enviando…';
      submitBtn.disabled = true;
    }

    // Simula um envio assíncrono (substitua por fetch real se desejar)
    setTimeout(function () {
      form.hidden = true;
      if (successBox) {
        successBox.hidden = false;
        successBox.focus();
      }
    }, 1200);
  });
})();
