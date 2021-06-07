import {useCallback, useEffect, useState} from 'react';
import {closeDatabase, DatabaseType, openDatabase} from '../database/database';
import {Record, RecordType} from '../database/realm';
import Realm from 'realm';
import {useFocusEffect} from '@react-navigation/core';
import {ObjectId} from 'bson';

export const useDatabase = () => {
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
    }, [database, recordId]),
  );
  return record;
};
