import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export type Props = {};

const RoundButton: React.FC<Props> = ({}) => {
  return (
    <View style={styles.container}>
      <Text>RoundButton</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoundButton;
