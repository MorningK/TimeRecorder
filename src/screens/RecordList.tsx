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
import {
  createObject,
  deleteObject,
  ResultType,
  updateObject,
} from '../database/database';
import logger from '../log';
import {FAB, Icon, ListItem} from 'react-native-elements';
import {
  BOOLEAN_RECORD_TYPE,
  COUNTING_RECORD_TYPE,
  EmptyObject,
  INPUTTING_RECORD_TYPE,
  RATING_RECORD_TYPE,
  RecordeTypes,
  TIMING_RECORD_TYPE,
} from '../common/constant';
import AbstractRecord from '../components/AbstractRecord';
import RatingRecordOperation from '../components/RatingRecordOperation';
import {ObjectId} from 'bson';
import CountingRecordOperation from '../components/CountingRecordOperation';
import TimingRecordOperation from '../components/TimingRecordOperation';
import Toast from 'react-native-simple-toast';
import InputtingRecordOperation from '../components/InputtingRecordOperation';
import BooleanRecordOperation from '../components/BooleanRecordOperation';

export type Props = EmptyObject;

export type RecordOperationProps = {
  onComplete: (data: {
    value: number | string;
    step?: number;
  }) => Promise<boolean>;
  id: string;
};
export const defaultRecordOperationProps: RecordOperationProps = {
  onComplete: data => {
    return Promise.resolve(true);
  },
  id: '2333',
};

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
        Toast.show('保存失败');
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
        Toast.show(recordItem !== null ? '保存成功' : '保存失败');
        return recordItem !== null;
      } catch (e) {
        logger.error('save record item error', e);
        return false;
      }
    };
    const onDelete = () => {
      console.log('delete item', record);
      return new Promise<boolean>((resolve, reject) => {
        deleteObject(database, Record.schema.name, record._id)
          .then(success => {
            Toast.show(success ? '删除成功' : '删除失败');
            success && getRecords();
            resolve(success);
          })
          .catch(e => {
            console.error('delete error', e);
            Toast.show('删除失败');
            reject(e);
          });
      });
    };
    let operationComponent = <EmptyElement />;
    if (record.type === RATING_RECORD_TYPE.value) {
      operationComponent = (
        <RatingRecordOperation
          id={record._id.toHexString()}
          showRating={true}
          onComplete={onComplete}
        />
      );
    } else if (record.type === COUNTING_RECORD_TYPE.value) {
      let last = 0;
      if (record.items?.length && record.items.length > 0) {
        last = record.items[record.items.length - 1].value;
      }
      operationComponent = (
        <CountingRecordOperation
          id={record._id.toHexString()}
          onComplete={onComplete}
          length={last}
        />
      );
    } else if (record.type === TIMING_RECORD_TYPE.value) {
      operationComponent = (
        <TimingRecordOperation
          id={record._id.toHexString()}
          onComplete={onComplete}
        />
      );
    } else if (record.type === INPUTTING_RECORD_TYPE.value) {
      operationComponent = (
        <InputtingRecordOperation
          id={record._id.toHexString()}
          onComplete={onComplete}
        />
      );
    } else if (record.type === BOOLEAN_RECORD_TYPE.value) {
      operationComponent = (
        <BooleanRecordOperation
          id={record._id.toHexString()}
          onComplete={onComplete}
        />
      );
    }
    return (
      <View style={styles.renderItem}>
        <AbstractRecord
          renderProps={props}
          OperationComponent={operationComponent}
          onDelete={onDelete}
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
