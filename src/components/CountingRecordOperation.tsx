import React, {useEffect, useRef} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {RecordOperationProps} from '../screens/RecordList';
import {Button, Icon} from 'react-native-elements';
import {getStorageItem, setStorageItem} from '../storage';

export type CountingRecordOperationProps = {
  length: number | undefined;
} & RecordOperationProps;

const CountingRecordOperation = ({
  onComplete,
  id,
  length,
}: CountingRecordOperationProps) => {
  const last = useRef(0);
  useEffect(() => {
    getStorageItem(id).then(value => {
      last.current = Math.max(value || 0, length || 0);
    });
  }, [id]);
  const onConfirm = () => {
    last.current = last.current + 1;
    onComplete({value: last.current}).then(async r => {
      await setStorageItem(id, last.current);
    });
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
