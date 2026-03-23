import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
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

const COLORS = {
  primary: '#007bff',
  background: '#f8f9fa',
  white: '#ffffff',
  text: '#343a40',
  red: '#dc3545',
};

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
    <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>{formatCurrency(item.price)}</Text>
            <TouchableOpacity onPress={() => handleUnfavorite(item.id)}>
                <Text style={styles.favoriteIcon}>❤️</Text>
            </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💔</Text>
        <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
        <Text style={styles.emptySubtitle}>Hãy lướt và thả tim cho sản phẩm bạn thích nhé!</Text>
        <TouchableOpacity style={styles.shopNowButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopNowButtonText}>Bắt đầu mua sắm</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
      </View>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  gridContainer: {
    padding: 8,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: '30%',
  },
  emptyIcon: {
      fontSize: 80,
      marginBottom: 20,
  },
  emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.text,
  },
  emptySubtitle: {
      fontSize: 16,
      color: '#6c757d',
      marginTop: 8,
      marginBottom: 24,
      textAlign: 'center',
  },
  shopNowButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 40,
      paddingVertical: 12,
      borderRadius: 30,
  },
  shopNowButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: 'bold',
  },
  // Favorite Item Card
  cardContainer: {
    flex: 0.5,
    margin: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
        },
        android: {
            elevation: 4,
        },
    }),
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
      padding: 12,
      flex: 1,
      justifyContent: 'space-between',
  },
  cardName: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1, // Allow price to take up space
  },
  favoriteIcon: {
      fontSize: 24,
      color: COLORS.red,
  },
});

export default FavoritesScreen;
