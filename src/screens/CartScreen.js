import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import CartItem from '../components/CartItem';
import { useTheme } from '../context/ThemeContext';

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

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- MAIN COMPONENT ---
const CartScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

  const handleUpdateQuantity = useCallback((itemId, amount) => {
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
  }, []);

  const handleRemoveItem = useCallback((itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const navigateToHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const handleCheckout = useCallback(() => {
    // Navigate to checkout screen
    navigation.navigate('CheckoutScreen');
  }, [navigation]);
  
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);
  
  const total = useMemo(() => subtotal + SHIPPING_FEE, [subtotal]);

  const renderCartItem = useCallback(({ item }) => (
    <CartItem
      item={item}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
    />
  ), [handleUpdateQuantity, handleRemoveItem]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng ({cartItems.length})</Text>
      </View>
      
      {cartItems.length === 0 ? <EmptyCart onShopNow={navigateToHome} /> : (
        <>
            <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
            <CartSummary subtotal={subtotal} total={total} onCheckout={handleCheckout} />
        </>
      )}
    </SafeAreaView>
  );
};

const EmptyCart = React.memo(({ onShopNow }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
        <Text style={styles.emptySubtitle}>Hãy bắt đầu mua sắm ngay thôi!</Text>
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={onShopNow}
          accessibilityRole="button"
          accessibilityLabel="Shop now"
          accessibilityHint="Double tap to start shopping"
        >
            <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>
        </TouchableOpacity>
    </View>
  );
});

const CartSummary = React.memo(({ subtotal, total, onCheckout }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
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
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={onCheckout}
          accessibilityRole="button"
          accessibilityLabel="Proceed to checkout"
          accessibilityHint={`Double tap to proceed to checkout. Total amount is ${formatCurrency(total)}`}
        >
            <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
        </TouchableOpacity>
    </View>
  );
});

// --- STYLESHEET ---
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
  },
  listContainer: {
    padding: theme.spacing.m,
  },
  // Empty State
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.l,
  },
  emptyIcon: {
      fontSize: 80,
      marginBottom: theme.spacing.l,
  },
  emptyTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
  },
  emptySubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.s,
      marginBottom: theme.spacing.l,
      textAlign: 'center',
  },
  shopNowButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.m,
      borderRadius: 30,
  },
  shopNowButtonText: {
      ...theme.typography.body,
      color: theme.colors.card,
      fontWeight: 'bold',
  },
  // Summary Footer
  summaryContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  summaryLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.s,
  },
  summaryTotalLabel: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  summaryTotalValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.s,
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  checkoutButtonText: {
    ...theme.typography.body,
    color: theme.colors.card,
    fontWeight: 'bold',
  },
});

export default CartScreen;
