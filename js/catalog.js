// Практики 15–16: обычные функции работы с числами, объектами и массивами.
function formatPrice(price) { return price.toLocaleString('ru-RU') + ' ₽'; }
function calculateDiscount(price, discountPercent) { return price * discountPercent / 100; }
function calculateFinalPrice(price, discountPercent) { return price - calculateDiscount(price, discountPercent); }
function getProductStatus(product) { return product.isAvailable ? 'В наличии' : 'Нет в наличии'; }
function createProductSummary(product) {
  return product.title + ': ' + formatPrice(calculateFinalPrice(product.price, product.discountPercent)) + ', ' + getProductStatus(product);
}
function getProductTitles(items) { return items.map(product => product.title); }
function getAvailableProducts(items) { return items.filter(product => product.isAvailable); }
function searchProducts(items, query) {
  return items.filter(product => product.title.toLowerCase().includes(query.trim().toLowerCase()));
}
function filterProductsByCategory(items, category) {
  return category === 'all' ? items : items.filter(product => product.category === category);
}
function sortProductsByPrice(items, direction = 'asc') {
  return [...items].sort((a, b) => direction === 'desc' ? b.price - a.price : a.price - b.price);
}
function findProductById(items, id) { return items.find(product => product.id === id); }
function calculateTotalPrice(items) { return items.reduce((sum, product) => sum + product.price, 0); }
function countAvailableProducts(items) { return getAvailableProducts(items).length; }
function calculateAveragePrice(items) { return items.length ? Math.round(calculateTotalPrice(items) / items.length) : 0; }
function getPreparedProducts(items, query, category, direction) {
  return sortProductsByPrice(filterProductsByCategory(searchProducts(items, query), category), direction);
}

// Практика 17: элементы создаются средствами DOM, текст — через textContent.
function createProductCard(product) {
  const card = document.createElement('article');
  card.classList.add('product-card');
  const title = document.createElement('h3');
  title.classList.add('product-card__title');
  title.textContent = product.title;
  const image = document.createElement('img');
  image.classList.add('product-card__image');
  image.src = product.image;
  image.alt = product.title;
  image.width = 640;
  image.height = 640;
  image.loading = 'lazy';
  const price = document.createElement('p');
  price.textContent = 'Цена: ' + formatPrice(calculateFinalPrice(product.price, product.discountPercent));
  const status = document.createElement('p');
  status.textContent = getProductStatus(product);
  const actions = document.createElement('div');
  actions.classList.add('product-card__actions');
  const details = document.createElement('a');
  details.classList.add('button', 'button--primary');
  details.href = 'product.html';
  details.textContent = 'Описание';
  const order = document.createElement('button');
  order.classList.add('button', 'button--primary', 'product-card__button');
  order.type = 'button';
  order.dataset.product = product.title;
  order.textContent = 'Заказать';
  order.disabled = !product.isAvailable;
  actions.append(details, order);
  card.append(title, image, price, status, actions);
  return card;
}
function renderProducts(items) {
  const container = document.querySelector('#catalog-products');
  container.replaceChildren();
  items.forEach(product => container.append(createProductCard(product)));
  document.querySelector('#catalog-count').textContent = 'Найдено товаров: ' + items.length;
  document.querySelector('#catalog-empty').hidden = items.length !== 0;
}
const catalogControls = document.querySelector('#catalog-controls');
if (catalogControls) {
  function updateCatalog() {
    renderProducts(getPreparedProducts(products, catalogControls.elements.query.value,
      catalogControls.elements.category.value, catalogControls.elements.sort.value));
  }
  catalogControls.addEventListener('input', updateCatalog);
  catalogControls.addEventListener('change', updateCatalog);
  catalogControls.addEventListener('submit', event => { event.preventDefault(); updateCatalog(); });
  updateCatalog();
}
