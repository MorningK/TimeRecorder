import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import logger from '../log';
import {useDatabase} from '../hooks';
import {Record, RecordType} from '../database/realm';
import {ObjectId} from 'bson';
import Realm from 'realm';
import moment from 'moment';

export type Props = {
  route: RouteProp<{params: {recordId: string}}, 'params'>;
};

const RecordItemList: React.FC<Props> = ({route}: Props) => {
  const recordId = route.params.recordId;
  logger.log('recordId', recordId);
  const database = useDatabase();
  const [record, setRecord] = useState(
    {} as (RecordType & Realm.Object) | undefined,
  );
  useEffect(() => {
    if (database) {
      const result = database.objectForPrimaryKey<RecordType>(
        Record.schema.name,
        new ObjectId(recordId),
      );
      console.log('objectForPrimaryKey', result);
      setRecord(result);
    }
  }, [database, recordId]);
  return (
    <View style={styles.container}>
      <Text>记录名称：{record != null && record.name}</Text>
      <Text>
        创建时间：
        {record != null &&
          moment(record.create_time).format('YYYY-MM-DD HH:mm:ss')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RecordItemList;
