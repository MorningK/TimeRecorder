import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDatabase, useRecord, useRecordItems} from '../hooks';
import logger from '../log';
import {RouteProp} from '@react-navigation/native';
import {Record, RecordItemsType, RecordType} from '../database/realm';
import Realm from 'realm';
import {useFocusEffect} from '@react-navigation/core';
import {ObjectId} from 'bson';
import {LineChart, XAxis, YAxis, Grid} from 'react-native-svg-charts';
import moment from 'moment';
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
  ChartDataPoint,
} from 'react-native-responsive-linechart';

export type Props = {
  route: RouteProp<
    {params: {recordId: string; values: number[]; times: number[]}},
    'params'
  >;
};
const contentInset = {
  top: 48,
  bottom: 24,
  left: 48,
  right: 48,
};

const RecordChart: React.FC<Props> = ({route}: Props) => {
  const recordId = route.params.recordId;
  const values = route.params.values;
  const times = route.params.times.map(t => new Date(t));
  logger.log('recordId', recordId);
  const database = useDatabase();
  const record = useRecord(database, recordId);
  const items = useRecordItems(record, values, times);
  const data = useMemo(() => {
    return items.map((item, index) => ({
      meta: {
        _id: item._id.toHexString(),
        value: item.value,
        create_time: item.create_time,
      },
      x: index,
      y: item.value,
    }));
  }, [items]);
  console.log('data', data);
  const onTooltipSelect = (value: ChartDataPoint, index: number) => {
    console.log('onTooltipSelect', value, index);
  };
  const tooltipTheme = {
    shape: {
      width: 200,
    },
    formatter: (p: ChartDataPoint) => {
      const time = moment(p.meta.create_time).format('YYYY-MM-DD HH:mm:ss.SSS');
      return `${p.y.toFixed(2)}@${time}`;
    },
  };
  const maxY = useMemo(() => {
    if (data && data.length > 0) {
      const y = data.reduce((previousValue, currentValue) => {
        return previousValue.y > currentValue.y ? previousValue : currentValue;
      }, data[0]);
      return y.y;
    } else {
      return 1;
    }
  }, [data]);
  const yTickValues = useMemo(() => {
    const result = new Set<number>();
    for (let i = 0; i < data.length; i++) {
      result.add(data[i].y);
    }
    return Array.from(result);
  }, [data]);
  if (data.length <= 0) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.container}>
      <Chart
        style={styles.container}
        data={data}
        yDomain={{min: 0, max: maxY}}
        xDomain={{min: 0, max: data.length}}
        padding={contentInset}
        viewport={{
          size: {
            width: Math.min(10, data.length),
            height: Math.max(maxY, 1),
          },
          initialOrigin: {x: 0, y: 0},
        }}>
        <VerticalAxis
          tickValues={yTickValues}
          theme={{labels: {formatter: v => v.toFixed(2)}}}
        />
        <HorizontalAxis tickValues={data.map(p => p.x)} />
        <Area
          theme={{
            gradient: {
              from: {color: '#3265bd'},
              to: {color: '#3265bd', opacity: 0.2},
            },
          }}
          smoothing={'cubic-spline'}
        />
        <Line
          tooltipComponent={<Tooltip theme={tooltipTheme} />}
          onTooltipSelect={onTooltipSelect}
          hideTooltipAfter={2000}
          hideTooltipOnDragEnd={true}
          smoothing={'cubic-spline'}
          theme={{stroke: {color: '#12449b', width: 2}}}
        />
      </Chart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    // flexDirection: 'column',
    // width: '100%',
    // height: '100%',
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
