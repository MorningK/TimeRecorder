import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import TimePicker from './TimePicker';
import moment from 'moment';

export type TimeSelectionProps = {
  onValueChange: (range: Date | Date[]) => void;
  times: Date[];
};

const TimeSelection: React.FC<TimeSelectionProps> = ({
  onValueChange,
  times,
}: TimeSelectionProps) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const clearInput = () => {
    onValueChange([]);
  };
  const handleConfirm = async (date: Date | Date[]) => {
    console.log('A date has been picked: ', date);
    await onValueChange(date);
    hideDatePicker();
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>时间搜索:</Text>
        <Icon
          containerStyle={styles.titleIcon}
          name={'date-range'}
          onPress={showDatePicker}
        />
        {times.length > 0 && (
          <View style={styles.inputContainer}>
            <Text style={styles.titleText}>
              {times.map(t => moment(t).format('YYYY-MM-DD')).join(' ')}
            </Text>
            <Icon
              containerStyle={styles.titleIcon}
              name={'clear'}
              onPress={clearInput}
            />
          </View>
        )}
      </View>
      <TimePicker
        visible={isDatePickerVisible}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#33333333',
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 12,
  },
  titleText: {
    color: 'black',
    marginRight: 12,
  },
  titleIcon: {},
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default TimeSelection;
