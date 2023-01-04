import { searchCep } from './helpers/cepFunctions';
import './style.css';
import { fetchProductsList, fetchProduct } from './helpers/fetchFunctions';
import { createProductElement, createCartProductElement } from './helpers/shopFunctions';
import { getSavedCartIDs } from './helpers/cartFunctions';

document.querySelector('.cep-button').addEventListener('click', searchCep);
const secaoProdutos = document.querySelector('.products');
const carrinhoProdutos = document.querySelectorAll('.cart__products');

const removeSpan = (className) => {
  if (className === 'loading') {
    const loading = document.querySelector('.loading');
    loading.remove();
  } else {
    const error = document.querySelector('.error');
    error.remove();
  }
};

const addSpan = (className) => {
  if (className === 'loading') {
    const loading = document.createElement('span');
    loading.className = 'loading';
    loading.textContent = 'carregando...';
    secaoProdutos.appendChild(loading);
  } else {
    const spanErro = document.createElement('span');
    spanErro.className = 'error';
    spanErro.textContent = 'Algum erro ocorreu, recarregue a página e tente novamente';
    secaoProdutos.appendChild(spanErro);
  }
};

const carregaCarrinho = async () => {
  const idsCarrinho = await getSavedCartIDs();
  const produtosCarrinho = idsCarrinho
    .map(async (element) => Promise.all([fetchProduct(element)]));

  produtosCarrinho.forEach((element) => {
    element.then((data) => {
      const createProduct = createCartProductElement(data[0]);
      carrinhoProdutos[0].appendChild(createProduct);
    });
  });
//
};
window.onload = async () => {
  addSpan('loading');
  try {
    const computerList = await fetchProductsList('computador');
    removeSpan('loading');
    computerList.forEach((element) => {
      const novaSecao = createProductElement(element);
      secaoProdutos.appendChild(novaSecao);
    });
    carregaCarrinho();
  } catch (e) {
    addSpan('error');
  }
};
