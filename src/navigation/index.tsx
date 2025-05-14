import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home';
import SplashScreen from '../screens/splash';
import { MainParamList, RootParamList } from './root';

const MainStack = createNativeStackNavigator<MainParamList>();

const MainNavigation = () => {
  return (
    <MainStack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <MainStack.Screen name={'Home'} component={HomeScreen} />
    </MainStack.Navigator>
  );
};

const rootOptions: NativeStackNavigationOptions = {
  gestureEnabled: true,
  fullScreenGestureEnabled: true,
  header: () => null,
  animation: 'fade',
  animationDuration: 300,
};

const RootStack = createNativeStackNavigator<RootParamList>();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={rootOptions}>
        <RootStack.Screen name={'Splash'} component={SplashScreen} />
        <RootStack.Screen name={'Main'} component={MainNavigation} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export { RootNavigation, RootStack };
