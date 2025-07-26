import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Models from '../components/Models';
import { useAppStore } from '~/store/store';

export default function ModelsPage() {
  const { steps } = useAppStore();
  const models = steps.find((step) => step.name === 'Select Model');
  console.log(models);
  return (
    <View style={styles.container}>
      <Models />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
