import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import logger from '../log';
import {useDatabase} from '../hooks';
import {Record, RecordItemsType, RecordType} from '../database/realm';
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
  const renderItem = (props: {item: RecordItemsType; index: number}) => {
    const {item, index} = props;
    return (
      <View>
        <Text>{index + 1}</Text>
        <Text>{item.value}</Text>
        <Text>{moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text>记录名称：{record != null && record.name}</Text>
      <Text>
        创建时间：
        {record != null &&
          moment(record.create_time).format('YYYY-MM-DD HH:mm:ss')}
      </Text>
      <FlatList
        data={record?.items}
        renderItem={renderItem}
        keyExtractor={item => item._id.toHexString()}
      />
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
