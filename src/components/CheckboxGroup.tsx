import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CheckBox, Icon} from 'react-native-elements';

export type CheckboxGroupOption = {
  name: string;
  value: string | number;
};

export type CheckboxGroupProps = {
  options: CheckboxGroupOption[];
  value: string | number;
  onValueChange: (value: string | number) => void;
  horizontal?: boolean;
};

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value,
  onValueChange,
  horizontal,
}: CheckboxGroupProps) => {
  return (
    <View style={[styles.container, horizontal && styles.horizontal]}>
      {options.map(recordType => (
        <View key={recordType.value}>
          <CheckBox
            containerStyle={styles.checkboxContainer}
            checkedIcon={<Icon name="radio-button-checked" />}
            uncheckedIcon={<Icon name="radio-button-unchecked" />}
            title={recordType.name}
            checked={value === recordType.value}
            onPress={() => onValueChange(recordType.value)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  checkboxContainer: {
    paddingHorizontal: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'white',
  },
  horizontal: {
    flexDirection: 'row',
  },
});

export default CheckboxGroup;
