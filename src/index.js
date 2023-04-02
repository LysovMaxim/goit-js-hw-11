import './css/styles.css';
import { MakeAPI } from './fetchPhoto.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
console.log(formEl);
const inputEl = document.querySelector('.input');
console.log(inputEl);
const galleryEl = document.querySelector('.gallery');
console.log(galleryEl);
const loadMoreEl = document.querySelector('.load-more');
console.log(loadMoreEl);

const unsplashAPI = new MakeAPI();

let total = 0;
let lightbox;

formEl.addEventListener('submit', handleSubmit);
loadMoreEl.addEventListener('click', handleloadMore);

async function handleSubmit(event) {
  event.preventDefault();
  total = 0;

  total += unsplashAPI.perPage;
  console.log(total);
  if (inputEl.value === '') {
    return;
  }
  unsplashAPI.page = 1;

  unsplashAPI.photo = inputEl.value.trim();

  try {
    const { data } = await unsplashAPI.fetchPhoto();
    console.log(data);
    const arrayPhoto = data.hits;

    galleryEl.innerHTML = makePhoto(arrayPhoto);
    lightbox = new SimpleLightbox('.photo-card a', {
      captionsData: 'alt',
      captionDelay: 250,
      scrollZoom: false,
    }).refresh();
    if (data.totalHits != 0) {
      messageHowManyPicturesFound(data);
    };
     if (data.totalHits === 0) {
      loadMoreEl.classList.add('is-hidden');
       return messageNothingFound();
       
    } else if (data.totalHits < unsplashAPI.perPage || data.totalHits === 0) {
      loadMoreEl.classList.add('is-hidden');
      messageThatNoMoreImagesFound();
      return;
    };


    loadMoreEl.classList.remove('is-hidden');
  } catch (error) {
    console.log(error);
  }
}

async function handleloadMore() {
  unsplashAPI.page += 1;
  lightbox.destroy();

  try {
    const { data } = await unsplashAPI.fetchPhoto();

    total += unsplashAPI.perPage;
    console.log(total);
    const arrayPhoto = data.hits;

    galleryEl.insertAdjacentHTML('beforeend', makePhoto(arrayPhoto));
    lightbox = new SimpleLightbox('.photo-card a', {
      captionsData: 'alt',
      captionDelay: 250,
      scrollZoom: false,
    }).refresh();

    if (data.totalHits < total) {
      loadMoreEl.classList.add('is-hidden');
      messageThatNoMoreImagesFound();
    }
  } catch (error) {
    console.log(error);
  }
}

function makePhoto(arrayPhoto) {
  const photo = arrayPhoto
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px"height="300px"/></a>
  <div class="info">
    <p class="info-item">
      <b>likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>views: ${views}</b>
    </p>
    <p class="info-item">
      <b>comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  return photo;
}

function messageHowManyPicturesFound(data) {
  Notiflix.Notify.success(`"Hooray! We found ${data.totalHits} images."`);
};
function messageThatNoMoreImagesFound() {
        galleryEl.insertAdjacentHTML(
        'beforeend',
        `"We're sorry, but you've reached the end of search results."`
      )
};
function messageNothingFound() {
  Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
}
