import React from 'react';
import { FlatList, Text, View, SafeAreaView } from 'react-native';

const NumberListDemo = () => {
  // Tạo mảng dữ liệu gồm 100 phần tử {id: '0', title: 'Item 0', ...}
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i.toString(),
    title: `Item ${i}`,
  }));

  const renderItem = ({ item }: { item: { title: string } }) => (
    <View className="p-5 border-b border-gray-300">
      <Text className="text-base">{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} // keyExtractor giúp tối ưu hiệu năng [cite: 1150]
        initialNumToRender={10} // Tối ưu: Chỉ render trước 10 dòng
      />
    </SafeAreaView>
  );
};

export default NumberListDemo;