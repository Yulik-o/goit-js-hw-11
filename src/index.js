import './styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formItem = document.querySelector('#search__form');
const inputItem = document.querySelector('input[name="searchQuery"]');
const galleryItem = document.querySelector('.gallery');
const btnMore = document.querySelector('.load__more');
const alertItem = document.querySelector('.text');

const BASE_URL = 'https://pixabay.com/api';
const KEY = '32848504-113b5416049b5c8ff07c52596';

formItem.addEventListener('submit', onSubmit);
btnMore.addEventListener('click', onClick);

let page = 1;
let keyInput = '';
let totalPages = 0;

function onSubmit(event) {
  event.preventDefault();
  keyInput = inputItem.value;
  galleryItem.innerHTML = '';
  alertItem.classList.add('hidden');

  page = 1;

  if (!keyInput.trim()) {
    Notiflix.Notify.info('Oops! Please, enter smth to search.');
    btnMore.classList.add('hidden');
    return;
  }
  getImg(keyInput);
  event.currentTarget.reset();
}

function onClick() {
  getImg(keyInput);
}

async function getImg(keyWord) {
  try {
    const response = await axios.get(
      `${BASE_URL}/?key=${KEY}&q=${keyWord}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    if (!response.data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnMore.classList.add('hidden');
      alertItem.classList.add('hidden');
      return;
    }

    if (page === 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }
    btnMore.classList.remove('hidden');
    totalPages = Math.ceil(response.data.totalHits / 40);
    createGallery(response.data.hits);
    page += 1;
    if (page > totalPages) {
      return toogleAlertMarkup();
    }
  } catch (error) {
    console.log(error);
  }
}

function createGallery(images) {
  const markup = images
    .map(image => {
      return `<div class="photo__card">
      <a href="${image.largeImageURL}">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="100%" height="300px"/>
      </a>
      <div class="info">
      <p class="info__item"><b>Likes</b>${image.likes}</p>
      <p class="info__item"><b>Views</b>${image.views}</p>
      <p class="info__item"><b>Comments</b>${image.comments}</p>
      <p class="info__item"><b>Downloads</b>${image.downloads}</p>
      </div>
      </div>`;
    })
    .join('');
  
  }

function toogleAlertMarkup() {
  alertItem.classList.remove('hidden');
  btnMore.classList.add('hidden');
}
const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsDelay: 250,
  scrollZoom: false,
  scrollZoomFactor: 0,
});
