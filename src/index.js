import './css/styles.css';
import { MakeAPI } from "./fetchPhoto.js"


const formEl = document.querySelector(".search-form");
console.log(formEl);
const inputEl = document.querySelector(".input")
console.log(inputEl);
const galleryEl = document.querySelector(".gallery");
console.log(galleryEl);
const loadMoreEl = document.querySelector(".load-more");
console.log(loadMoreEl);

const unsplashAPI = new MakeAPI();

function handleSubmit(event) {
    event.preventDefault();

    if (inputEl.value === "") {
        return;
    }
    unsplashAPI.page = 1;

    unsplashAPI.photo = inputEl.value.trim();


    unsplashAPI.fetchPhoto().then(data => {
        console.log(data)
        
        const arrayPhoto = data.hits
        

        galleryEl.innerHTML = makePhoto(arrayPhoto)

        if (data.totalHits < unsplashAPI.perPage || data.totalHits === 0) {
            loadMoreEl.classList.add("is-hidden")
            return
        }
        
        loadMoreEl.classList.remove("is-hidden")
    })
};

formEl.addEventListener("submit", handleSubmit);
loadMoreEl.addEventListener("click", handleloadMore)

function makePhoto(arrayPhoto) {
    const photo = arrayPhoto.map(({webformatURL,tags,likes,views,comments,downloads}) => {
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px"height="300px"/>
  <div class="info">
    <p class="info-item">
      <b>likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>views ${views}</b>
    </p>
    <p class="info-item">
      <b>comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>downloads ${downloads}</b>
    </p>
  </div>
</div>`
    }).join("")
    return photo;
};

function handleloadMore() {
    unsplashAPI.page += 1;

    unsplashAPI.fetchPhoto().then(data => {
        console.log(data)
        const arrayPhoto = data.hits
        galleryEl.insertAdjacentHTML('beforeend', makePhoto(arrayPhoto))
    })
}









