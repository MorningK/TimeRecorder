import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export type SettingProps = {};

const Setting: React.FC<SettingProps> = ({}: SettingProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Setting</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Setting;
