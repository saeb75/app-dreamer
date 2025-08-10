import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import useGenerateStore from '~/store/useGenerate';

const { height, width } = Dimensions.get('window');

interface PhotoItem {
  id: string;
  uri: string;
  type: 'sample' | 'camera' | 'gallery';
}

const UploadUserPose = () => {
  const { userPose, setUserPose } = useGenerateStore();
  const [galleryPhotos, setGalleryPhotos] = useState<PhotoItem[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '75%'], []);

  // Sample photos for demonstration
  const samplePhotos: PhotoItem[] = [
    { id: '1', uri: require('../../../assets/images/top.png'), type: 'sample' },
    { id: '2', uri: require('../../../assets/images/bottom.png'), type: 'sample' },
  ];

  const requestPermissions = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      return permission.granted;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };

  const loadGalleryPhotos = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setGalleryPhotos([]);
        return;
      }

      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 10, // Reduced number to avoid issues
        mediaType: MediaLibrary.MediaType.photo,
        sortBy: MediaLibrary.SortBy.creationTime,
      });

      // Convert ph:// URLs to accessible file URLs
      const validPhotos: PhotoItem[] = [];

      for (const asset of assets) {
        try {
          if (asset.uri) {
            let accessibleUri = asset.uri;

            // Convert ph:// URLs to file:// URLs for iOS
            if (asset.uri.startsWith('ph://')) {
              try {
                const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
                if (assetInfo.localUri) {
                  accessibleUri = assetInfo.localUri;
                } else {
                  continue; // Skip if no localUri
                }
              } catch (conversionError) {
                continue; // Skip this asset if conversion fails
              }
            }

            validPhotos.push({
              id: asset.id,
              uri: accessibleUri,
              type: 'gallery' as const,
            });
          }
        } catch (assetError) {
          console.log('Skipping problematic asset:', asset.id);
        }
      }

      setGalleryPhotos(validPhotos);

      // If no photos were loaded, try alternative approach
      if (validPhotos.length === 0) {
        console.log('No photos loaded, trying alternative approach...');
        // For now, we'll just show the empty state
        // In a real app, you might want to use a different approach
      }
    } catch (error) {
      console.error('Error loading gallery photos:', error);
      // Fallback to just sample photos if gallery loading fails
      setGalleryPhotos([]);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permission');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Disable editing to preserve original quality
      quality: 1, // Maximum quality (1.0 = 100%)
    });

    if (!result.canceled && result.assets[0]) {
      const selectedImage = result.assets[0].uri;
      setUserPose(selectedImage);
      bottomSheetRef.current?.close();
    }
  };

  const selectFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library permission');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Disable editing to preserve original quality
      quality: 1, // Maximum quality (1.0 = 100%)
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets[0]) {
      const selectedImage = result.assets[0].uri;
      setUserPose(selectedImage);
      bottomSheetRef.current?.close();
    }
  };

  const openBottomSheet = () => {
    setIsBottomSheetOpen(true);
    setTimeout(() => {
      loadGalleryPhotos();
    }, 100);
    bottomSheetRef.current?.expand();
  };

  const handleSheetChanges = useCallback((index: number) => {
    setIsBottomSheetOpen(index > 0);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={0} appearsOnIndex={1} opacity={0.5} />
    ),
    []
  );

  const renderPhotoItem = ({ item }: { item: PhotoItem }) => (
    <TouchableOpacity
      className="mr-3 h-20 w-20 overflow-hidden rounded-lg border-2 border-gray-300"
      onPress={() => {
        setUserPose(item.uri);
        bottomSheetRef.current?.close();
      }}>
      <Image source={{ uri: item.uri }} className="h-full w-full" />
    </TouchableOpacity>
  );

  const renderUploadSection = (
    selectedImage: string | null,
    placeholderImage: any,
    title: string
  ) => (
    <TouchableOpacity
      onPress={() => openBottomSheet()}
      className="relative mb-4 h-[240px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 shadow-md"
      style={{ elevation: 3 }}>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} className="h-full w-full rounded-[10px]" />
      ) : (
        <>
          <Image
            source={placeholderImage}
            style={{ height: height * 0.25, width: height * 0.3, opacity: 0.3 }}
            resizeMode="contain"
          />
          <View className="absolute items-center justify-center">
            <Text className="mb-2 text-xl font-bold text-gray-700">{title}</Text>
            <Ionicons name="camera-outline" size={24} color="#666" className="mt-1" />
          </View>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4">
      {renderUploadSection(userPose, require('../../../assets/images/top.png'), 'Upload Your Pose')}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        handleIndicatorStyle={{ backgroundColor: '#d1d5db', width: 40, height: 4 }}>
        <BottomSheetView className="flex-1 p-5">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-800">Select Pose Photo</Text>
            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Camera Button */}
          <TouchableOpacity
            className="mb-3 flex-row items-center justify-center rounded-xl bg-blue-500 p-4"
            onPress={openCamera}>
            <Ionicons name="camera" size={24} color="white" />
            <Text className="ml-2 text-base font-semibold text-white">Take Photo</Text>
          </TouchableOpacity>

          {/* Gallery Button */}
          <TouchableOpacity
            className="mb-5 flex-row items-center justify-center rounded-xl bg-emerald-500 p-4"
            onPress={selectFromGallery}>
            <Ionicons name="images" size={24} color="white" />
            <Text className="ml-2 text-base font-semibold text-white">Choose from Gallery</Text>
          </TouchableOpacity>

          {/* Sample Photos */}
          <View className="mb-5">
            <Text className="mb-3 text-base font-semibold text-gray-700">Sample Photos</Text>
            <FlatList
              data={samplePhotos}
              renderItem={renderPhotoItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            />
          </View>

          {/* Gallery Photos */}
          <View className="mb-5">
            <Text className="mb-3 text-base font-semibold text-gray-700">Your Photos</Text>
            {galleryPhotos.length > 0 ? (
              <FlatList
                data={galleryPhotos}
                renderItem={renderPhotoItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
              />
            ) : (
              <View className="mt-2 items-center justify-center rounded-lg bg-gray-50 py-5">
                <Ionicons name="images-outline" size={32} color="#9ca3af" />
                <Text className="mt-2 text-base font-medium text-gray-500">
                  Gallery photos loading...
                </Text>
                <Text className="mt-1 text-center text-sm text-gray-400">
                  Use camera or gallery button above
                </Text>
              </View>
            )}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

// All styles converted to NativeWind classes

export default UploadUserPose;
