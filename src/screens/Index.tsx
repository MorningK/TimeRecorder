import React from 'react';
import {StyleSheet} from 'react-native';
import {EmptyObject} from '../common/constant';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import AddRecord from './AddRecord';
import RecordList from './RecordList';
import RecordItemList from './RecordItemList';
import RecordChart from './RecordChart';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/core';
import {DrawerNavigationProp} from '@react-navigation/drawer';

export type Props = EmptyObject;
const Stack = createStackNavigator();

const screens = [
  {
    name: 'AddRecord',
    component: AddRecord,
    title: '新增记录项',
    icon: 'arrow-back',
    onPress: (navigation: StackNavigationProp<any>) => {
      navigation.goBack();
    },
  },
  {
    name: 'RecordList',
    component: RecordList,
    title: '记录项列表',
    icon: 'menu',
    onPress: (navigation: DrawerNavigationProp<any>) => {
      navigation.toggleDrawer();
    },
  },
  {
    name: 'RecordItemList',
    component: RecordItemList,
    title: '记录列表',
    icon: 'arrow-back',
    onPress: (navigation: StackNavigationProp<any>) => {
      navigation.goBack();
    },
  },
  {
    name: 'RecordChart',
    component: RecordChart,
    title: '记录图表',
    icon: 'arrow-back',
    onPress: (navigation: StackNavigationProp<any>) => {
      navigation.goBack();
    },
  },
];

const Index: React.FC<Props> = ({}) => {
  useNavigation();
  return (
    <Stack.Navigator initialRouteName="RecordList">
      {screens.map(item => (
        <Stack.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={({navigation}) => ({
            title: item.title,
            headerLeft: () => (
              <Icon
                containerStyle={styles.headerLeft}
                size={23}
                color={'black'}
                name={item.icon}
                onPress={() => item.onPress(navigation)}
              />
            ),
          })}
        />
      ))}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headerLeft: {
    paddingLeft: 16,
  },
});

export default Index;
