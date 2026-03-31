import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

// --- MOCK DATA ---
const MOCK_FAVORITES = [
  {
    id: 'p5',
    name: 'Giày Sneaker Nam Da Bò Thật Cao Cấp',
    price: 1250000,
    imageUrl: 'https://via.placeholder.com/300/87CEEB/000000?text=Product+5',
  },
  {
    id: 'p8',
    name: 'Đồng Hồ Cơ Automatic Chính Hãng LOBINNI',
    price: 3890000,
    imageUrl: 'https://via.placeholder.com/300/F0E68C/000000?text=Product+8',
  },
  {
    id: 'p12',
    name: 'Balo Laptop Chống Sốc, Chống Nước',
    price: 899000,
    imageUrl: 'https://via.placeholder.com/300/D3D3D3/000000?text=Product+12',
  },
  {
    id: 'p15',
    name: 'Nước Hoa Nam Bleu De Chanel EDP 100ml',
    price: 3200000,
    imageUrl: 'https://via.placeholder.com/300/ADD8E6/000000?text=Product+15',
  },
    {
    id: 'p21',
    name: 'Máy Ảnh Sony Alpha A6400 Kit 16-50mm',
    price: 21500000,
    imageUrl: 'https://via.placeholder.com/300/C0C0C0/000000?text=Product+21',
  },
];

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- MAIN COMPONENT ---
const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);

  const handleUnfavorite = (itemId) => {
    setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== itemId));
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      className="flex-1 m-2 bg-white rounded-xl shadow-lg"
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      accessibilityRole="button"
      accessibilityLabel={item.name}
      accessibilityHint="Double tap to view product details"
    >
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full aspect-square rounded-t-xl"
        accessibilityRole="image"
        accessibilityLabel={`Image of ${item.name}`}
      />
      <View className="p-3 flex-1 justify-between">
        <Text className="text-sm text-text mb-2" numberOfLines={2}>{item.name}</Text>
        <View className="flex-row justify-between items-center mt-auto">
            <Text className="text-base font-bold text-primary flex-1">{formatCurrency(item.price)}</Text>
            <TouchableOpacity
              onPress={() => handleUnfavorite(item.id)}
              accessibilityRole="button"
              accessibilityLabel="Remove from favorites"
              accessibilityHint={`Double tap to remove ${item.name} from your favorites`}
              accessibilityState={{ selected: true }}
            >
                <Text className="text-2xl text-red-500">❤️</Text>
            </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-5 mt-[30%]">
        <Text className="text-8xl mb-5">💔</Text>
        <Text className="text-xl font-bold text-text">Chưa có sản phẩm yêu thích</Text>
        <Text className="text-base text-gray-600 mt-2 mb-6 text-center">Hãy lướt và thả tim cho sản phẩm bạn thích nhé!</Text>
        <TouchableOpacity
          className="bg-primary px-10 py-3 rounded-full"
          onPress={() => navigation.navigate('Home')}
          accessibilityRole="button"
          accessibilityLabel="Start shopping"
          accessibilityHint="Double tap to go to the home screen and start shopping"
        >
            <Text className="text-white text-base font-bold">Bắt đầu mua sắm</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 bg-white border-b border-gray-300">
        <Text className="text-2xl font-bold text-text text-center">Sản phẩm yêu thích</Text>
      </View>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

export default FavoritesScreen;
