import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {RecordOperationProps} from '../screens/RecordList';

export type BooleanRecordOperationProps = RecordOperationProps;

const BooleanRecordOperation = ({onComplete}: BooleanRecordOperationProps) => {
  const onSubmit = (value: boolean) => {
    onComplete({
      value: value ? 1 : 0,
    });
  };
  return (
    <View style={styles.body}>
      <Icon name={'thumb-down-alt'} onPress={() => onSubmit(false)} />
      <Icon name={'thumb-up-alt'} onPress={() => onSubmit(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
});

export default BooleanRecordOperation;
