import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {RecordOperationProps} from '../screens/RecordList';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';

export type TimingRecordOperationProps = {} & RecordOperationProps;

const TimingRecordOperation = ({onComplete}: TimingRecordOperationProps) => {
  const [step, setStep] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const onStart = () => {
    setStep(2);
    setStartTime(new Date().getTime());
    Toast.show('记录开始时间');
  };
  const onEnd = () => {
    if (startTime > 0) {
      Toast.show('记录结束时间');
      onComplete({
        value: new Date().getTime() - startTime,
      }).then(() => {
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
