import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoMarkupTemplate from '../templates/photoCard.hbs';

const inputRef = document.querySelector('input[type="text"]');
const btnSearch = document.querySelector('.btn-submit');
const gallery = document.querySelector('.gallery');
const btnToTop = document.querySelector('.to-top');

const gallerySimpleLightbox = new SimpleLightbox('.gallery a');

// ----for infinity scroll-------------------------
const guard = document.querySelector('.guard');
const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1,
};
const observer = new IntersectionObserver(onLoad, options); //клас для створення infinity scroll
// -------------------------------------------------------------------------------
let pageNumber = 1;

btnToTop.style.display = 'none';

btnSearch.addEventListener('click', onBtnSearchClick);

function onBtnSearchClick(e) {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = inputRef.value.trim();
  if (trimmedValue !== '') {
    fetchImages(trimmedValue, pageNumber).then(data => {
      //   console.log('onBtnSearchClick', data);
      if (data.hits.length === 0) {
        btnToTop.style.display = 'none';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        observer.unobserve(guard);
      } else {
        renderImageList(data.hits);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (data.hits.length > 1 && data.hits.length < 40) {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(guard);
        } else {
          observer.observe(guard);
        }
        gallerySimpleLightbox.refresh();
      }
    });
  }
}

// функція для infinity scroll--------------------------
function onLoad(entries) {
  entries.forEach(entry => {
    // console.log(pageNumber);
    if (entry.isIntersecting) {
      //true
      const trimmedValue = inputRef.value.trim();
      pageNumber += 1;
      btnToTop.style.display = 'inline-flex';
      fetchImages(trimmedValue, pageNumber).then(data => {
        if (data.hits.length > 1 && data.hits.length < 40) {
          renderImageList(data.hits);
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(guard);
        } else {
          renderImageList(data.hits);
          observer.observe(guard);
          gallerySimpleLightbox.refresh();
        }
      });
    }
  });
}

function renderImageList(images) {
  // ------з використанням шаблонізатора handlebars-----------------------
  gallery.insertAdjacentHTML('beforeend', photoMarkupTemplate(images));
}
// --------функція для очищення галереї та повернення до дефолтних значень-------------------------------------------
function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  btnToTop.style.display = 'none';
  observer.unobserve(guard);
}

// ----- for scroll to up  ----------------------------
btnToTop.addEventListener('scroll', scrollToTop);
function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({
    top: 50,
    behavior: 'smooth',
  });
  btnToTop.removeEventListener('scroll', scrollToTop);
}
