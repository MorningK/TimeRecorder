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

export const createObject = async <T>(
  database: DatabaseType,
  objectName: string,
  data: T,
) => {
  if (database) {
    return new Promise<T & Realm.Object>((resolve, reject) => {
      database.write(() => {
        try {
          resolve(database.create<T>(objectName, data));
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  return null;
};

export const updateObject = async <T>(
  database: DatabaseType,
  objectName: string,
  id: ObjectId | string | number,
  updater: (origin: T & Realm.Object) => T & Realm.Object,
) => {
  if (database) {
    return new Promise<T & Realm.Object>((resolve, reject) => {
      database.write(() => {
        const data = database.objectForPrimaryKey<T>(objectName, id);
        if (data) {
          resolve(updater(data));
        } else {
          reject(data);
        }
      });
    });
  }
  return null;
};

export const deleteObject = async (
  database: DatabaseType,
  objectName: string,
  id: ObjectId | string | number,
) => {
  if (database) {
    return new Promise<boolean>((resolve, reject) => {
      database.write(() => {
        try {
          const data = database.objectForPrimaryKey(objectName, id);
          database.delete(data);
          return resolve(true);
        } catch (e) {
          return reject(e);
        }
      });
    });
  } else {
    return false;
  }
};

export type DatabaseType = Realm | null;
export type ResultType = Realm.Results<any> | null | Array<any>;
