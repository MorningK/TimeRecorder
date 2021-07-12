import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export type TimeSelectionProps = {};

const TimeSelection: React.FC<TimeSelectionProps> =
  ({}: TimeSelectionProps) => {
    return (
      <View style={styles.container}>
        <Text>TimeSelection</Text>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TimeSelection;
