import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

// --- MOCK DATA ---
const MOCK_DATA = {
  shippingAddress: {
    name: 'Nguyễn Văn A',
    phone: '0123 456 789',
    address: '123 Đường ABC, Phường 1, Quận 2, Thành phố Hồ Chí Minh',
  },
  cartItems: [
    {
      id: 'p1',
      name: 'Áo Thun Cotton Co Giãn 4 Chiều Unisex',
      price: 159000,
      imageUrl: 'https://via.placeholder.com/150/DDDDDD/000000?text=P1',
      quantity: 1,
    },
    {
      id: 'p3',
      name: 'Sạc Dự Phòng 10000mAh PowerCore',
      price: 750000,
      imageUrl: 'https://via.placeholder.com/150/FFDAB9/000000?text=P3',
      quantity: 2,
    },
  ],
  paymentMethod: {
    type: 'COD',
    description: 'Thanh toán khi nhận hàng',
  },
};

const SHIPPING_FEE = 30000;

const COLORS = {
  primary: '#007bff',
  secondary: '#6c757d',
  background: '#f8f9fa',
  white: '#ffffff',
  text: '#343a40',
  success: '#28a745',
};

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- MAIN COMPONENT ---
const CheckoutScreen = ({ navigation }) => {
  const subtotal = MOCK_DATA.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + SHIPPING_FEE;

  const handlePlaceOrder = () => {
    Alert.alert(
      "Xác nhận đặt hàng",
      `Tổng số tiền phải trả là ${formatCurrency(total)}. Bạn có chắc chắn muốn đặt hàng không?`,
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { 
          text: "Đặt hàng", 
          onPress: () => {
            // Giả lập xử lý thành công
            Alert.alert("Thành công!", "Đơn hàng của bạn đã được đặt thành công.", [
              { text: "OK", onPress: () => navigation.navigate('Home') }
            ]);
          } 
        }
      ]
    );
  };

  const renderSection = (title, icon, children) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Shipping Address */}
        {renderSection('Địa chỉ nhận hàng', '📍', (
          <View>
            <Text style={styles.addressName}>{MOCK_DATA.shippingAddress.name} | {MOCK_DATA.shippingAddress.phone}</Text>
            <Text style={styles.addressText}>{MOCK_DATA.shippingAddress.address}</Text>
            <TouchableOpacity
              style={styles.changeButton}
              accessibilityRole="button"
              accessibilityLabel="Change shipping address"
              accessibilityHint="Double tap to change your shipping address"
            >
                <Text style={styles.changeButtonText}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Order Summary */}
        {renderSection('Sản phẩm', '📦', (
          <View>
            {MOCK_DATA.cartItems.map(item => (
              <View key={item.id} style={styles.itemContainer}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.itemImage}
                  accessibilityRole="image"
                  accessibilityLabel={`Image of ${item.name}`}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Payment Method */}
        {renderSection('Phương thức thanh toán', '💳', (
            <View style={styles.paymentContainer}>
                <Text style={styles.paymentText}>{MOCK_DATA.paymentMethod.description}</Text>
                <TouchableOpacity
                  style={styles.changeButton}
                  accessibilityRole="button"
                  accessibilityLabel="Change payment method"
                  accessibilityHint="Double tap to change your payment method"
                >
                    <Text style={styles.changeButtonText}>Thay đổi</Text>
                </TouchableOpacity>
            </View>
        ))}
        
      </ScrollView>
      
      {/* Footer with Totals and Place Order Button */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tạm tính</Text>
          <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Phí vận chuyển</Text>
          <Text style={styles.totalValue}>{formatCurrency(SHIPPING_FEE)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.finalTotalLabel}>Tổng cộng</Text>
          <Text style={styles.finalTotalValue}>{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          accessibilityRole="button"
          accessibilityLabel="Place order"
          accessibilityHint={`Double tap to place your order. Total amount is ${formatCurrency(total)}`}
        >
          <Text style={styles.placeOrderButtonText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  sectionIcon: {
      fontSize: 20,
      marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  // Address
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 15,
    color: COLORS.secondary,
    lineHeight: 22,
  },
  changeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
  },
  changeButtonText: {
      color: COLORS.primary,
      fontSize: 15,
      fontWeight: '600'
  },
  // Order Item
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    color: COLORS.text,
  },
  itemQuantity: {
    fontSize: 13,
    color: COLORS.secondary,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
  },
  // Payment
  paymentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  paymentText: {
      fontSize: 16,
      color: COLORS.text,
  },
  // Footer
  footer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 30, // For notch
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  totalValue: {
    fontSize: 16,
    color: COLORS.text,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  placeOrderButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
