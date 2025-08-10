import { create } from 'zustand';
import { appServices } from '../services/AppServices';

// Types for the steps API response
export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
}

export interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StepOption {
  id: number;
  name: string;
  description: string | null;
  prompt: string | null;
  image: Image;
}

export interface Step {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  name: string;
  description: string | null;
  options: StepOption[];
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  steps: Step[];
}

export interface StepsResponse {
  data: Category[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Store state interface
export interface AppState {
  // Steps state
  categories: Category[];
  stepsLoading: boolean;
  stepsError: string | null;
  categoriesInitialized: boolean;

  // Actions
  fetchCategories: () => Promise<void>;
  setCategories: (categories: Category[]) => void;
  clearCategories: () => void;
  setCategoriesLoading: (loading: boolean) => void;
  setCategoriesError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  categories: [],
  stepsLoading: false,
  stepsError: null,
  categoriesInitialized: false,

  // Actions
  fetchCategories: async () => {
    const state = get();
    if (state.categoriesInitialized) {
      return; // Already initialized, don't fetch again
    }

    try {
      set({ stepsLoading: true, stepsError: null });
      const response = await appServices.getSteps();
      set({
        categories: response.data,
        stepsLoading: false,
        categoriesInitialized: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      set({ stepsError: errorMessage, stepsLoading: false });
    }
  },

  setCategories: (categories: Category[]) => {
    set({ categories });
  },

  clearCategories: () => {
    set({ categories: [], stepsError: null });
  },

  setCategoriesLoading: (loading: boolean) => {
    set({ stepsLoading: loading });
  },

  setCategoriesError: (error: string | null) => {
    set({ stepsError: error });
  },
}));
