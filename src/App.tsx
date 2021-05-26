import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import Index from './screens/Index';
import AddRecord from './screens/AddRecord';
import RecordList from './screens/RecordList';
import RecordItemList from './screens/RecordItemList';

export type Props = {};

const Stack = createStackNavigator();

const App: React.FC<Props> = ({}) => {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Index">
            <Stack.Screen name="Index" component={Index} />
            <Stack.Screen name="AddRecord" component={AddRecord} />
            <Stack.Screen name="RecordList" component={RecordList} />
            <Stack.Screen name="RecordItemList" component={RecordItemList} />
          </Stack.Navigator>
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
