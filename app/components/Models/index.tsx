import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import ModelCard from '../ModelCard';
import { StepOption, useAppStore } from '~/store/store';

const modelsData = [
  { id: '1', image: require('../../../assets/models/1.jpg'), name: 'Ava' },
  { id: '2', image: require('../../../assets/models/2.jpg'), name: 'Emma' },
  { id: '3', image: require('../../../assets/models/3.jpg'), name: 'Olivia' },
  { id: '4', image: require('../../../assets/models/4.jpg'), name: 'Sophia' },
  { id: '5', image: require('../../../assets/models/5.jpg'), name: 'Isabella' },
  { id: '6', image: require('../../../assets/models/6.jpg'), name: 'Ava' },
  { id: '7', image: require('../../../assets/models/1.jpg'), name: 'Emma' },
  { id: '8', image: require('../../../assets/models/2.jpg'), name: 'Olivia' },
  { id: '9', image: require('../../../assets/models/3.jpg'), name: 'Sophia' },
  { id: '10', image: require('../../../assets/models/4.jpg'), name: 'Isabella' },
  { id: '11', image: require('../../../assets/models/5.jpg'), name: 'Ava' },
  { id: '12', image: require('../../../assets/models/6.jpg'), name: 'Emma' },
];

const Models = () => {
  const { categories } = useAppStore();
  let steps = categories.find((category) => category.name === 'Woman')?.steps;
  let selectModelStep = steps?.find((step) => step.name === 'model');

  const [selectedModel, setSelectedModel] = useState(null);
  const renderModelCard = ({ item }: { item: StepOption }) => (
    <View className="mx-2 mb-4 flex-1">
      <ModelCard image={item.image} name={item.name} onPress={() => {}} isSelected={false} />
    </View>
  );

  return (
    <View className="mt-8 flex-1">
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
