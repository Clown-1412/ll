import React from 'react';
import {
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
    <View className="bg-white mx-3 mt-3 p-4 rounded-xl shadow">
      <View className="flex-row items-center border-b border-gray-200 pb-3 mb-3">
        <Text className="text-xl mr-2.5">{icon}</Text>
        <Text className="text-lg font-bold text-text">{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Shipping Address */}
        {renderSection('Địa chỉ nhận hàng', '📍', (
          <View>
            <Text className="text-base font-semibold mb-1">{MOCK_DATA.shippingAddress.name} | {MOCK_DATA.shippingAddress.phone}</Text>
            <Text className="text-[15px] text-gray-600 leading-snug">{MOCK_DATA.shippingAddress.address}</Text>
            <TouchableOpacity
              className="absolute top-0 right-0"
              accessibilityRole="button"
              accessibilityLabel="Change shipping address"
              accessibilityHint="Double tap to change your shipping address"
            >
                <Text className="text-primary text-[15px] font-semibold">Thay đổi</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Order Summary */}
        {renderSection('Sản phẩm', '📦', (
          <View>
            {MOCK_DATA.cartItems.map(item => (
              <View key={item.id} className="flex-row items-center mb-3">
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-[50px] h-[50px] rounded-lg mr-3"
                  accessibilityRole="image"
                  accessibilityLabel={`Image of ${item.name}`}
                />
                <View className="flex-1">
                  <Text className="text-[15px] text-text" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-sm text-gray-600 mt-1">Số lượng: {item.quantity}</Text>
                </View>
                <Text className="text-[15px] font-semibold">{formatCurrency(item.price * item.quantity)}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Payment Method */}
        {renderSection('Phương thức thanh toán', '💳', (
            <View className="flex-row justify-between items-center">
                <Text className="text-base text-text">{MOCK_DATA.paymentMethod.description}</Text>
                <TouchableOpacity
                  className="absolute top-0 right-0"
                  accessibilityRole="button"
                  accessibilityLabel="Change payment method"
                  accessibilityHint="Double tap to change your payment method"
                >
                    <Text className="text-primary text-[15px] font-semibold">Thay đổi</Text>
                </TouchableOpacity>
            </View>
        ))}
        
      </ScrollView>
      
      {/* Footer with Totals and Place Order Button */}
      <View className="bg-white p-4 border-t border-gray-300 pb-8">
        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Tạm tính</Text>
          <Text className="text-base text-text">{formatCurrency(subtotal)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Phí vận chuyển</Text>
          <Text className="text-base text-text">{formatCurrency(SHIPPING_FEE)}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-text">Tổng cộng</Text>
          <Text className="text-xl font-bold text-primary">{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity
          className="bg-primary rounded-lg py-4 items-center mt-4"
          onPress={handlePlaceOrder}
          accessibilityRole="button"
          accessibilityLabel="Place order"
          accessibilityHint={`Double tap to place your order. Total amount is ${formatCurrency(total)}`}
        >
          <Text className="text-white text-lg font-bold">Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
