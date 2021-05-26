import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const DashedLine = ({
  style,
  color,
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
    <View>
      {a.map(item => (
        <View
          key={item}
          style={[
            horiz ? styles.horizBox : styles.vertBox,
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
    width: 10,
    height: 1,
    backgroundColor: '#EAEFF3',
  },
  vertBox: {
    width: 1,
    height: 10,
    backgroundColor: '#EAEFF3',
    marginBottom: 5,
  },
});

export default DashedLine;
