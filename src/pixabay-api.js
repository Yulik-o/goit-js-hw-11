'use strict';

import axios from 'axios';

export class PixabayAPI {

constructor() {
    this.page = 1;
    this.query = null;
  }

  fetchPhotosByQuery() {
    return axios.get(`https://pixabay.com/api/?key=32917411-0bf5fafbdbcee2600446b2252&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`);

}
}


// export class PixabayAPI {
//     static BASE_URL = 'https://pixabay.com'
//     static API_KEY = '32926703-703d0338e476ad21248e3ea4a' 
//     constructor() {
//         this.page = 1; 
//         this.query = null;  
//     }

//     async fetchPhotosByQuery() {
//         const searchParams = new URLSearchParams({
//             q: this.query,
//             safesearch: 'true',
//             image_type: 'photo',
//             orientation: 'horizontal',
//             page: this.page,
//             per_page: 40,
//             key: PixabayAPI.API_KEY,
//         })

//         try {
//             return await axios.get(`${PixabayAPI.BASE_URL}/api/?${searchParams}`);
//         
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }