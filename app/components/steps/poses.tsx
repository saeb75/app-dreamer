import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import { MotiView } from 'moti';
import PosesCard from '../PosesCard';
import { StepOption, useAppStore } from '~/store/store';
import useGenerateStore from '~/store/useGenerate';

const Poses = () => {
  const { categories } = useAppStore();

  let steps = categories.find((category) => category.name === 'Woman')?.steps;

  const { setSelectedPose, selectedPose, selectedModel } = useGenerateStore();
  let selectPoseStep = steps?.find((step) => step.name === 'pose');
  let options = selectPoseStep?.options.filter(
    (option) => option.description === selectedModel?.description
  );

  const renderPoseCard = ({ item, index }: { item: StepOption; index: number }) => (
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
      <PosesCard
        image={item.image}
        name={item.name}
        onPress={() => {
          setSelectedPose(item);
        }}
        isSelected={selectedPose?.id === item.id}
      />
    </MotiView>
  );

  return (
    <View className="mt-8 flex-1">
      <FlatList
        data={options}
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
