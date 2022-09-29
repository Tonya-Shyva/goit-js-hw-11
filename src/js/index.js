import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoMarkupTemplate from '../templates/photoCard.hbs';

const inputRef = document.querySelector('input[type="text"]');
const btnSearch = document.querySelector('.btn-submit');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const gallerySimpleLightbox = new SimpleLightbox('.gallery a');
let pageNumber = 1;

btnLoadMore.style.display = 'none';

btnSearch.addEventListener('click', onBtnSearchClick);

function onBtnSearchClick(e) {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = inputRef.value.trim();
  if (trimmedValue !== '') {
    fetchImages(trimmedValue, pageNumber).then(data => {
      //   console.log('onBtnSearchClick', data);
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImageList(data.hits);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        btnLoadMore.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
    });
  }
}

btnLoadMore.addEventListener('click', onBtnLoadMoreClick);

function onBtnLoadMoreClick() {
  const trimmedValue = inputRef.value.trim();
  pageNumber += 1;
  fetchImages(trimmedValue, pageNumber).then(data => {
    // console.log('onBtnLoadMoreClick', data);
    if (data.hits.length === 0 || data.hits.length < 40) {
      renderImageList(data.hits);
      scrollByAfterLoadMore();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      btnLoadMore.style.display = 'none';
      //   console.log(btnLoadMore);
    } else {
      renderImageList(data.hits);
      scrollByAfterLoadMore();

      gallerySimpleLightbox.refresh();
    }
  });
}

function renderImageList(images) {
  // ------з використанням шаблонізатора handlebars-----------------------
  gallery.insertAdjacentHTML('beforeend', photoMarkupTemplate(images));

  // -------якщо без шаблонізатора----------------------------------------
  //   const markup = images
  //     .map(image => {
  //       return photoMarkupTemplate(image);
  //     })
  //     .join('');
  //   console.log(markup);
  //   const markup = images
  //     .map(image => {
  //       console.log('img', image);
  //       return `<div class="photo-card">
  //            <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy" width="262" height="200"/></a>
  //             <div class="info">
  //                <p class="info-item">
  //         <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
  //     </p>
  //                 <p class="info-item">
  //                     <b>Views</b> <span class="info-item-api">${image.views}</span>
  //                 </p>
  //                 <p class="info-item">
  //                     <b>Comments</b> <span class="info-item-api">${image.comments}</span>
  //                 </p>
  //                 <p class="info-item">
  //                     <b>Downloads</b> <span class="info-item-api">${image.downloads}</span>
  //                 </p>
  //             </div>
  //         </div>`;
  //     })
  //     .join('');
  // gallery.insertAdjacentHTML('beforeend', markup);
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
}

function scrollByAfterLoadMore() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.15,

    behavior: 'smooth',
  });
}
