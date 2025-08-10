import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import Tabs from './components/tabs';
import RootLayout from './components/RootLayout';

const Carousel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <RootLayout>
      <Tabs
        data={[
          { name: 'Carousel', icon: 'home', component: <Text>Carousel</Text> },
          { name: 'Carousel', icon: 'add', component: <Text>Carousel</Text> },
          { name: 'Carousel', icon: 'add-circle', component: <Text>Carousel</Text> },
          { name: 'Carousel', icon: 'add-circle-outline', component: <Text>Carousel</Text> },
        ]}
        selectedIndex={selectedIndex}
        onTabPress={(index) => setSelectedIndex(index)}
        activeBgColor="black"
        inactiveBgColor="white"
      />
    </RootLayout>
  );
};

export default Carousel;

const styles = StyleSheet.create({});
