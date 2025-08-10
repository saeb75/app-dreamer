import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import { MotiView } from 'moti';
import ModelCard from '../ModelCard';
import { StepOption, useAppStore } from '~/store/store';
import useGenerateStore from '~/store/useGenerate';

const Models = () => {
  const { categories } = useAppStore();
  const { setSelectedModel, selectedModel } = useGenerateStore();
  let steps = categories.find((category) => category.name === 'Woman')?.steps;
  let selectModelStep = steps?.find((step) => step.name === 'model');

  const renderModelCard = ({ item, index }: { item: StepOption; index: number }) => {
    return (
      <MotiView
        className="mx-2 mb-4 flex-1"
        from={{
          opacity: 0,
          translateY: 50,
        }}
        animate={{
          opacity: 1,
          translateY: 0,
        }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: index * 100, // Stagger delay
        }}>
        <ModelCard
          image={item.image}
          name={item.name}
          onPress={() => {
            setSelectedModel(item);
          }}
          isSelected={selectedModel?.id === item.id}
        />
      </MotiView>
    );
  };

  return (
    <View className="flex-1 pt-8">
      <FlatList
        data={selectModelStep?.options}
        renderItem={renderModelCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
      />
    </View>
  );
};

export default Models;

const styles = StyleSheet.create({});
