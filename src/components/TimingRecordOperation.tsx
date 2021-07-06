import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {RecordOperationProps} from '../screens/RecordList';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {getStorageItem, removeStorageItem, setStorageItem} from '../storage';

export type TimingRecordOperationProps = {} & RecordOperationProps;

const TimingRecordOperation = ({
  onComplete,
  id,
}: TimingRecordOperationProps) => {
  const [step, setStep] = useState(1);
  const [startTime, setStartTime] = useState(0);
  useEffect(() => {
    getStorageItem(id).then(value => {
      if (value) {
        setStartTime(value);
        setStep(2);
      }
    });
  }, [id]);
  const onStart = async () => {
    setStep(2);
    const time = new Date().getTime();
    setStartTime(time);
    await setStorageItem(id, time);
    Toast.show('记录开始时间');
  };
  const onEnd = () => {
    if (startTime > 0) {
      Toast.show('记录结束时间');
      onComplete({
        value: new Date().getTime() - startTime,
      }).then(async () => {
        await removeStorageItem(id);
        setStartTime(0);
        setStep(1);
      });
    } else {
      Toast.show('请先记录开始时间');
    }
  };
  return (
    <View style={styles.body}>
      <View style={styles.startContainer}>
        <Icon name={step === 1 ? 'play-arrow' : 'sync'} onPress={onStart} />
      </View>
      <View style={styles.endContainer}>
        <Icon name={'stop'} onPress={onEnd} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  startContainer: {},
  endContainer: {},
});

export default TimingRecordOperation;
