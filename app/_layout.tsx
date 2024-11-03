import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';


import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './screens/gameScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { LogBox } from "react-native";
import colors from './util/constants';
LogBox.ignoreLogs([
    "Possible warning",
]);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const [isEnable, setIsEnable] = useState(true);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    const changeEnable = (isEnable: boolean) => {
        setIsEnable(isEnable);
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <SafeAreaView style={[styles.container, { backgroundColor: isEnable ? colors.background : colors.disabledBackground }]}>
                <GestureHandlerRootView>
                    <HomeScreen questionCount={3} stageNum={2} changeEnable={changeEnable} />
                </GestureHandlerRootView>
            </SafeAreaView>
        </ThemeProvider>
    );
};

export default RootLayout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF5EB',
    },
});
