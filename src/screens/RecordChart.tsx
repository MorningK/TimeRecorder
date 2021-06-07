import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDatabase, useRecord} from '../hooks';
import logger from '../log';
import {RouteProp} from '@react-navigation/native';
import {Record, RecordType} from '../database/realm';
import Realm from 'realm';
import {useFocusEffect} from '@react-navigation/core';
import {ObjectId} from 'bson';

export type Props = {
  route: RouteProp<{params: {recordId: string}}, 'params'>;
};

const RecordChart: React.FC<Props> = ({route}: Props) => {
  const recordId = route.params.recordId;
  logger.log('recordId', recordId);
  const database = useDatabase();
  const record = useRecord(database, recordId);
  return (
    <View style={styles.container}>
      <Text>RecordChart</Text>
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

export default RecordChart;
