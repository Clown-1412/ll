import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

// --- MOCK DATA ---
const MOCK_CART_ITEMS = [
  {
    id: 'p1',
    name: 'Áo Thun Cotton Co Giãn 4 Chiều Unisex Form Rộng',
    price: 159000,
    imageUrl: 'https://via.placeholder.com/200/DDDDDD/000000?text=Product+1',
    quantity: 1,
    shop: 'Coolmate',
  },
  {
    id: 'p2',
    name: 'Tai Nghe Bluetooth Không Dây Marshall Minor III',
    price: 2500000,
    imageUrl: 'https://via.placeholder.com/200/B0E0E6/000000?text=Product+2',
    quantity: 1,
    shop: 'Gadget Store',
  },
  {
    id: 'p3',
    name: 'Sạc Dự Phòng 10000mAh PowerCore Metro Slim',
    price: 750000,
    imageUrl: 'https://via.placeholder.com/200/FFDAB9/000000?text=Product+3',
    quantity: 2,
    shop: 'Anker Vietnam',
  },
];

const SHIPPING_FEE = 30000;

const COLORS = {
  primary: '#d9534f', // A nice red for e-commerce actions
  background: '#f5f5f5',
  white: '#ffffff',
  text: '#333333',
  lightGray: '#cccccc',
  darkGray: '#888888',
};

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- MAIN COMPONENT ---
const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

  const handleUpdateQuantity = (itemId, amount) => {
    setCartItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      });
      return newItems;
    });
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);
  
  const total = subtotal + SHIPPING_FEE;

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemShop}>Cung cấp bởi: {item.shop}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
        <View style={styles.itemActions}>
            <View style={styles.quantitySelector}>
                <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, -1)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, 1)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                <Text style={styles.removeIcon}>🗑️</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
        <Text style={styles.emptySubtitle}>Hãy bắt đầu mua sắm ngay thôi!</Text>
        <TouchableOpacity style={styles.shopNowButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng ({cartItems.length})</Text>
      </View>
      
      {cartItems.length === 0 ? renderEmptyCart() : (
        <>
            <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tạm tính</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(SHIPPING_FEE)}</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
                    <Text style={styles.summaryTotalValue}>{formatCurrency(total)}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
                </TouchableOpacity>
            </View>
        </>
      )}
    </SafeAreaView>
  );
};

// --- STYLESHEET ---
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
  listContainer: {
    padding: 16,
  },
  // Empty State
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
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
      color: COLORS.darkGray,
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
  // Cart Item
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemShop: {
    fontSize: 13,
    color: COLORS.darkGray,
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  itemActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
  },
  removeIcon: {
      fontSize: 24,
      color: COLORS.darkGray,
  },
  // Summary Footer
  summaryContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  summaryValue: {
    fontSize: 16,
    color: COLORS.text,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
