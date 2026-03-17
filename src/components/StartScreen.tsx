import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  onStart: () => void; 
}

const StartScreen = ({ onStart }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Funny Quiz</Text>
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  title: { fontSize: 40, fontWeight: 'bold', color: '#fff', marginBottom: 30 },
  button: { backgroundColor: '#be29ec', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});

export default StartScreen;