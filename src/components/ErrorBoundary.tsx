import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';

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
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-xl font-bold mb-2.5">Rất tiếc, đã có lỗi xảy ra!</Text>
          <Text className="text-sm text-red-500 mb-5 text-center">
            {this.state.error?.message || 'Lỗi không xác định'}
          </Text>
          <Button title="Thử lại" onPress={this.handleReset} />
        </View>
      );
    }
    return this.props.children;
  }
}