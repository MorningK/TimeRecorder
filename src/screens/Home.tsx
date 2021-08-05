import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import {Button} from 'react-native-elements';
import {databaseStoragePath} from '../database/realm';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {checkPermission, exportFile, importFile} from '../common/file';
import {EmptyObject} from '../common/constant';
import {err} from 'react-native-svg/lib/typescript/xml';

export type HomeProps = EmptyObject;

const Home: React.FC<HomeProps> = ({}: HomeProps) => {
  const exportDBfile = async () => {
    const hasPermission = await checkPermission(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (hasPermission) {
      const filename = `timerecord-${moment().format('YYYY-MM-DD')}.realm`;
      const destPath = await exportFile(filename);
      try {
        await RNFS.copyFile(databaseStoragePath, destPath);
        Toast.show('文件已保存');
      } catch (e) {
        Toast.show('文件保存失败,请稍后重试');
      }
    } else {
      Toast.show('文件保存失败,请授权后重试');
    }
  };
  const importDBfile = async () => {
    const hasPermission = await checkPermission(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    if (hasPermission) {
      const destPath = await importFile();
      try {
        const stat = await RNFS.readFile(destPath, 'base64');
        console.log('file stat', stat);
        await RNFS.writeFile(databaseStoragePath, stat, 'base64');
        Toast.show('数据导入成功');
      } catch (e) {
        console.error(e);
        Toast.show('数据导入失败,请稍后重试');
      }
    } else {
      Toast.show('数据导入失败,请授权后重试');
    }
  };
  return (
    <View style={styles.container}>
      <Button
        containerStyle={styles.btn}
        title={'导出数据'}
        type={'outline'}
        onPress={exportDBfile}
      />
      <Button
        containerStyle={styles.btn}
        title={'导入数据'}
        type={'outline'}
        onPress={importDBfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  btn: {
    marginVertical: 6,
  },
});

export default Home;
