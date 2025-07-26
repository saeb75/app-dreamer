import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

interface PhotoItem {
  id: string;
  uri: string;
  type: 'sample' | 'camera' | 'gallery';
}

const Upload = () => {
  const [selectedTopImage, setSelectedTopImage] = useState<string | null>(null);
  const [selectedBottomImage, setSelectedBottomImage] = useState<string | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<PhotoItem[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<'top' | 'bottom'>('top');

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '75%'], []);

  // Sample photos for demonstration
  const samplePhotos: PhotoItem[] = [
    { id: '1', uri: require('../../../assets/images/top.png'), type: 'sample' },
    { id: '2', uri: require('../../../assets/images/bottom.png'), type: 'sample' },
    { id: '3', uri: require('../../../assets/images/top.png'), type: 'sample' },
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
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const selectedImage = result.assets[0].uri;
      if (currentUploadType === 'top') {
        setSelectedTopImage(selectedImage);
      } else {
        setSelectedBottomImage(selectedImage);
      }
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
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const selectedImage = result.assets[0].uri;
      if (currentUploadType === 'top') {
        setSelectedTopImage(selectedImage);
      } else {
        setSelectedBottomImage(selectedImage);
      }
      bottomSheetRef.current?.close();
    }
  };

  const openBottomSheet = (type: 'top' | 'bottom') => {
    setCurrentUploadType(type);
    setIsBottomSheetOpen(true);
    // Load gallery photos in background, don't block the UI
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
      style={styles.photoItem}
      onPress={() => {
        if (currentUploadType === 'top') {
          setSelectedTopImage(item.uri);
        } else {
          setSelectedBottomImage(item.uri);
        }
        bottomSheetRef.current?.close();
      }}>
      <Image source={{ uri: item.uri }} style={styles.photoImage} />
    </TouchableOpacity>
  );

  const renderUploadSection = (
    type: 'top' | 'bottom',
    selectedImage: string | null,
    placeholderImage: any,
    title: string
  ) => (
    <TouchableOpacity onPress={() => openBottomSheet(type)} style={styles.uploadSection}>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
      ) : (
        <>
          <Image source={placeholderImage} style={styles.placeholderImage} resizeMode="contain" />
          <View style={styles.overlayText}>
            <Text style={styles.uploadText}>{title}</Text>
            <Ionicons name="camera-outline" size={24} color="#666" style={styles.cameraIcon} />
          </View>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderUploadSection(
        'top',
        selectedTopImage,
        require('../../../assets/images/top.png'),
        'Upload Your Top'
      )}
      {renderUploadSection(
        'bottom',
        selectedBottomImage,
        require('../../../assets/images/bottom.png'),
        'Upload Your Bottom'
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}>
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {currentUploadType === 'top' ? 'Select Top Photo' : 'Select Bottom Photo'}
            </Text>
            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Camera Button */}
          <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.cameraButtonText}>Take Photo</Text>
          </TouchableOpacity>

          {/* Gallery Button */}
          <TouchableOpacity style={styles.galleryButton} onPress={selectFromGallery}>
            <Ionicons name="images" size={24} color="white" />
            <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          {/* Sample Photos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sample Photos</Text>
            <FlatList
              data={samplePhotos}
              renderItem={renderPhotoItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photoList}
            />
          </View>

          {/* Gallery Photos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Photos</Text>
            {galleryPhotos.length > 0 ? (
              <FlatList
                data={galleryPhotos}
                renderItem={renderPhotoItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photoList}
              />
            ) : (
              <View style={styles.emptyGallery}>
                <Ionicons name="images-outline" size={32} color="#9ca3af" />
                <Text style={styles.emptyGalleryText}>Gallery photos loading...</Text>
                <Text style={styles.emptyGallerySubtext}>Use camera or gallery button above</Text>
              </View>
            )}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  uploadSection: {
    height: height * 0.3,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderImage: {
    height: height * 0.25,
    width: height * 0.3,
    opacity: 0.3,
  },
  selectedImage: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
  },
  overlayText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  cameraIcon: {
    marginTop: 4,
  },
  bottomSheetBackground: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#d1d5db',
    width: 40,
    height: 4,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cameraButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  galleryButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  galleryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  photoList: {
    paddingHorizontal: 4,
  },
  photoItem: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  emptyGallery: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginTop: 8,
  },
  emptyGalleryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 8,
  },
  emptyGallerySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default Upload;
