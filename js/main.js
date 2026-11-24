// Общие действия: делегирование позволяет открывать окно и после повторного рендера.
const orderDialog = document.querySelector('#order-dialog');
if (orderDialog) {
  document.addEventListener('click', event => {
    const button = event.target.closest('.product-card__button');
    if (button) {
      document.querySelector('#selected-product').value = button.dataset.product;
      orderDialog.showModal();
    }
  });
  document.querySelector('#close-order-dialog').addEventListener('click', () => orderDialog.close());
}
console.log('Объект товара:', products[0]);
console.log('Цена:', formatPrice(products[0].price));
console.log('Размер скидки:', calculateDiscount(2500, 20));
console.log('Итоговая цена:', calculateFinalPrice(2500, 20));
console.log('Статус:', getProductStatus(products[0]));
console.log('Описание:', createProductSummary(products[0]));
console.log('Названия:', getProductTitles(products));
console.table(getAvailableProducts(products));
console.table(searchProducts(products, 'пенал'));
console.table(filterProductsByCategory(products, 'everyday'));
console.table(sortProductsByPrice(products, 'desc'));
console.log('По id:', findProductById(products, 1));
console.log('Сумма:', calculateTotalPrice(products));
console.log('В наличии:', countAvailableProducts(products));
console.log('Средняя цена:', calculateAveragePrice(products));
console.table(getPreparedProducts(products, '', 'unusual', 'asc'));
const output = document.querySelector('.product-output');
if (output) output.textContent = createProductSummary(products[0]) + '. Всего товаров: ' + products.length +
  '. В наличии: ' + countAvailableProducts(products) + '. Средняя цена: ' + formatPrice(calculateAveragePrice(products));
