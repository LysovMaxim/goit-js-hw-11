export class MakeAPI {
  photo = null;
  page = 1;
  perPage = 40;

  fetchPhoto() {
    return fetch(
      `https://pixabay.com/api/?key=34851334-286cf58f2651b78053c9b207d&q=${this.photo}&per_page=${this.perPage}&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`
    ).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }
}
