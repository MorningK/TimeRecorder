import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import RNDates from 'react-native-dates';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export type TimePickerProps = {
  visible: boolean;
  onConfirm: (date: Date | Date[]) => void;
  onCancel: () => void;
};

const TimePicker: React.FC<TimePickerProps> = ({
  onCancel,
  onConfirm,
  visible,
}: TimePickerProps) => {
  return (
    <DateTimePickerModal
      mode={'date'}
      isVisible={visible}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TimePicker;
