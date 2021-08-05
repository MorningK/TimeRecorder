import Realm from 'realm';
import {
  databaseStoragePath,
  Record,
  RecordType,
  Schema,
  SchemaVersion,
} from './realm';
import logger from '../log';

export const openDatabase = (): ProgressPromise => {
  logger.log('open database', databaseStoragePath, Schema);
  return Realm.open({
    path: databaseStoragePath,
    schema: Schema,
    schemaVersion: SchemaVersion,
    migration: (oldRealm, newRealm) => {
      if (oldRealm.schemaVersion < 3) {
        const newObjects = newRealm.objects<RecordType>(Record.schema.name);
        for (const objKey in newObjects) {
          const newObj = newObjects[objKey];
          newObj.private = false;
        }
      }
    },
  });
};

export const closeDatabase = (db: DatabaseType): void => {
  logger.log('close database', db);
  db && !db.isClosed && db.close();
};

export const queryObject = <T>(
  database: DatabaseType,
  objectName: string,
  filter?: string,
  order?: string,
  reverse?: boolean,
): Realm.Results<T> | [] => {
  if (database) {
    let list = database.objects<T>(objectName);
    if (filter) {
      list = list.filtered(filter);
    }
    if (order) {
      list = list.sorted(order, reverse);
    }
    return list;
  } else {
    return [];
  }
};

export const createObject = async <T>(
  database: DatabaseType,
  objectName: string,
  data: T,
): Promise<(T & Realm.Object) | null> => {
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
): Promise<(T & Realm.Object) | null> => {
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
): Promise<boolean> => {
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
export type ResultType<T> = Realm.Results<T> | null | Array<T>;
