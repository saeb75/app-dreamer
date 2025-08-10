import { create } from 'zustand';
import { UseGenerateType, GeneratedImage } from './types/useGenerate.type';
import { ProfileService } from '../services/ProfileServices';
import * as FileSystem from 'expo-file-system';
import { GenerateService } from '~/services/GenerateServices';

const useGenerateStore = create<UseGenerateType>((set, get) => ({
  // Existing state
  selectedModel: null,
  selectedPose: null,
  userPose: null,
  uploadType: 'Separate',
  topPhoto: null,
  bottomPhoto: null,
  fullBodyPhoto: null,
  socketMessage: null,
  socketGenerations: [],
  setSocketGenerations: (generations, failed) => {
    const { socketGenerations } = get();
    const newGenerations = socketGenerations.filter(
      (generation) => generation.generationId !== generations.generationId
    );
    set({ socketGenerations: [...newGenerations, { ...generations, failed }] });
  },
  // Generation state
  generations: [],
  isLoading: false,
  error: null,
  pagination: null,
  generatedImage: null,

  // Existing setters
  setTopPhoto: (photo) => set({ topPhoto: photo }),
  setBottomPhoto: (photo) => set({ bottomPhoto: photo }),
  setFullBodyPhoto: (photo) => set({ fullBodyPhoto: photo }),
  setUserPose: (photo) => set({ userPose: photo }),
  setUploadType: (type) => set({ uploadType: type }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSelectedPose: (pose) => set({ selectedPose: pose }),
  setSocketMessage: (message) => set({ socketMessage: message }),
  // Generation setters
  setGenerations: (generations) => set({ generations }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),
  setGeneratedImage: (image) => set({ generatedImage: image }),

  generateImage: async () => {
    try {
      set({ isLoading: true, error: null });

      const { selectedModel, selectedPose, topPhoto, bottomPhoto, fullBodyPhoto, uploadType } =
        get();

      console.log({
        selectedModel,
        selectedPose,
        topPhoto,
        bottomPhoto,
        fullBodyPhoto,
        uploadType,
      });

      // Validate required data
      if (!selectedModel) {
        throw new Error('Please select a model');
      }

      if (!selectedPose) {
        throw new Error('Please select a pose');
      }

      // Validate photos based on upload type
      if (uploadType === 'Separate') {
        if (!topPhoto) {
          throw new Error('Please upload a top photo');
        }
        if (!bottomPhoto) {
          throw new Error('Please upload a bottom photo');
        }
      } else {
        if (!fullBodyPhoto) {
          throw new Error('Please upload a full body photo');
        }
      }

      // Prepare FormData for API request
      const formData = new FormData();

      if (uploadType === 'Separate') {
        const topPhotoFile = await prepareFileForFormData(topPhoto!, 'topPhoto');
        if (!topPhotoFile) {
          throw new Error('Failed to prepare top photo for upload');
        }

        const bottomPhotoFile = await prepareFileForFormData(bottomPhoto!, 'bottomPhoto');
        if (!bottomPhotoFile) {
          throw new Error('Failed to prepare bottom photo for upload');
        }

        console.log({ selectedPose: selectedPose });
        formData.append('images', topPhotoFile);
        formData.append('images', bottomPhotoFile);
      } else {
        const fullBodyPhotoFile = await prepareFileForFormData(fullBodyPhoto!, 'fullBodyPhoto');
        if (!fullBodyPhotoFile) {
          throw new Error('Failed to prepare full body photo for upload');
        }

        console.log({ selectedPose: selectedPose });
        formData.append('images', fullBodyPhotoFile);
      }
      formData.append('prompt', 'Edit the image with the prompt');
      formData.append('imageUrls', JSON.stringify([selectedPose?.image.url]));
      formData.append('quality', 'medium');
      formData.append('background', 'auto');
      formData.append('input_fidelity', 'low');
      // formData.append('bottomPhoto', bottomPhotoFile);

      const response = await GenerateService.createGeneration(formData);

      // Handle successful generation response
      if (response.success) {
        const generatedImage: GeneratedImage = {
          compositionUrl: response.composition?.cloudinaryUrl || '',
          editedImageUrl: response.openaiEditing?.editedImageUrl || '',
          faceSwapUrl: response.openaiEditing?.faceSwapUrl || '',
          generationId: response.generationId || '',
        };

        set({
          generatedImage,
          isLoading: false,
          error: null,
        });

        console.log('Generated image stored:', generatedImage);
      } else {
        throw new Error('Generation failed');
      }

      set({ isLoading: false });
    } catch (error: any) {
      // console.error('Generation error:', error);
      set({
        error: error.message || 'Failed to generate image',
        isLoading: false,
      });
    }
  },
  convertImage: async () => {
    try {
      set({ isLoading: true, error: null });

      const {
        selectedModel,
        selectedPose,
        topPhoto,
        bottomPhoto,
        fullBodyPhoto,
        uploadType,
        userPose,
      } = get();

      console.log({
        selectedModel,
        selectedPose,
        topPhoto,
        bottomPhoto,
        fullBodyPhoto,
        uploadType,
        userPose,
      });

      // Validate required data
      if (!selectedModel) {
        throw new Error('Please select a model');
      }

      if (!userPose) {
        throw new Error('Please select a pose');
      }

      const formData = new FormData();

      let userPoseFile = await prepareFileForFormData(userPose!, 'userPose');
      if (!userPoseFile) {
        throw new Error('Failed to prepare user pose for upload');
      }
      formData.append('images', userPoseFile);
      formData.append('prompt', 'Edit the image with the prompt');
      formData.append('swap_image_url', selectedModel?.image.url || '');
      formData.append('quality', 'medium');
      formData.append('background', 'auto');
      formData.append('input_fidelity', 'low');
      // formData.append('bottomPhoto', bottomPhotoFile);

      const response = await GenerateService.convertImage(formData);

      // Handle successful generation response
      if (response.success) {
        const generatedImage: GeneratedImage = {
          compositionUrl: response.composition?.cloudinaryUrl || '',
          editedImageUrl: response.openaiEditing?.editedImageUrl || '',
          faceSwapUrl: response.openaiEditing?.faceSwapUrl || '',
          generationId: response.generationId || '',
        };

        set({
          generatedImage,
          isLoading: false,
          error: null,
        });

        console.log('Generated image stored:', generatedImage);
      } else {
        throw new Error('Generation failed');
      }

      set({ isLoading: false });
    } catch (error: any) {
      console.error('Generation error:', error);
      set({
        error: error.message || 'Failed to generate image',
        isLoading: false,
      });
    }
  },

  // Generation API actions
  fetchGenerations: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await ProfileService.getGenerations(params);
      set({
        generations: response.data,
        pagination: response.meta.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch generations',
        isLoading: false,
      });
    }
  },

  // Utility actions
  clearGenerations: () => set({ generations: [], pagination: null }),
  clearError: () => set({ error: null }),
}));

// Helper function to prepare file for FormData
const prepareFileForFormData = async (filePath: string, fieldName: string) => {
  try {
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (!fileInfo.exists) {
      console.error(`File does not exist: ${filePath}`);
      return null;
    }

    // Get file extension from path
    const extension = filePath.split('.').pop()?.toLowerCase() || 'jpg';

    // Determine MIME type based on extension
    let mimeType = 'image/jpeg';
    if (extension === 'heic' || extension === 'heif') {
      mimeType = 'image/heic';
    } else if (extension === 'png') {
      mimeType = 'image/png';
    } else if (extension === 'webp') {
      mimeType = 'image/webp';
    } else if (extension === 'gif') {
      mimeType = 'image/gif';
    }

    // Log file info for quality monitoring
    console.log(`File quality info for ${fieldName}:`, {
      uri: filePath,
      type: mimeType,
      name: `${fieldName}.${extension}`,
      extension: extension,
    });

    // Create file object for FormData
    const file = {
      uri: filePath,
      type: mimeType,
      name: `${fieldName}.${extension}`,
    } as any;

    return file;
  } catch (error) {
    console.error(`Error preparing file ${filePath}:`, error);
    return null;
  }
};

export default useGenerateStore;
