import {useEffect, useState} from 'react';
import {closeDatabase, DatabaseType, openDatabase} from '../database/database';

export const useDatabase = () => {
  const [database, setDatabase] = useState(null as DatabaseType);
  useEffect(() => {
    openDatabase().then(db => {
      console.log('open database', db);
      setDatabase(db);
    });
    return () => {
      closeDatabase(database);
      console.log('close database');
      setDatabase(null);
    };
  }, []);
  return database;
};
