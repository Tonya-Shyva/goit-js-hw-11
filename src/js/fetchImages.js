import axios from 'axios'; /* const axios = require('axios').default;*/

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '30150514-c6c2592e7290a81c416aa6291';

// ---------Для HTTP-запитів використана бібліотека axios---------------------
export async function fetchImages(inputValue, pageNr) {
  return await axios
    .get(
      `${BASE_URL}/?key=${API_KEY}&q=${inputValue}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${pageNr}`
    )
    .then(async response => {
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        new Error(response.status);
      }
      return await response.data;
    })
    .catch(error => {
      console.error(error);
    });
}

// --------------- aбо те саме з fetch------------------------------------------------
// export const fetchImages = async (inputValue, pageNr) => {
//   return await fetch(
//     `${BASE_URL}/?key=${API_KEY}&q=${inputValue}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${pageNr}`
//   )
//     .then(async response => {
//       if (!response.ok) {
//         if (response.status === 404) {
//           return [];
//         }
//         throw new Error(response.status);
//       }
//       return await response.json();
//     })
//     .catch(error => {
//       console.error(error);
//     });
// };
