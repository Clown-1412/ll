import React from 'react';
import { FlatList, Text, StyleSheet, View, SafeAreaView } from 'react-native';

const NumberListDemo = () => {
  // Tạo mảng dữ liệu gồm 100 phần tử {id: '0', title: 'Item 0', ...}
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i.toString(),
    title: `Item ${i}`,
  }));

  const renderItem = ({ item }: { item: { title: string } }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} // keyExtractor giúp tối ưu hiệu năng [cite: 1150]
        initialNumToRender={10} // Tối ưu: Chỉ render trước 10 dòng
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: { fontSize: 16 },
});

export default NumberListDemo;