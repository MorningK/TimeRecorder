import {findNodeHandle, MeasureOnSuccessCallback, UIManager} from 'react-native';
import * as React from 'react';

export const getLayout = (
  ref: null | number | React.Component<any, any> | React.ComponentClass<any>,
) => {
  const handle = findNodeHandle(ref);

  return new Promise<any>(resolve => {
    if (handle != null) {
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        resolve({
          x,
          y,
          width,
          height,
          pageX,
          pageY,
        });
      });
    }
  });
};

export const formatReadableTime = (ms: number) => {
  let second = ms / 1000;
  let minute = second / 60;
  let hour = minute / 60;
  let time = '';
  if (Math.floor(hour) > 0) {
    hour = Math.floor(hour);
    time = time + `${hour}小时`;
    minute = minute % 60;
  }
  if (Math.floor(minute) > 0) {
    minute = Math.floor(minute);
    time = time + `${minute}分钟`;
    second = second % 60;
  }
  if (Math.floor(second) > 0) {
    second = Math.floor(second);
    time = time + `${second}秒`;
    ms = ms % 1000;
  }
  if (ms > 0) {
    time = time + `${ms}毫秒`;
  }
  return time;
};
