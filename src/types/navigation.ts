import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Stats: undefined;
  Achievements: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 