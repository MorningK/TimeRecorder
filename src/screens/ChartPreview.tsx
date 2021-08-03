import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Area,
  Chart,
  ChartDataPoint,
  HorizontalAxis,
  Line,
  Tooltip,
  VerticalAxis,
} from 'react-native-responsive-linechart';
import moment from 'moment';
import {RecordItemsType} from '../database/realm';

export type ChartPreviewProps = {
  records: RecordItemsType[];
};
const contentInset = {
  top: 48,
  bottom: 24,
  left: 48,
  right: 48,
};

const ChartPreview: React.FC<ChartPreviewProps> = ({
  records,
}: ChartPreviewProps) => {
  const data = useMemo(() => {
    return records.map((item, index) => ({
      meta: {
        _id: item._id.toHexString(),
        value: item.value,
        create_time: item.create_time,
      },
      x: index,
      y: item.value,
    }));
  }, [records]);
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

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChartPreview;
