import {useCallback, useEffect, useMemo, useState} from 'react';
import {closeDatabase, DatabaseType, openDatabase} from '../database/database';
import {Record, RecordItemsType, RecordType} from '../database/realm';
import Realm from 'realm';
import {useFocusEffect} from '@react-navigation/core';
import {ObjectId} from 'bson';
import moment from 'moment';

export const useDatabase = (): DatabaseType => {
  const [database, setDatabase] = useState(null as DatabaseType);
  useEffect(() => {
    if (database === null || database.isClosed) {
      openDatabase().then(db => {
        console.log('open database', db);
        setDatabase(db);
      });
    }
    return () => {
      if (database !== null && !database.isClosed) {
        closeDatabase(database);
        console.log('close database');
      }
      setDatabase(null);
    };
  }, []);
  return database;
};

export const useRecord = (database: DatabaseType, recordId: string) => {
  const [record, setRecord] = useState(
    {} as (RecordType & Realm.Object) | undefined,
  );
  useFocusEffect(
    useCallback(() => {
      if (database && !database.isClosed) {
        const result = database.objectForPrimaryKey<RecordType>(
          Record.schema.name,
          new ObjectId(recordId),
        );
        console.log('objectForPrimaryKey', JSON.stringify(result));
        setRecord(result);
      } else {
        setRecord({} as (RecordType & Realm.Object) | undefined);
      }
      return () => {
        setRecord({} as (RecordType & Realm.Object) | undefined);
      };
    }, [database, database?.isClosed, recordId]),
  );
  return record;
};

export const useRecordItems = (
  record: (RecordType & Realm.Object) | undefined,
  values: number[],
  times: Date[],
): RecordItemsType[] => {
  const formatDate = (date: Date): string => {
    return moment(date).format('YYYYMMDD');
  };
  return useMemo(() => {
    let data = record?.items || [];
    if (data && data.length > 0) {
      if (values.length === 1 && !isNaN(values[0])) {
        data = data.filter(item => item.value === values[0]);
      } else if (values.length === 2) {
        if (!isNaN(values[0])) {
          data = data.filter(item => item.value >= values[0]);
        }
        if (!isNaN(values[1])) {
          data = data.filter(item => item.value <= values[1]);
        }
      }
      if (times.length === 1) {
        data = data.filter(
          item => formatDate(item.create_time) === formatDate(times[0]),
        );
      } else if (times.length === 2) {
        if (times[0] !== null) {
          data = data.filter(
            item => formatDate(item.create_time) >= formatDate(times[0]),
          );
        }
        if (times[1] !== null) {
          data = data.filter(
            item => formatDate(item.create_time) <= formatDate(times[1]),
          );
        }
      }
    }
    return data;
  }, [values, times, record?.items]);
};
