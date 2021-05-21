import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {ThemeProvider} from "react-native-elements";

export type Props = {};

const App: React.FC<Props> = ({}) => {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <View style={styles.container}>
                    <Text>App</Text>
                </View>
            </NavigationContainer>
        </ThemeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default App;
