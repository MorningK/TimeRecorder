import {FileSelector} from '../native/modules';
import {Permission, PermissionsAndroid, Platform} from 'react-native';

export const checkPermission = (permission: Permission): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
          resolve(true);
        } else {
          const granted = await PermissionsAndroid.request(permission, {
            title: '申请保存数据文件',
            message: '保存数据文件需要你的授权，如需导出请选择同意',
            buttonNegative: '拒绝',
            buttonNeutral: '稍后询问',
            buttonPositive: '同意',
          });
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      } else {
        reject();
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const exportFile = async (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    FileSelector.show(
      {
        title: '导出文件',
        multi: false,
        method: 'write',
        filename: filename,
      },
      (path: string) => {
        console.log('select file for write', path);
        resolve(path);
      },
      () => {
        console.log('exportStorageConfig export');
        reject();
      },
    );
  });
};

export const importFile = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    FileSelector.show(
      {
        title: '导入文件',
        multi: false,
        method: 'read',
      },
      (path: string) => {
        console.log('select file for read', path);
        resolve(path);
      },
      () => {
        console.log('cancel import');
        reject();
      },
    );
  });
};
