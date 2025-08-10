import { Image, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import RootLayout from './components/RootLayout';
import useGenerateStore from '~/store/useGenerate';

const Generate = () => {
  const { socketMessage, generatedImage, isLoading, error } = useGenerateStore();

  const renderGeneratedImages = () => {
    if (!generatedImage) return null;

    return (
      <View style={styles.imagesContainer}>
        <Text style={styles.sectionTitle}>Generated Images</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}>
          {/* Composition Image */}
          <View style={styles.imageCard}>
            <Text style={styles.imageTitle}>Composition</Text>
            <Image
              source={{ uri: generatedImage.compositionUrl }}
              style={styles.generatedImage}
              resizeMode="cover"
            />
          </View>

          {/* Edited Image */}
          <View style={styles.imageCard}>
            <Text style={styles.imageTitle}>Edited Image</Text>
            <Image
              source={{ uri: generatedImage.editedImageUrl }}
              style={styles.generatedImage}
              resizeMode="cover"
            />
          </View>

          {/* Face Swap Image */}
          <View style={styles.imageCard}>
            <Text style={styles.imageTitle}>Face Swap</Text>
            <Image
              source={{ uri: generatedImage.faceSwapUrl }}
              style={styles.generatedImage}
              resizeMode="cover"
            />
          </View>
        </ScrollView>

        <View style={styles.generationInfo}>
          <Text style={styles.infoText}>Generation ID: {generatedImage.generationId}</Text>
        </View>
      </View>
    );
  };

  const renderSocketMessage = () => {
    if (!socketMessage) return null;

    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageTitle}>Status</Text>
        <Text style={styles.messageText}>{socketMessage}</Text>
      </View>
    );
  };

  const renderLoadingState = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Generating your images...</Text>
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading || generatedImage || socketMessage || error) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Generated Images</Text>
        <Text style={styles.emptyText}>
          Start by selecting a model and pose, then upload your photos to generate images.
        </Text>
      </View>
    );
  };

  return (
    <RootLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Generated Images</Text>
            <Text style={styles.subtitle}>View your AI-generated compositions</Text>
          </View>

          {/* Loading State */}
          {renderLoadingState()}

          {/* Error State */}
          {renderError()}

          {/* Socket Message */}
          {renderSocketMessage()}

          {/* Generated Images */}
          {renderGeneratedImages()}

          {/* Empty State */}
          {renderEmptyState()}
        </View>
      </ScrollView>
    </RootLayout>
  );
};

export default Generate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
  },
  messageContainer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#1976d2',
  },
  imagesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  scrollContainer: {
    marginBottom: 16,
  },
  imageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 200,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  generatedImage: {
    width: 180,
    height: 240,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  generationInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
});
