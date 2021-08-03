import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import RNDates from 'react-native-dates';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export type TimeSelectionProps = {
  onValueChange: (range: Date | Date[]) => void;
};

const TimeSelection: React.FC<TimeSelectionProps> = ({
  onValueChange,
}: TimeSelectionProps) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = async (date: Date) => {
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
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
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
});

export default TimeSelection;
