import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService } from './index';

// Generation response types
export interface Generation {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  input_url: string;
  output_url: string;
  swaped_url: string;
  success: boolean;
  created: string | null;
  type: string;
}

export interface GenerationsResponse {
  data: Generation[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface CreateGenerationResponse {
  data: Generation;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export class ProfileServices extends ApiService {
  constructor() {
    super(process.env.EXPO_PUBLIC_CONTENT_API + '/api'); // Update with your actual API base URL
  }

  // Get all generations
  async getGenerations(params?: {
    page?: number;
    pageSize?: number;
    sort?: string;
  }): Promise<GenerationsResponse> {
    const token = await AsyncStorage.getItem('token');
    return this.get<GenerationsResponse>(
      `/generations?pagination[page]=${params?.page}&pagination[pageSize]=${params?.pageSize}&sort=createdAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export const ProfileService = new ProfileServices();
