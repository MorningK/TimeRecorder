import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDatabase, useRecord, useRecordItems} from '../hooks';
import logger from '../log';
import {RouteProp} from '@react-navigation/native';
import {CheckBox, Icon} from 'react-native-elements';
import ChartPreview from './ChartPreview';
import CommonStyles from '../common/CommonStyles';
import CalendarPreview from './CalendarPreview';

export type Props = {
  route: RouteProp<
    {params: {recordId: string; values: number[]; times: number[]}},
    'params'
  >;
};
const selectionTypes = [
  {value: 1, title: '折线图'},
  {value: 2, title: '日程图'},
];

const RecordChart: React.FC<Props> = ({route}: Props) => {
  const recordId = route.params.recordId;
  const values = route.params.values;
  const times = route.params.times.map(t => new Date(t));
  logger.log('recordId', recordId);
  const database = useDatabase();
  const record = useRecord(database, recordId);
  const items = useRecordItems(record, values, times);
  const [type, setType] = useState(1);
  const onTypeChange = (value: number) => {
    setType(value);
  };
  if (items.length <= 0) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.typeContainer}>
        <Text>展示类型:</Text>
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
      <View
        style={[
          styles.container,
          type === 1 ? CommonStyles.displayFlex : CommonStyles.displayNone,
        ]}>
        <ChartPreview records={items} />
      </View>
      <View
        style={[
          styles.container,
          type === 2 ? CommonStyles.displayFlex : CommonStyles.displayNone,
        ]}>
        <CalendarPreview records={items} recordType={record?.type} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    // flexDirection: 'column',
    // width: '100%',
    // height: '100%',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },
  checkboxContainer: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
    backgroundColor: 'white',
    borderWidth: 0,
  },
});

export default RecordChart;
