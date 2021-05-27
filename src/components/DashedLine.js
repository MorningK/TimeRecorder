import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const DashedLine = ({
  horiz = false,
  size = 10,
  length = 1000,
  margin = 5,
  backgroundColor = '#eaeff3',
}) => {
  const num = Math.ceil(length / (size + margin));
  const a = [];
  for (let i = 0; i < num; i++) {
    a.push(i);
  }
  return (
    <View style={[horiz ? styles.horizBox : styles.vertBox]}>
      {a.map(item => (
        <View
          key={item}
          style={[
            {backgroundColor: backgroundColor},
            horiz ? {width: size} : {height: size},
            horiz ? {marginRight: margin} : {marginBottom: margin},
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  horizBox: {
    flexDirection: 'row',
    height: 1,
  },
  vertBox: {
    flexDirection: 'column',
    width: 1,
  },
});

export default DashedLine;
