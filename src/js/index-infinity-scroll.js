import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoMarkupTemplate from '../templates/photoCard.hbs';
import icons from '../images/icons.svg';

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
      const pages = Math.ceil(data.totalHits / data.hits.length);
      //   console.log('onBtnSearchClick', data);
      if (data.totalHits === 0) {
        console.log(pageNumber, pages);
        btnToTop.style.display = 'none';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        observer.unobserve(guard);
      } else {
        console.log(pageNumber, pages);
        observer.observe(guard);
        renderImageList(data.hits);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (pageNumber === pages) {
          console.log(pageNumber === pages);
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(guard);
        }
      }
      gallerySimpleLightbox.refresh();
    });
  }
}

// функція для infinity scroll--------------------------
function onLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      //true
      const trimmedValue = inputRef.value.trim();
      btnToTop.style.display = 'inline-flex';
      fetchImages(trimmedValue, pageNumber).then(data => {
        pageNumber += 1;
        const pages = Math.ceil(data.totalHits / data.hits.length);
        if (pageNumber === pages) {
          console.log(pageNumber, pages);

          renderImageList(data.hits);
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(guard);
        } else {
          console.log(pageNumber, pages);
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
