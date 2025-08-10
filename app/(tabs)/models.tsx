import { FlatList, StyleSheet, Text, View, RefreshControl, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import useGenerateStore from '~/store/useGenerate';
import RootLayout from '../components/RootLayout';
import GenerateCard from '../components/GenerateCard';
import { useWindowDimensions } from 'react-native';

const Profile = () => {
  const { generations, fetchGenerations, socketGenerations } = useGenerateStore();
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

  // Calculate responsive grid dimensions
  const screenPadding = 16;
  const gap = 12;
  const numColumns = 2;
  const availableWidth = width - screenPadding * 2 - gap * (numColumns - 1);
  const itemWidth = availableWidth / numColumns;

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGenerations({ page: 1, pageSize: 64 });
    setRefreshing(false);
  };

  const renderGridItem = ({ item, index }: { item: any; index: number }) => (
    <View
      key={index}
      style={{
        width: itemWidth,
        marginBottom: gap,
        marginRight: index % numColumns === 0 ? gap : 0,
      }}>
      <GenerateCard
        failed={item.failed}
        loading={!item.faceSwapUrl}
        url={item.faceSwapUrl || item.editedImageUrl || item.inputImage || ''}
        timestamp={item.timestamp}
      />
    </View>
  );

  const renderGridItemFromGenerations = ({ item, index }: { item: any; index: number }) => (
    <View
      key={index}
      style={{
        width: itemWidth,
        marginBottom: gap,
        marginRight: index % numColumns === 0 ? gap : 0,
      }}>
      <GenerateCard url={item.swaped_url} />
    </View>
  );

  const renderSectionHeader = (title: string, count: number) => (
    <View className="mb-4 mt-6">
      <Text className="mb-2 text-xl font-bold text-gray-800">{title}</Text>
      <Text className="text-sm text-gray-500">{count} items</Text>
    </View>
  );

  return (
    <RootLayout>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}>
        {/* Socket Generations Section */}
        {socketGenerations.length > 0 && (
          <>
            {renderSectionHeader('Recent Generations', socketGenerations.length)}
            <View className="flex-row flex-wrap justify-start">
              {socketGenerations
                .filter((item) => item.faceSwapUrl || item.editedImageUrl || item.inputImage)
                .map((item, index) => renderGridItem({ item, index }))}
            </View>
          </>
        )}

        {/* Saved Generations Section */}
        {generations.length > 0 && (
          <>
            {renderSectionHeader('Saved Generations', generations.length)}
            <View className="flex-row flex-wrap justify-start">
              {generations
                .filter((item) => item.swaped_url)
                .map((item, index) => renderGridItemFromGenerations({ item, index }))}
            </View>
          </>
        )}

        {/* Empty State */}
        {socketGenerations.length === 0 && generations.length === 0 && (
          <View className="flex-1 items-center justify-center" style={{ minHeight: 400 }}>
            <View className="mb-4 rounded-full bg-gray-100 p-6">
              <Text className="text-4xl">📸</Text>
            </View>
            <Text className="mb-2 text-xl font-semibold text-gray-800">No Generations Yet</Text>
            <Text className="px-8 text-center text-gray-500">
              Your generated images will appear here once you create them
            </Text>
          </View>
        )}
      </ScrollView>
    </RootLayout>
  );
};

export default Profile;

const styles = StyleSheet.create({});
