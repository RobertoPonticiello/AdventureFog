import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useApp } from '../context/AppContext';

export function useStats() {
  const { stats, updateStats, addExploredArea } = useApp();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTimeRef.current) / 1000; // in secondi
      updateStats({ explorationTime: stats.explorationTime + elapsedTime });
      startTimeRef.current = currentTime;
    }, 60000);

    return () => {
      clearInterval(timer);
      const finalElapsedTime = (Date.now() - startTimeRef.current) / 1000;
      updateStats({ explorationTime: stats.explorationTime + finalElapsedTime });
    };
  }, []); // Rimuoviamo la dipendenza da stats.explorationTime

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Raggio della Terra in metri
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distanza in metri
  };

  const updateLocationStats = (newLocation: Location.LocationObject) => {
    if (stats.lastPosition) {
      const distance = calculateDistance(
        stats.lastPosition.coords.latitude,
        stats.lastPosition.coords.longitude,
        newLocation.coords.latitude,
        newLocation.coords.longitude
      );

      // Aggiorna la distanza totale
      updateStats({
        totalDistance: stats.totalDistance + distance,
        lastPosition: newLocation,
      });

      // Aggiungi l'area esplorata
      addExploredArea(
        newLocation.coords.latitude,
        newLocation.coords.longitude
      );
    } else {
      updateStats({ lastPosition: newLocation });
    }
  };

  return {
    stats,
    updateLocationStats,
  };
} 