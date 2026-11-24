// Возвращаем текст ошибки. Пустая строка означает, что поле заполнено верно.
function getFieldError(field) {
  const value = field.value.trim();
  if (field.type === 'checkbox') {
    if (field.required && !field.checked) return 'Подтвердите согласие.';
    return '';
  }
  if (field.required && value === '') return 'Заполните обязательное поле.';
  if (value === '') return '';
  if (field.name === 'name' && value.length < 2) return 'Введите имя не короче двух символов.';
  if (field.type === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return 'Введите корректный e-mail.';
  }
  if (field.type === 'tel') {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11) return 'Телефон должен содержать 11 цифр.';
    if (digits[0] !== '7' && digits[0] !== '8') return 'Начните номер с 7 или 8.';
  }
  if (!field.validity.valid) return field.validationMessage;
  return '';
}
function validateField(field) {
  const message = getFieldError(field);
  const error = document.getElementById(field.id + '-error');
  error.textContent = message;
  error.hidden = message === '';
  field.classList.toggle('is-invalid', message !== '');
  if (message !== '') field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
  return message === '';
}
const forms = document.querySelectorAll('.order-form, .contact-form');
for (const form of forms) {
  form.noValidate = true;
  const fields = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
  for (const field of fields) {
    const error = document.createElement('p');
    error.id = field.id + '-error';
    error.classList.add('form-error');
    error.hidden = true;
    field.insertAdjacentElement('afterend', error);
    const hint = field.getAttribute('aria-describedby') || '';
    field.setAttribute('aria-describedby', (hint + ' ' + error.id).trim());
    field.addEventListener('input', function () { validateField(field); });
    field.addEventListener('change', function () { validateField(field); });
  }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const success = document.querySelector('#success-message');
    success.hidden = true;
    let firstError = null;
    for (const field of fields) {
      if (!validateField(field) && firstError === null) firstError = field;
    }
    if (firstError !== null) {
      firstError.focus();
      return;
    }
    const dialog = form.closest('dialog');
    if (dialog) dialog.close();
    form.reset();
    success.textContent = 'Форма успешно заполнена. Учебный проект: данные никуда не отправлены.';
    success.hidden = false;
    success.focus();
  });
}
