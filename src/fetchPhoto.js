import axios from 'axios';

export class MakeAPI {
  photo = null;
  page = 1;
  perPage = 40;

  async fetchPhoto() {
    try {
      return await axios.get(
        `https://pixabay.com/api/?key=34851334-286cf58f2651b78053c9b207d&q=${this.photo}&per_page=${this.perPage}&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`
      );
    } catch (error) {
      throw new Error(error.message);
      };
    };
}
