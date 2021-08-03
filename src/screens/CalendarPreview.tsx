import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RecordItemsType} from '../database/realm';
import {
  Calendar,
  CalendarList,
  Agenda,
  AgendaItemsMap,
} from 'react-native-calendars';
import moment from 'moment';

export type CalendarPreviewProps = {
  recordType?: number;
  records: RecordItemsType[];
};
const renderEmptyDate = () => <View />;
const renderItem = (item: RecordItemsType, firstItemInDay: boolean) => {
  const type = item.owner?.type;
  console.log('record type is', item, item.owner);
  return (
    <View>
      <Text>{item.value}</Text>
    </View>
  );
};
const rowHasChanged = (r1: RecordItemsType, r2: RecordItemsType) =>
  r1._id.toHexString() !== r2._id.toHexString();

const CalendarPreview: React.FC<CalendarPreviewProps> = ({
  recordType,
  records,
}: CalendarPreviewProps) => {
  const items = useMemo(() => {
    const res = {} as AgendaItemsMap<RecordItemsType>;
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const time = moment(record.create_time).format('YYYY-MM-DD');
      if (res[time] === undefined) {
        res[time] = [record];
      } else {
        res[time].push(record);
      }
    }
    return res;
  }, [records]);
  const minDay = useMemo(() => {
    if (records.length === 0) {
      return '1987-01-01';
    }
    const min = records.reduce((previousValue, currentValue) => {
      return previousValue.create_time.getTime() <
        currentValue.create_time.getTime()
        ? previousValue
        : currentValue;
    }, records[0]);
    return moment(min.create_time).format('YYYY-MM-DD');
  }, [records]);
  const maxDay = useMemo(() => {
    if (records.length === 0) {
      return '2087-01-01';
    }
    const min = records.reduce((previousValue, currentValue) => {
      return previousValue.create_time.getTime() >
        currentValue.create_time.getTime()
        ? previousValue
        : currentValue;
    }, records[0]);
    return moment(min.create_time).format('YYYY-MM-DD');
  }, [records]);
  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        minDate={minDay}
        maxDate={maxDay}
        pastScrollRange={12}
        futureScrollRange={12}
        renderEmptyDate={renderEmptyDate}
        renderItem={renderItem}
        rowHasChanged={rowHasChanged}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CalendarPreview;
