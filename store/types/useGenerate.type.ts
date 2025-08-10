import { StepOption } from '../store';
import { Generation, GenerationsResponse } from '../../services/ProfileServices';

export interface GeneratedImage {
  compositionUrl: string;
  editedImageUrl: string;
  faceSwapUrl: string;
  generationId: string;
}
export interface SocketGeneration {
  generationId: string;
  inputImage?: string;
  editedImageUrl?: string;
  faceSwapUrl?: string;
  failed?: boolean;
  timestamp?: string;
}

export type UseGenerateType = {
  // Existing state
  selectedModel: StepOption | null;
  selectedPose: StepOption | null;
  userPose: string | null;
  topPhoto: string | null;

  bottomPhoto: string | null;
  fullBodyPhoto: string | null;
  uploadType: 'FullBody' | 'Separate';
  socketGenerations: SocketGeneration[] | [];
  setSocketGenerations: (generations: SocketGeneration, failed?: boolean) => void;
  // Generation state
  generations: Generation[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  } | null;
  generatedImage: GeneratedImage | null;
  socketMessage: string | null;
  // Existing setters
  setUploadType: (type: 'FullBody' | 'Separate') => void;
  setSelectedModel: (model: StepOption | null) => void;
  setSelectedPose: (pose: StepOption | null) => void;
  setUserPose: (photo: string | null) => void;
  setTopPhoto: (photo: string | null) => void;
  setBottomPhoto: (photo: string | null) => void;
  setFullBodyPhoto: (photo: string | null) => void;
  setSocketMessage: (message: string | null) => void;
  convertImage: () => Promise<void>;
  // Generation actions
  setGenerations: (generations: Generation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    } | null
  ) => void;
  setGeneratedImage: (image: GeneratedImage | null) => void;

  // Generation API actions
  fetchGenerations: (params?: { page?: number; pageSize?: number; sort?: string }) => Promise<void>;
  generateImage: () => Promise<void>;
  // Utility actions
  clearGenerations: () => void;
  clearError: () => void;
};
