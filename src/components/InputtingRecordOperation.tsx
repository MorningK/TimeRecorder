import React, {createRef, useRef, useState} from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import {RecordOperationProps} from '../screens/RecordList';
import {Icon, Input} from 'react-native-elements';
import Toast from 'react-native-simple-toast';

export type InputtingRecordOperationProps = RecordOperationProps;

const InputtingRecordOperation = ({
  onComplete,
}: InputtingRecordOperationProps) => {
  const [value, setValue] = useState('');
  const inputRef = createRef<TextInput>();
  const onValueChange = (text: string) => {
    setValue(text);
  };
  const onSubmit = () => {
    if (value.length === 0) {
      Toast.show('请先输入后提交');
      return;
    }
    try {
      const floatValue = parseFloat(value);
      onComplete({
        value: floatValue,
      }).then(() => {
        inputRef.current && inputRef.current.clear();
        setValue('');
      });
    } catch (e) {
      console.error('parseFloat error', e);
      Toast.show('请输入合法的数值');
    }
  };
  return (
    <View style={styles.body}>
      <Input
        ref={inputRef}
        placeholder={'请输入合法数值'}
        keyboardType={'numeric'}
        onChangeText={onValueChange}
        leftIcon={<Icon name={'keyboard'} />}
        leftIconContainerStyle={styles.leftIconContainer}
        rightIcon={<Icon name={'done'} onPress={onSubmit} />}
      />
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
  leftIconContainer: {
    marginRight: 6,
  },
});

export default InputtingRecordOperation;
