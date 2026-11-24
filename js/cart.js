// Корзина хранит только id и количество. Данные товаров берутся из products.
let cart = [];
try {
  const saved = JSON.parse(localStorage.getItem('shop-cart') || '[]');
  if (Array.isArray(saved)) {
    cart = saved.filter(item => {
      const product = findProductById(products, item.id);
      return product && product.isAvailable && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99;
    });
  }
} catch (error) {
  cart = [];
}
function saveCart() {
  try { localStorage.setItem('shop-cart', JSON.stringify(cart)); }
  catch (error) { /* При недоступном хранилище корзина работает до перехода со страницы. */ }
}
let promoPercent = 0;

function calculateCartTotal() {
  return cart.reduce((sum, item) => {
    const product = findProductById(products, item.id);
    const price = calculateFinalPrice(product.price, product.discountPercent);
    return sum + price * item.quantity;
  }, 0);
}

function renderCart() {
  const container = document.querySelector('#cart-items');
  if (!container) return;
  container.replaceChildren();
  cart.forEach(item => {
    const product = findProductById(products, item.id);
    const row = document.createElement('article');
    row.classList.add('cart-item');
    const title = document.createElement('h2');
    title.textContent = product.title;
    const price = calculateFinalPrice(product.price, product.discountPercent);
    const description = document.createElement('p');
    description.textContent = formatPrice(price) + ' за штуку. Сумма: ' + formatPrice(price * item.quantity);
    const label = document.createElement('label');
    label.htmlFor = 'quantity-' + item.id;
    label.textContent = 'Количество';
    const quantity = document.createElement('input');
    quantity.id = label.htmlFor;
    quantity.type = 'number';
    quantity.min = 1;
    quantity.max = 99;
    quantity.step = 1;
    quantity.value = item.quantity;
    quantity.addEventListener('change', () => {
      if (!quantity.reportValidity()) return;
      if (item.quantity === Number(quantity.value)) return;
      item.quantity = Number(quantity.value);
      saveCart();
      renderCart();
      document.querySelector('#quantity-' + item.id).focus();
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.classList.add('button', 'button--secondary');
    remove.textContent = 'Удалить';
    remove.setAttribute('aria-label', 'Удалить: ' + product.title);
    remove.addEventListener('click', () => {
      cart = cart.filter(entry => entry.id !== item.id);
      saveCart();
      renderCart();
    });
    row.append(title, description, label, quantity, remove);
    container.append(row);
  });
  const total = calculateCartTotal();
  const discount = calculateDiscount(total, promoPercent);
  document.querySelector('#cart-total').textContent =
    'Сумма: ' + formatPrice(total) + '. Скидка по промокоду: ' + formatPrice(discount) +
    '. Итого: ' + formatPrice(total - discount);
  document.querySelector('#cart-empty').hidden = cart.length > 0;
  document.querySelector('#cart-order').hidden = cart.length === 0;
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-cart-id]');
  if (!button) return;
  const id = Number(button.dataset.cartId);
  const product = findProductById(products, id);
  if (!product || !product.isAvailable) return;
  const item = cart.find(entry => entry.id === id);
  if (item && item.quantity < 99) item.quantity += 1;
  else if (!item) cart.push({id, quantity: 1});
  saveCart();
  button.textContent = 'В корзине';
});
renderCart();

const promoForm = document.querySelector('#promo-form');
if (promoForm) {
  promoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const code = document.querySelector('#promo-code').value.trim().toUpperCase();
    const message = document.querySelector('#promo-message');
    promoPercent = 0;
    if (code === 'STUDENT10') {
      promoPercent = 10;
      message.textContent = 'Промокод применён: скидка 10%.';
    } else if (code === '') {
      message.textContent = 'Промокод убран.';
    } else {
      message.textContent = 'Такого промокода нет.';
    }
    renderCart();
  });
}
