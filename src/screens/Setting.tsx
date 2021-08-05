import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Header, Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/core';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import AddRecord from './AddRecord';
import RecordList from './RecordList';
import RecordItemList from './RecordItemList';
import RecordChart from './RecordChart';
import Home from './Home';

export type SettingProps = {
  navigation: DrawerNavigationProp<any>,
};
const Stack = createStackNavigator();
const screens = [
  {
    name: 'Home',
    component: Home,
    title: '设置',
    icon: 'menu',
    onPress: (navigation: DrawerNavigationProp<any>) => {
      navigation.toggleDrawer();
    },
  },
];

const Setting: React.FC<SettingProps> = ({}: SettingProps) => {
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
  },
  headerLeft: {
    paddingLeft: 16,
  },
});

export default Setting;
