import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

interface Stats {
  totalDistance: number;
  exploredArea: number;
  explorationTime: number;
  lastPosition: Location.LocationObject | null;
}

interface AppContextType {
  stats: Stats;
  updateStats: (newStats: Partial<Stats>) => void;
  exploredAreas: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
  }>;
  addExploredArea: (latitude: number, longitude: number) => void;
}

const defaultStats: Stats = {
  totalDistance: 0,
  exploredArea: 0,
  explorationTime: 0,
  lastPosition: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [exploredAreas, setExploredAreas] = useState<Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
  }>>([]);

  // Carica i dati salvati all'avvio
  useEffect(() => {
    loadSavedData();
  }, []);

  // Salva i dati quando cambiano
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('stats', JSON.stringify(stats));
        await AsyncStorage.setItem('exploredAreas', JSON.stringify(exploredAreas));
      } catch (error) {
        console.error('Errore nel salvataggio dei dati:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000); // Debounce di 1 secondo
    return () => clearTimeout(timeoutId);
  }, [stats, exploredAreas]);

  const loadSavedData = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('stats');
      const savedAreas = await AsyncStorage.getItem('exploredAreas');
      
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
      if (savedAreas) {
        setExploredAreas(JSON.parse(savedAreas));
      }
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
    }
  };

  const updateStats = useCallback((newStats: Partial<Stats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  }, []);

  const addExploredArea = useCallback((latitude: number, longitude: number) => {
    setExploredAreas(prev => [
      ...prev,
      { latitude, longitude, timestamp: Date.now() }
    ]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        stats,
        updateStats,
        exploredAreas,
        addExploredArea,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve essere usato all\'interno di un AppProvider');
  }
  return context;
} 