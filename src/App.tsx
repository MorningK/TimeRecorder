import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Index from './screens/Index';
import {useColorScheme} from 'react-native';
import {EmptyObject} from './common/constant';
import Setting from './screens/Setting';
export type Props = EmptyObject;

const Drawer = createDrawerNavigator();

const App: React.FC<Props> = ({}) => {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider useDark={colorScheme === 'dark'}>
      <SafeAreaProvider>
        <StatusBar
          hidden={false}
          translucent={true}
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <NavigationContainer>
          <Drawer.Navigator initialRouteName={'Index'} drawerType={'front'}>
            <Drawer.Screen
              name={'Index'}
              component={Index}
              options={{title: '首页'}}
            />
            <Drawer.Screen
              name={'Setting'}
              component={Setting}
              options={{title: '设置'}}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
