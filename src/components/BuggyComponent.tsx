import React from 'react';
import { Text } from 'react-native';

interface BuggyProps {
  shouldThrow: boolean;
}

const BuggyComponent = ({ shouldThrow }: BuggyProps) => {
  if (shouldThrow) {
    // Chủ động ném lỗi để ErrorBoundary bắt được [cite: 869, 970]
    throw new Error('Màn hình con đã bị crash!');
  }
  return <Text>Mọi thứ vẫn ổn định.</Text>;
};

export default BuggyComponent;