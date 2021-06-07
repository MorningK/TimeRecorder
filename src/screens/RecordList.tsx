import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDatabase} from '../hooks';
import {
  Record,
  RecordItems,
  RecordItemsType,
  RecordType,
} from '../database/realm';
import Realm from 'realm';
import {useNavigation, useFocusEffect} from '@react-navigation/core';
import {createObject, ResultType, updateObject} from '../database/database';
import logger from '../log';
import {FAB, Icon, ListItem} from 'react-native-elements';
import {
  EmptyObject,
  PERCENTAGE_RECORD_TYPE,
  RecordeTypes,
} from '../common/constant';
import AbstractRecord from '../components/AbstractRecord';
import PercentageRecordOperation from '../components/PercentageRecordOperation';
import {ObjectId} from 'bson';

export type Props = EmptyObject;

const EmptyElement = () => {
  return <Text>添加记录项</Text>;
};

const RecordList: React.FC<Props> = ({}) => {
  const navigation = useNavigation();
  const [list, setList] = useState([] as ResultType);
  const database = useDatabase();
  const getRecords = useCallback(() => {
    if (database != null && !database.isClosed) {
      const records = database.objects<RecordType>(Record.schema.name);
      logger.log('get records', records.length);
      setList(records);
    } else {
      setList([]);
    }
  }, [database]);
  useFocusEffect(getRecords);
  const gotoAddRecord = () => {
    navigation.navigate('AddRecord');
  };
  const renderItem = (props: ListRenderItemInfo<RecordType>) => {
    const {item: record} = props;
    const onComplete = async (data: {
      value: number | string;
      step?: number;
    }) => {
      if (database == null) {
        logger.error('database is null');
        return false;
      }
      console.log('onComplete', data);
      const value =
        typeof data.value === 'string' ? parseFloat(data.value) : data.value;
      try {
        const recordItem: (RecordItemsType & Realm.Object) | null =
          await createObject<RecordItemsType>(
            database,
            RecordItems.schema.name,
            new RecordItems(
              value,
              database.objectForPrimaryKey<RecordType>(
                Record.schema.name,
                record._id,
              ),
            ).data,
          );
        if (recordItem) {
          console.log('record is ', record, '; recordItem is', recordItem);
          const result = await updateObject<RecordType>(
            database,
            Record.schema.name,
            record._id,
            object => {
              if (object.items && object.items.length > 0) {
                object.items.push(recordItem);
              } else {
                object.items = [recordItem];
              }
              return object;
            },
          );
          console.log('update result', result);
        }
        return recordItem !== null;
      } catch (e) {
        logger.error('save record item error', e);
        return false;
      }
    };
    let operationComponent = <EmptyElement />;
    if (record.type === PERCENTAGE_RECORD_TYPE.value) {
      operationComponent = (
        <PercentageRecordOperation showRating={true} onComplete={onComplete} />
      );
    }
    return (
      <View style={styles.renderItem}>
        <AbstractRecord
          renderProps={props}
          OperationComponent={operationComponent}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item._id.toHexString()}
      />
      <FAB
        containerStyle={styles.addContainer}
        buttonStyle={styles.addBtn}
        iconContainerStyle={styles.addIcon}
        placement="right"
        visible={true}
        icon={<Icon name="add" />}
        raised={true}
        onPress={gotoAddRecord}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  renderItem: {
    width: '100%',
  },
  addContainer: {},
  addBtn: {
    borderRadius: 28,
    width: 56,
    height: 56,
    overflow: 'hidden',
  },
  addIcon: {},
});

export default RecordList;
