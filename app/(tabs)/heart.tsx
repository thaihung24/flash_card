import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HeartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heart</Text>
      <Text style={styles.subtitle}>Favorites and liked content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});