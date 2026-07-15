

const niaForm = document.getElementById('niaContactForm');

if (niaForm) {
  const nameInput = document.getElementById('cfName');
  const contactInput = document.getElementById('cfContact');
  const msgInput = document.getElementById('cfMsg');
  const submitBtn = niaForm.querySelector('.cf-submit');
  const errorBox = document.getElementById('cfError');

  // ─── Reglas de validación ───
  const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü\s'-]+$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-zÀ-ÿ]{2,}$/;
  const PHONE_REGEX = /^\+?\d{8,15}$/;

  function setFieldState(input, message) {
    const field = input.closest('.cf-field');
    if (!field) return;
    let errorEl = field.querySelector('.cf-field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'cf-field-error';
      field.appendChild(errorEl);
    }
    errorEl.textContent = message || '';
    field.classList.toggle('invalid', Boolean(message));
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (!value) return setFieldState(nameInput, 'Ingresa tu nombre.'), false;
    if (!NAME_REGEX.test(value)) return setFieldState(nameInput, 'Solo letras, sin números ni símbolos.'), false;
    setFieldState(nameInput, '');
    return true;
  }

  function validateContact() {
    const value = contactInput.value.trim();
    if (!value) return setFieldState(contactInput, 'Ingresa tu correo o WhatsApp.'), false;

    if (value.includes('@')) {
      if (!EMAIL_REGEX.test(value)) {
        setFieldState(contactInput, 'Correo inválido — revisa el @ y el dominio (ej: nombre@correo.com).');
        return false;
      }
    } else {
      const digitsOnly = value.replace(/[\s()-]/g, '');
      if (!PHONE_REGEX.test(digitsOnly)) {
        setFieldState(contactInput, 'Ingresa solo números (8 a 15 dígitos), o un correo con @.');
        return false;
      }
    }
    setFieldState(contactInput, '');
    return true;
  }

  function validateMessage() {
    const value = msgInput.value.trim();
    if (value.length < 10) return setFieldState(msgInput, 'Cuéntanos un poco más (mínimo 10 caracteres).'), false;
    setFieldState(msgInput, '');
    return true;
  }

  // ─── Saneado en vivo del campo nombre: descarta números/símbolos al tipear ───
  nameInput.addEventListener('input', () => {
    const cleaned = nameInput.value.replace(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü\s'-]/g, '');
    if (cleaned !== nameInput.value) nameInput.value = cleaned;
  });

  // ─── Validación al perder foco + revalidación mientras corrige ───
  [[nameInput, validateName], [contactInput, validateContact], [msgInput, validateMessage]]
    .forEach(([input, validator]) => {
      input.addEventListener('blur', validator);
      input.addEventListener('input', () => {
        if (input.closest('.cf-field').classList.contains('invalid')) validator();
      });
    });

  // ─── Envío ───
  niaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validations = [validateName(), validateContact(), validateMessage()];
    if (validations.includes(false)) {
      const firstInvalid = niaForm.querySelector('.cf-field.invalid input, .cf-field.invalid textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Honeypot anti-spam: si un bot llenó este campo oculto, se descarta en silencio
    const honeypot = niaForm.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) return;

    errorBox.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    try {
      const res = await fetch(niaForm.action, {
        method: 'POST',
        body: new FormData(niaForm),
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error(`Respuesta no válida del servidor (${res.status})`);

      niaForm.style.display = 'none';
      document.getElementById('cfSuccess').classList.add('show');
    } catch (err) {
      errorBox.textContent = 'Algo salió mal. Escríbenos directo por WhatsApp o correo.';
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar solicitud →';
    }
  });
}
