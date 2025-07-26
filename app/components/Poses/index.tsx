import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import PosesCard from '../PosesCard';
import { StepOption, useAppStore } from '~/store/store';

const posesData = [
  { id: '1', image: require('../../../assets/models/1.jpg'), name: 'Standing' },
  { id: '2', image: require('../../../assets/models/2.jpg'), name: 'Sitting' },
  { id: '3', image: require('../../../assets/models/3.jpg'), name: 'Lying' },
  { id: '4', image: require('../../../assets/models/4.jpg'), name: 'Walking' },
  { id: '5', image: require('../../../assets/models/5.jpg'), name: 'Running' },
  { id: '6', image: require('../../../assets/models/6.jpg'), name: 'Dancing' },
  { id: '7', image: require('../../../assets/models/1.jpg'), name: 'Yoga' },
  { id: '8', image: require('../../../assets/models/2.jpg'), name: 'Fitness' },
  { id: '9', image: require('../../../assets/models/3.jpg'), name: 'Casual' },
  { id: '10', image: require('../../../assets/models/4.jpg'), name: 'Formal' },
  { id: '11', image: require('../../../assets/models/5.jpg'), name: 'Action' },
  { id: '12', image: require('../../../assets/models/6.jpg'), name: 'Relaxed' },
];

const Poses = () => {
  const { categories } = useAppStore();
  let steps = categories.find((category) => category.name === 'Woman')?.steps;
  let selectPoseStep = steps?.find((step) => step.name === 'pose');
  const [selectedPose, setSelectedPose] = useState<any>(null);
  console.log({ selectPoseStep });
  const renderPoseCard = ({ item }: { item: StepOption }) => (
    <View className="mx-2 mb-4 flex-1">
      <PosesCard
        image={item.image}
        name={item.name}
        onPress={() => setSelectedPose(item.id)}
        isSelected={selectedPose?.id === item.id}
      />
    </View>
  );

  return (
    <View className="mt-8 flex-1">
      <FlatList
        data={selectPoseStep?.options}
        renderItem={renderPoseCard}
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

export default Poses;

const styles = StyleSheet.create({});
