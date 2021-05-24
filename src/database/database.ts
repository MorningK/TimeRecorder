import Realm from 'realm';
import {databaseStoragePath, Schema, SchemaVersion} from './realm';
import logger from '../log';

export const openDatabase = async () => {
  logger.log('open database', databaseStoragePath, Schema);
  return Realm.open({
    path: databaseStoragePath,
    schema: Schema,
    schemaVersion: SchemaVersion,
    migration: (oldRealm, newRealm) => {},
  });
};

export const closeDatabase = (db: DatabaseType) => {
  logger.log('close database', db);
  db && db.close();
};

export const createObject = async (
  database: DatabaseType,
  objectName: string,
  data: object,
) => {
  return (
    database &&
    database.write(() => {
      database.create(objectName, data);
    })
  );
};

export type DatabaseType = Realm | null;
export type ResultType = Realm.Results<any> | null | Array<any>;
