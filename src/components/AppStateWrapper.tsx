import React, { createContext, FC, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, View } from 'react-native';

type AppStateContextType = {
  currentAppState: string;
  isActive: boolean;
  lastActiveTimestamp: number | null;
};

const AppStateContext = createContext<AppStateContextType>({
  currentAppState: AppState.currentState,
  isActive: AppState.currentState === 'active',
  lastActiveTimestamp: null,
});

type Props = { children?: React.ReactNode };

export const AppStateWrapper: FC<Props> = ({ children }) => {
  const appStateRef = useRef(AppState.currentState);

  const [currentAppState, setCurrentAppState] = useState<AppStateStatus>(AppState.currentState);
  const [isActive, setIsActive] = useState<boolean>(AppState.currentState === 'active');
  const [lastActiveTimestamp, setLastActiveTimestamp] = useState<number | null>(
    AppState.currentState === 'active' ? Date.now() : null,
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        console.info('[AppStateWrapper]: App has come to the foreground!');
        setIsActive(true);
        setLastActiveTimestamp(Date.now());
      } else if (nextAppState.match(/inactive|background/)) {
        console.info('[AppStateWrapper]: App has gone to the background!');
        setIsActive(false);
      }

      appStateRef.current = nextAppState;
      setCurrentAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const contextValue: AppStateContextType = {
    currentAppState,
    isActive,
    lastActiveTimestamp,
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      <View style={{ flex: 1 }}>{children}</View>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
