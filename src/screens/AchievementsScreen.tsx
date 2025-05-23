import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Avatar, Divider } from 'react-native-paper';

const achievements = [
  {
    id: '1',
    title: 'Esploratore Principiante',
    description: 'Esplora 1 km² di territorio',
    icon: 'map-marker',
    completed: false,
  },
  {
    id: '2',
    title: 'Camminatore',
    description: 'Raggiungi 10 km di camminata',
    icon: 'walk',
    completed: false,
  },
  {
    id: '3',
    title: 'Scopritore',
    description: 'Sblocca 5 aree nuove',
    icon: 'star',
    completed: false,
  },
];

export default function AchievementsScreen() {
  return (
    <ScrollView style={styles.container}>
      {achievements.map((achievement, index) => (
        <React.Fragment key={achievement.id}>
          <List.Item
            title={achievement.title}
            description={achievement.description}
            left={props => (
              <Avatar.Icon
                {...props}
                icon={achievement.icon}
                style={[
                  styles.icon,
                  achievement.completed && styles.completedIcon,
                ]}
              />
            )}
          />
          {index < achievements.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  icon: {
    backgroundColor: '#e0e0e0',
  },
  completedIcon: {
    backgroundColor: '#4CAF50',
  },
}); 