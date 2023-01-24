import './styles.css';

import Notiflix from 'notiflix';
//import SimpleLightbox from "simplelightbox";
//import "simplelightbox/dist/simple-lightbox.min.css";
import { PixabayAPI } from './pixabay-api.js';


const searchFormEl = document.querySelector('#search__form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreButtonEl = document.querySelector('.js__load-more');
const alertItem = document.querySelector('.text');

const pixabayAPI = new PixabayAPI();

const onSearchFormSubmit = async event => {
  event.preventDefault();

  pixabayAPI.query = event.currentTarget.searchQuery.value;
  pixabayAPI.page = 1;
  galleryListEl.innerHTML = '';

  try {
    const { data } = await pixabayAPI.fetchPhotosByQuery();
    if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      event.target.reset();
      galleryListEl.innerHTML = '';

      alertItem.classList.remove('is-hidden');
      loadMoreButtonEl.classList.add('is-hidden');
      return;
    } else if (data.hits.length < 40) {
      createGalleryCards(data.hits);
      // Notiflix.Notify.info("We're sorry, but you've reached the end of search results");

      alertItem.classList.remove('is-hidden');
      loadMoreButtonEl.classList.add('is-hidden');
    } else {
      createGalleryCards(data.hits);

      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images`);
      loadMoreButtonEl.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
};

const onLoadMoreButtonClick = async event => {
  pixabayAPI.page += 1;
  try {
    const { data } = await pixabayAPI.fetchPhotosByQuery();
    if (data.hits.length < 40 || pixabayAPI.page === 13) {
      // Notiflix.Notify.info("We're sorry, but you've reached the end of search results");
      createGalleryCards(data.hits);
      alertItem.classList.remove('is-hidden');
      loadMoreButtonEl.classList.add('is-hidden');
    } else {
      createGalleryCards(data.hits);

      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images`);
    }
  } catch (error) {
    console.log(error);
  }
};

function createGalleryCards(arr) {
  const galleryCardsArray = arr
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo__card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200"/>
            <div class="info">
              <p class="info__item">
                <b>Likes:&nbsp</b>${likes}
              </p>
              <p class="info__item">
                <b>Views:&nbsp </b>${views}
              </p>
              <p class="info__item">
                <b>Comments:&nbsp </b>${comments}
              </p>
              <p class="info__item">
                <b>Downloads:&nbsp </b>${downloads}
              </p>
            </div>
          </div>`;
    })
    .join('');
  galleryListEl.insertAdjacentHTML('beforeend', galleryCardsArray);
}

// function togleAlertMarkup() {
//   alertItem.classList.remove('is-hidden');
//   loadMoreButtonEl.classList.add('is-hidden');
// }

loadMoreButtonEl.addEventListener('click', onLoadMoreButtonClick);
searchFormEl.addEventListener('submit', onSearchFormSubmit);
