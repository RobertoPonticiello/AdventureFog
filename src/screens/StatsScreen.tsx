import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useApp } from '../context/AppContext';

export default function StatsScreen() {
  const { stats } = useApp();

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatArea = (squareMeters: number) => {
    if (squareMeters < 10000) {
      return `${Math.round(squareMeters)}m²`;
    }
    return `${(squareMeters / 10000).toFixed(2)}ha`;
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Distanza Totale</Title>
          <Paragraph>{formatDistance(stats.totalDistance)}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Area Esplorata</Title>
          <Paragraph>{formatArea(stats.exploredArea)}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Tempo di Esplorazione</Title>
          <Paragraph>{formatTime(stats.explorationTime)}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
}); 