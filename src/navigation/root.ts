import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootParamList = {
    Splash: undefined;
    Main: MainParamList | undefined;
};

export type MainParamList = {
    Home: undefined;
};

// Navigation prop using only native stack
export type AppNavigationProp = NativeStackNavigationProp<RootParamList>;

// Route prop for accessing route parameters
export type AppRouteProp<T extends keyof RootParamList | keyof MainParamList> = RouteProp<
    RootParamList & MainParamList,
    T
>;

// Union of all screen names
export type AppScreens = keyof RootParamList | keyof MainParamList;
