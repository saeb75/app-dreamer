import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { Generation } from '~/services/ProfileServices';
import { useWindowDimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
// import * as Sharing from 'expo-sharing';

const GenerateCard = ({
  url,
  loading = false,
  failed = false,
  timestamp,
}: {
  url: string;
  loading?: boolean;
  failed?: boolean;
  timestamp?: string;
}) => {
  const { width } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Calculate responsive dimensions
  const screenPadding = 16;
  const gap = 12;
  const numColumns = 2;
  const availableWidth = width - screenPadding * 2 - gap * (numColumns - 1);
  const itemWidth = availableWidth / numColumns;
  const aspectRatio = 2 / 3; // 2:3 aspect ratio
  const itemHeight = itemWidth / aspectRatio; // Height = width / (2/3) = width * 1.5

  const handlePress = () => {
    if (!loading) {
      setIsModalVisible(true);
    }
  };

  // const handleDownload = async () => {
  //   try {
  //     console.log({ url });

  //     // Get the original file extension from URL
  //     const urlParts = url.split('.');
  //     const originalExtension = urlParts[urlParts.length - 1]?.split('?')[0] || 'jpg';

  //     // Create a unique filename with timestamp
  //     const timestamp = new Date().getTime();
  //     const fileName = `generated_image_${timestamp}.${originalExtension}`;
  //     const fileUri = FileSystem.documentDirectory + fileName;

  //     // Download the image with better quality settings
  //     const downloadResult = await FileSystem.downloadAsync(url, fileUri, {
  //       // Add headers to request higher quality if available
  //       headers: {
  //         Accept: 'image/*',
  //         'Accept-Encoding': 'identity', // Prevent compression
  //       },
  //     });

  //     if (downloadResult.status === 200) {
  //       // Check file quality after download
  //       const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
  //       // Note: FileInfo doesn't include size, so we'll just log the download was successful

  //       console.log('Downloaded image quality:', {
  //         uri: downloadResult.uri,
  //         status: downloadResult.status,
  //         extension: originalExtension,
  //       });

  //       // Try different approaches based on platform
  //       if (Platform.OS === 'ios') {
  //         // For iOS, use sharing to save to photos
  //         const isAvailable = await Sharing.isAvailableAsync();
  //         if (isAvailable) {
  //           await Sharing.shareAsync(downloadResult.uri, {
  //             mimeType: `image/${originalExtension}`,
  //             dialogTitle: 'Save Image to Photos',
  //           });
  //           Alert.alert('Success', 'Image shared! You can save it to your photos.');
  //         } else {
  //           // Fallback to MediaLibrary
  //           const { status } = await MediaLibrary.requestPermissionsAsync();
  //           if (status === 'granted') {
  //             const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
  //             await MediaLibrary.createAlbumAsync('Generated Images', asset, false);
  //             Alert.alert('Success', 'Image saved to your gallery!');
  //           }
  //         }
  //       } else {
  //         // For Android, try direct MediaLibrary save first
  //         const { status } = await MediaLibrary.requestPermissionsAsync();
  //         if (status === 'granted') {
  //           const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
  //           await MediaLibrary.createAlbumAsync('Generated Images', asset, false);
  //           Alert.alert('Success', 'Image saved to your gallery!');
  //         } else {
  //           // Fallback to sharing
  //           const isAvailable = await Sharing.isAvailableAsync();
  //           if (isAvailable) {
  //             await Sharing.shareAsync(downloadResult.uri, {
  //               mimeType: `image/${originalExtension}`,
  //               dialogTitle: 'Save Image',
  //             });
  //             Alert.alert('Success', 'Image shared! You can save it to your photos.');
  //           }
  //         }
  //       }
  //     } else {
  //       Alert.alert('Error', 'Failed to download image');
  //     }
  //   } catch (error) {
  //     console.error('Download error:', error);
  //     Alert.alert('Error', 'Failed to save image to gallery');
  //   }
  // };

  // Alternative download method using direct URL approach
  const handleDownloadAlternative = async () => {
    try {
      console.log('Alternative download method:', { url });

      // For iOS, try to open the URL directly in Safari/Photos
      if (Platform.OS === 'ios') {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          // Create a temporary file with the original URL
          const tempFileName = `temp_image_${Date.now()}.jpg`;
          const tempFileUri = FileSystem.documentDirectory + tempFileName;

          // Download without any processing
          const downloadResult = await FileSystem.downloadAsync(url, tempFileUri);

          if (downloadResult.status === 200) {
            await Sharing.shareAsync(downloadResult.uri, {
              mimeType: 'image/jpeg',
              dialogTitle: 'Save High Quality Image',
            });
            Alert.alert(
              'Success',
              'Image shared! Use "Save to Photos" to save with original quality.'
            );
          }
        }
      } else {
        // For Android, use MediaLibrary directly
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          const tempFileName = `temp_image_${Date.now()}.jpg`;
          const tempFileUri = FileSystem.documentDirectory + tempFileName;

          const downloadResult = await FileSystem.downloadAsync(url, tempFileUri);

          if (downloadResult.status === 200) {
            const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
            await MediaLibrary.createAlbumAsync('Generated Images', asset, false);
            Alert.alert('Success', 'Image saved with original quality!');
          }
        }
      }
    } catch (error) {
      console.error('Alternative download error:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  // Third method: Direct URL sharing for maximum quality
  const handleDirectShare = async () => {
    try {
      console.log('Direct share method:', { url });

      // Try to share the URL directly
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // For direct URL sharing, we need to download first
        const tempFileName = `direct_share_${Date.now()}.jpg`;
        const tempFileUri = FileSystem.documentDirectory + tempFileName;

        // Download with minimal processing
        const downloadResult = await FileSystem.downloadAsync(url, tempFileUri);

        if (downloadResult.status === 200) {
          await Sharing.shareAsync(downloadResult.uri, {
            mimeType: 'image/jpeg',
            dialogTitle: 'Save Original Quality Image',
            UTI: 'public.jpeg', // iOS specific
          });
          Alert.alert('Success', 'Image shared! Select "Save to Photos" for best quality.');
        }
      } else {
        Alert.alert('Error', 'Sharing not available on this device');
      }
    } catch (error) {
      console.error('Direct share error:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <View className="relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <Image
            source={{ uri: url }}
            className="rounded-xl"
            style={{
              width: itemWidth,
              height: itemHeight,
              backgroundColor: '#f3f4f6',
            }}
            resizeMode="cover"
          />

          {loading && !failed && (
            <View
              className="absolute inset-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1,
              }}>
              <Text className="text-black">{timestamp}</Text>
              <ActivityIndicator size="large" color="#ffffff" style={{ zIndex: 1000 }} />
            </View>
          )}
          {failed && (
            <View className="absolute inset-0 items-center justify-center rounded-xl">
              <Text className="text-white">Failed</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black bg-opacity-75">
          <TouchableOpacity
            className="absolute right-4 top-12 z-10"
            onPress={() => setIsModalVisible(false)}>
            <View className="rounded-full bg-white p-2">
              <Text className="text-xl">✕</Text>
            </View>
          </TouchableOpacity>

          <View className="mx-4 overflow-hidden rounded-xl bg-white">
            <Image
              source={{ uri: url }}
              style={{
                width: screenWidth - 32,
                height: (screenWidth - 32) / (2 / 3), // 2:3 aspect ratio
                backgroundColor: '#f3f4f6',
              }}
              resizeMode="cover"
            />

            <View className="space-y-3 p-4">
              <TouchableOpacity
                onPress={handleDownloadAlternative}
                className="items-center rounded-lg bg-blue-500 px-6 py-3">
                <Text className="text-lg font-semibold text-white">⬇️ Download Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDownloadAlternative}
                className="items-center rounded-lg bg-green-500 px-6 py-3">
                <Text className="text-lg font-semibold text-white">💾 Save High Quality</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDirectShare}
                className="items-center rounded-lg bg-purple-500 px-6 py-3">
                <Text className="text-lg font-semibold text-white">📱 Share & Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GenerateCard;

const styles = StyleSheet.create({});
