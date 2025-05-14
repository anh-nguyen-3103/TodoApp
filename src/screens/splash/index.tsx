import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AppText } from '../../components/AppText';
import { localization } from '../../localization';
import { AppNavigationProp } from '../../navigation/root';
import { styles } from './styles';

const SplashScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Main');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <AppText.H1 text={localization['splash-page'].title} />
    </View>
  );
};

export default SplashScreen;
