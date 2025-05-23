import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { FAB } from 'react-native-paper';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';
import { useStats } from '../hooks/useStats';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const { updateLocationStats } = useStats();

  const handleLocationUpdate = useCallback((newLocation: Location.LocationObject) => {
    setLocation(newLocation);
    updateLocationStats(newLocation);
  }, [updateLocationStats]);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const setupLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permesso di localizzazione negato');
        return;
      }

      const initialLocation = await Location.getCurrentPositionAsync({});
      handleLocationUpdate(initialLocation);

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        handleLocationUpdate
      );
    };

    setupLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [handleLocationUpdate]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 45.4642,
          longitude: location?.coords.longitude || 9.1900,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {location && (
          <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={50}
            strokeColor="rgba(0,0,0,0.5)"
            fillColor="rgba(0,0,0,0.3)"
          />
        )}
      </MapView>

      <FAB
        style={styles.fab}
        icon="chart-bar"
        onPress={() => navigation.navigate('Stats')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 