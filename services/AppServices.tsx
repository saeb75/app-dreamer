import ApiService from '.';

class AppServices extends ApiService {
  constructor() {
    super('http://localhost:1337/api');
  }

  async getSteps() {
    return this.get(
      '/categories?filters[id][$eq]=4&populate[steps][populate][options][populate]=image'
    );
  }
}

export const appServices = new AppServices();
