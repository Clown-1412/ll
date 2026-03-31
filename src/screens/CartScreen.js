import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import CartItem from '../components/CartItem';

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
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-m bg-card border-b border-border">
        <Text className="text-2xl font-bold text-text text-center">Giỏ hàng ({cartItems.length})</Text>
      </View>
      
      {cartItems.length === 0 ? <EmptyCart onShopNow={navigateToHome} /> : (
        <>
            <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }} // p-m
                showsVerticalScrollIndicator={false}
            />
            <CartSummary subtotal={subtotal} total={total} onCheckout={handleCheckout} />
        </>
      )}
    </SafeAreaView>
  );
};

const EmptyCart = React.memo(({ onShopNow }) => {
  return (
    <View className="flex-1 justify-center items-center p-l">
        <Text className="text-8xl mb-l">🛒</Text>
        <Text className="text-xl font-bold text-text">Giỏ hàng của bạn đang trống</Text>
        <Text className="text-base text-textSecondary mt-s mb-l text-center">Hãy bắt đầu mua sắm ngay thôi!</Text>
        <TouchableOpacity
          className="bg-primary px-xl py-m rounded-full"
          onPress={onShopNow}
          accessibilityRole="button"
          accessibilityLabel="Shop now"
          accessibilityHint="Double tap to start shopping"
        >
            <Text className="text-base text-card font-bold">Mua sắm ngay</Text>
        </TouchableOpacity>
    </View>
  );
});

const CartSummary = React.memo(({ subtotal, total, onCheckout }) => {
  return (
    <View className="bg-card p-m border-t border-border">
        <View className="flex-row justify-between mb-m">
            <Text className="text-base text-textSecondary">Tạm tính</Text>
            <Text className="text-base text-text">{formatCurrency(subtotal)}</Text>
        </View>
        <View className="flex-row justify-between mb-m">
            <Text className="text-base text-textSecondary">Phí vận chuyển</Text>
            <Text className="text-base text-text">{formatCurrency(SHIPPING_FEE)}</Text>
        </View>
        <View className="h-px bg-border my-s" />
        <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-text">Tổng cộng</Text>
            <Text className="text-2xl font-bold text-primary">{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity
          className="bg-primary rounded-s py-m items-center mt-m"
          onPress={onCheckout}
          accessibilityRole="button"
          accessibilityLabel="Proceed to checkout"
          accessibilityHint={`Double tap to proceed to checkout. Total amount is ${formatCurrency(total)}`}
        >
            <Text className="text-base text-card font-bold">Tiến hành thanh toán</Text>
        </TouchableOpacity>
    </View>
  );
});

export default CartScreen;
