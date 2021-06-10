import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDatabase, useRecord} from '../hooks';
import logger from '../log';
import {RouteProp} from '@react-navigation/native';
import {Record, RecordItemsType, RecordType} from '../database/realm';
import Realm from 'realm';
import {useFocusEffect} from '@react-navigation/core';
import {ObjectId} from 'bson';
import {LineChart, XAxis, YAxis, Grid} from 'react-native-svg-charts';
import moment from 'moment';

export type Props = {
  route: RouteProp<{params: {recordId: string}}, 'params'>;
};
const contentInset = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

const RecordChart: React.FC<Props> = ({route}: Props) => {
  const recordId = route.params.recordId;
  logger.log('recordId', recordId);
  const database = useDatabase();
  const record = useRecord(database, recordId);
  const data = useMemo(() => {
    const items = record?.items || [];
    return items.map(item => ({
      _id: item._id,
      value: item.value,
      create_time: item.create_time,
    }));
  }, [record]);
  console.log('data', data);
  const yAccessor = (entry: {item: RecordItemsType; index: number}) => {
    return entry.item.value;
  };
  const formatYLabel = (value: any, index: number) => {
    console.log('formatYLabel value, index', value, index);
    return `${value * 100}`;
  };
  const xAccessor = (entry: {item: RecordItemsType; index: number}) => {
    // if (record !== undefined) {
    //   return (
    //     (entry.item.create_time.getTime() - record?.create_time.getTime()) /
    //     (1000 * 60 * 60 * 24)
    //   );
    // }
    // return entry.item.create_time.getTime() / (1000 * 60 * 60 * 24);
    return entry.index + 1;
  };
  const formatXLabel = (value: any, index: number) => {
    console.log('formatXLabel value, index', value, index);
    return `${index + 1}`;
  };
  if (data.length <= 0) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.yAxisContainer}>
        <YAxis
          yAccessor={yAccessor}
          style={styles.yAxis}
          data={data}
          formatLabel={formatYLabel}
          contentInset={contentInset}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
        />
        <LineChart
          style={styles.chart}
          data={data}
          yAccessor={yAccessor}
          xAccessor={xAccessor}
          animate={true}
          contentInset={contentInset}
          svg={{stroke: 'rgb(134, 65, 244)'}}>
          <Grid svg={{fill: 'grey'}} direction={Grid.Direction.BOTH} />
        </LineChart>
      </View>
      <XAxis
        xAccessor={xAccessor}
        style={styles.xAxis}
        data={data}
        formatLabel={formatXLabel}
        contentInset={contentInset}
        svg={{
          fill: 'grey',
          fontSize: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    padding: 12,
  },
  yAxisContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '95%',
  },
  yAxis: {
    width: '5%',
    height: '100%',
  },
  chart: {
    width: '95%',
    height: '100%',
    // backgroundColor: '#00ff00',
  },
  xAxis: {
    marginLeft: '5%',
    width: '95%',
    height: '5%',
  },
});

export default RecordChart;
