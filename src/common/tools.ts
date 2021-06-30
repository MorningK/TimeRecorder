import {findNodeHandle, UIManager} from 'react-native';
import * as React from 'react';

export const getLayout = (
  ref: null | number | React.Component<any, any> | React.ComponentClass<any>,
) => {
  const handle = findNodeHandle(ref);

  return new Promise(resolve => {
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
