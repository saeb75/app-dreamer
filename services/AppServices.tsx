import ApiService, { AuthResponse } from '.';

class AppServices extends ApiService {
  constructor() {
    super(process.env.EXPO_PUBLIC_CONTENT_API + '/api' || 'http://localhost:1337/api');
  }
  async loginGoogle(idToken: string): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/google-mobile', { idToken });
    return response;
  }
  async loginApple(identityToken: string): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/apple-mobile', { identityToken });
    return response;
  }
  async getUser(token: string) {
    const response = await this.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  async getSteps() {
    return this.get(
      '/categories?filters[id][$eq]=4&populate[steps][populate][options][populate]=image'
    );
  }
}

export const appServices = new AppServices();
