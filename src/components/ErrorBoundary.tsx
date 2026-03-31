import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Cập nhật state để hiển thị giao diện thay thế sau khi có lỗi [cite: 869]
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Nơi để log lỗi ra các dịch vụ giám sát như Sentry [cite: 880]
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Rất tiếc, đã có lỗi xảy ra!</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'Lỗi không xác định'}
          </Text>
          <Button title="Thử lại" onPress={this.handleReset} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  message: { fontSize: 14, color: 'red', marginBottom: 20, textAlign: 'center' },
});