import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {RecordOperationProps} from '../screens/RecordList';
import {Button, Icon} from 'react-native-elements';

export type Props = {
  value?: number;
} & RecordOperationProps;

const CountingRecordOperation = ({onComplete, value}: Props) => {
  const onConfirm = () => {
    onComplete && onComplete({value: value ? value + 1 : 1});
  };
  return (
    <View style={styles.body}>
      <Text>添加记录项</Text>
      <Icon name={'add-task'} onPress={onConfirm} />
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

export default CountingRecordOperation;
