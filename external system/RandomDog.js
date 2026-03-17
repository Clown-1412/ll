import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

export default function RandomDog() {
  const [dogUrl, setDogUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const fetchDogImage = async () => {
      setIsLoading(true); 
      try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        setDogUrl(data.message); 
        setIsLoading(false); 
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    fetchDogImage();
  }, [trigger]); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐶 Trạm Cứu Hộ Chó 🐶</Text>
      
      {/* ActivityIndicator là vòng tròn xoay xoay có sẵn của React Native */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 50 }} />
      ) : (
        <Image 
          source={{ uri: dogUrl }} 
          style={styles.image} 
        />
      )}
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setTrigger(trigger + 1)}
      >
        <Text style={styles.buttonText}>Tìm chó khác! 🐾</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 300, 
    height: 300, 
    borderRadius: 10, 
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});