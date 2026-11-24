// Базовая клиентская проверка существующих форм, без отправки на сервер.
document.querySelectorAll('.order-form, .contact-form').forEach(form => {
  form.noValidate = true;
  const fields = [...form.querySelectorAll('input:not([type="hidden"]), select, textarea')];
  fields.forEach(field => {
    const error = document.createElement('p');
    error.classList.add('form-error');
    error.id = field.id + '-error';
    error.hidden = true;
    field.insertAdjacentElement('afterend', error);
    field.setAttribute('aria-describedby', ((field.getAttribute('aria-describedby') || '') + ' ' + error.id).trim());
    function validate() {
      let message = '';
      const value = field.value.trim();
      if (field.required && (field.type === 'checkbox' ? !field.checked : !value)) message = 'Заполните обязательное поле.';
      else if (field.name === 'name' && value.length < 2) message = 'Имя должно содержать не менее двух символов.';
      else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Введите корректный e-mail.';
      else if (field.type === 'tel' && value && value.replace(/\D/g, '').length !== 11) message = 'Введите телефон из 11 цифр, включая код страны.';
      else if (!field.validity.valid) message = field.validationMessage;
      error.textContent = message;
      error.hidden = !message;
      field.classList.toggle('is-invalid', Boolean(message));
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
      return !message;
    }
    field.validateField = validate;
    field.addEventListener('input', validate);
    field.addEventListener('change', validate);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const success = document.querySelector('#success-message');
    success.hidden = true;
    const valid = fields.map(field => field.validateField()).every(Boolean);
    if (!valid) { fields.find(field => field.hasAttribute('aria-invalid')).focus(); return; }
    const dialog = form.closest('dialog');
    if (dialog) dialog.close();
    form.reset();
    success.textContent = 'Форма успешно заполнена. Учебный проект: данные никуда не отправлены.';
    success.hidden = false;
    success.focus();
  });
});
