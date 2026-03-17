import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Question } from '../data/questions';

interface Props {
  question: Question;
  index: number;
  total: number;
  onSelect: (answerIndex: number) => void;
}

const GameScreen = ({ question, index, total, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Câu hỏi {index + 1}/{total}</Text>
      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{question.content}</Text>
      </View>
      <View style={styles.answerContainer}>
        {question.answers.map((ans, idx) => ( // Dùng vòng lặp in đáp án
          <TouchableOpacity 
            key={idx} 
            style={styles.answerButton} 
            onPress={() => onSelect(idx)}
          >
            <Text style={styles.answerText}>{ans}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  questionBox: { backgroundColor: '#fff', padding: 20, borderRadius: 15, minHeight: 150, justifyContent: 'center' },
  questionText: { fontSize: 20, textAlign: 'center' },
  answerContainer: { marginTop: 30 },
  answerButton: { backgroundColor: '#3d85c6', padding: 15, borderRadius: 10, marginBottom: 10 },
  answerText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});

export default GameScreen;