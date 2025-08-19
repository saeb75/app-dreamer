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

export interface CompositionData {
  success: boolean;
  cloudinaryUrl: string;
  publicId: string;
  assetId: string;
  format: string;
  size: number;
  composition: {
    totalImages: number;
    uploadedCount: number;
    urlCount: number;
    canvasSize: {
      width: number;
      height: number;
    };
  };
  metadata: {
    timestamp: number;
    filename: string;
    tempFilePath: string;
  };
}

export interface OpenaiEditingData {
  success: boolean;
  editedImageUrl: string;
  faceSwapUrl: string;
  localFilePath: string;
}

export interface SummaryData {
  totalInputImages: number;
  urlCount: number;
  uploadedCount: number;
  hasPrompt: boolean;
  cloudinaryUrl: string;
  hasFaceSwap: boolean;
}

export interface CreateGenerationResponse {
  success: boolean;
  generationId: string;
  composition: CompositionData;
  openaiEditing: OpenaiEditingData;
  summary: SummaryData;
}

export class GenerateServices extends ApiService {
  constructor() {
    super(process.env.EXPO_PUBLIC_GENERATE_API + '/api/v1'); // Update with your actual API base URL
  }

  async createGeneration(formData: FormData): Promise<CreateGenerationResponse> {
    const token = await AsyncStorage.getItem('token');
    return this.post<CreateGenerationResponse>('/edit-images-with-openai', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `${token}`,
      },
      timeout: 300000, // 5 minutes
    });
  }

  async convertImage(formData: FormData): Promise<CreateGenerationResponse> {
    const token = await AsyncStorage.getItem('token');
    return this.post<CreateGenerationResponse>('/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `${token}`,
      },
      timeout: 300000, // 5 minutes
    });
  }

  async tryOn(formData: FormData): Promise<CreateGenerationResponse> {
    const token = await AsyncStorage.getItem('token');
    return this.post<CreateGenerationResponse>('/try-on', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `${token}`,
      },
      timeout: 300000, // 5 minutes
    });
  }
}

export const GenerateService = new GenerateServices();
