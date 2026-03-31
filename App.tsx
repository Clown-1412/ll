// App.js
import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ThemeProvider } from './src/context/ThemeContext';

// 1. Import các màn hình Tab 
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import CartScreen from './src/screens/CartScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// 2. Import các màn hình Stack 
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProductListingScreen from './src/screens/ProductListingScreen';

//styling
import "./global.css"

// Định nghĩa kiểu cho Stack Navigator
type RootStackParamList = {
  MainTabs: undefined;
  ProductListing: { category: string };
  ProductDetail: { productId: string };
  Checkout: undefined;
  OrderHistory: undefined;
  Settings: undefined;
};

// Khởi tạo Navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Component chứa 5 Tabs chính
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Ẩn header mặc định của Tab để tự custom sau
        tabBarActiveTintColor: '#0066cc',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <Text>🏠</Text> }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarIcon: () => <Text>🔍</Text> }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: () => <Text>🛒</Text> }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarIcon: () => <Text>❤️</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tab.Navigator>
  );
}

// Luồng Navigation gốc bọc toàn bộ ứng dụng
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Màn hình mặc định là cụm 5 Tabs */}
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs} 
            options={{ headerShown: false }} 
          />
          
          {/* Các màn hình Stack được gọi từ bên trong Tabs */}
          <Stack.Screen 
            name="ProductListing" 
            component={ProductListingScreen}
            options={({ route }) => ({ title: route.params?.category || 'Sản phẩm' })}
          />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen} 
            options={{ title: 'Chi tiết sản phẩm' }}
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen} 
            options={{ title: 'Thanh toán' }} 
          />
          <Stack.Screen 
            name="OrderHistory" 
            component={OrderHistoryScreen} 
            options={{ title: 'Lịch sử đơn hàng' }} 
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Cài đặt' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}