import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CheckBox, Icon, Input} from 'react-native-elements';
import {BOOLEAN_RECORD_TYPE, COUNTING_RECORD_TYPE} from '../common/constant';
import InputtingRecordOperation from './InputtingRecordOperation';
import {
  RecordOperationDataType,
  RecordOperationProps,
} from '../screens/RecordList';
import MoreLessIcon from './MoreLessIcon';
import CommonStyles from '../common/CommonStyles';

export type ValueRangerProps = {
  recordType: number;
  onValueChange: (value: number | number[]) => void;
};

const selectionTypes = [
  {title: '精确值', value: 1},
  {title: '范围值', value: 2},
];

const ValueRanger: React.FC<ValueRangerProps> = ({
  recordType,
  onValueChange,
}: ValueRangerProps) => {
  const [type, setType] = useState(1);
  const [showInput, setShowInput] = useState(true);
  const [rangeValue, setRangeValue] = useState(['', '']);
  const onTypeChange = (value: number) => {
    setType(value);
  };
  const input = useMemo(() => {
    if (recordType === BOOLEAN_RECORD_TYPE.value) {
      return (
        <View style={styles.booleanContainer}>
          <Icon name={'thumbs-up-down'} onPress={() => onValueChange(NaN)} />
          <Icon name={'thumb-down-alt'} onPress={() => onValueChange(0)} />
          <Icon name={'thumb-up-alt'} onPress={() => onValueChange(1)} />
        </View>
      );
    }
    if (type === 1) {
      const onInputChange = async ({value}: RecordOperationDataType) => {
        await onValueChange(
          typeof value === 'string' ? parseFloat(value) : value,
        );
        return true;
      };
      return (
        <InputtingRecordOperation
          onComplete={onInputChange}
          placeholder={'请输入要查找的数值'}
          id={'520'}
          autoClear={false}
        />
      );
    }
    const onRangeChange = (idx: number, value: string) => {
      setRangeValue(state => {
        return state.map((val, index) => {
          if (index === idx) {
            return value;
          }
          return val;
        });
      });
    };
    const onSubmitRange = () => {
      onValueChange(rangeValue.map(value => parseFloat(value)));
    };
    return (
      <View style={styles.rangeInputContainer}>
        <View>
          <View style={styles.inputContainer}>
            <Text>From:</Text>
            <Input
              containerStyle={styles.rangeInput}
              placeholder={'请输入开始值'}
              value={rangeValue[0]}
              keyboardType={'numeric'}
              rightIcon={
                <Icon name={'clear'} onPress={() => onRangeChange(0, '')} />
              }
              onChangeText={value => onRangeChange(0, value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>To:</Text>
            <Input
              containerStyle={styles.rangeInput}
              placeholder={'请输入结束值'}
              value={rangeValue[1]}
              keyboardType={'numeric'}
              rightIcon={
                <Icon name={'clear'} onPress={() => onRangeChange(1, '')} />
              }
              onChangeText={value => onRangeChange(1, value)}
            />
          </View>
        </View>
        <Icon name={'done'} onPress={onSubmitRange} />
      </View>
    );
  }, [onValueChange, rangeValue, recordType, type]);
  if (recordType === COUNTING_RECORD_TYPE.value || recordType < 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.typeContainer}>
          <Text>取值搜索:</Text>
          {selectionTypes.map(item => (
            <CheckBox
              key={item.value}
              containerStyle={styles.checkboxContainer}
              checkedIcon={<Icon name="radio-button-checked" />}
              uncheckedIcon={<Icon name="radio-button-unchecked" />}
              title={item.title}
              checked={type === item.value}
              onPress={() => onTypeChange(item.value)}
            />
          ))}
        </View>
        <MoreLessIcon expand={showInput} onExpandChange={setShowInput} />
      </View>
      <View
        style={[
          showInput ? CommonStyles.displayFlex : CommonStyles.displayNone,
        ]}>
        {input}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#33333333',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 24,
    backgroundColor: 'white',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxContainer: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
    backgroundColor: 'white',
    borderWidth: 0,
  },
  booleanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 50,
  },
  rangeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rangeInput: {
    width: '80%',
  },
});

export default ValueRanger;
