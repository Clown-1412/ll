import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

// --- MOCK DATA ---
const ORDER_STATUS = {
    PROCESSING: 'Đang xử lý',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
};

const MOCK_ORDERS = [
    { id: 'DH001', date: '2023-10-26', total: 550000, status: ORDER_STATUS.DELIVERED, itemCount: 2 },
    { id: 'DH002', date: '2023-10-24', total: 189000, status: ORDER_STATUS.DELIVERED, itemCount: 1 },
    { id: 'DH003', date: '2023-10-22', total: 3200000, status: ORDER_STATUS.CANCELLED, itemCount: 1 },
    { id: 'DH004', date: '2023-10-21', total: 750000, status: ORDER_STATUS.DELIVERED, itemCount: 3 },
    { id: 'DH005', date: '2023-10-20', total: 120000, status: ORDER_STATUS.PROCESSING, itemCount: 1 },
    { id: 'DH006', date: '2023-10-18', total: 450000, status: ORDER_STATUS.DELIVERED, itemCount: 2 },
    { id: 'DH007', date: '2023-10-15', total: 99000, status: ORDER_STATUS.PROCESSING, itemCount: 1 },
    { id: 'DH008', date: '2023-10-12', total: 1120000, status: ORDER_STATUS.CANCELLED, itemCount: 4 },
];

const TABS = ['Tất cả', ORDER_STATUS.PROCESSING, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED];

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getStatusClasses = (status) => {
    switch (status) {
        case ORDER_STATUS.DELIVERED:
            return { badge: 'bg-green-100', text: 'text-green-700' };
        case ORDER_STATUS.PROCESSING:
            return { badge: 'bg-yellow-100', text: 'text-yellow-700' };
        case ORDER_STATUS.CANCELLED:
            return { badge: 'bg-red-100', text: 'text-red-700' };
        default:
            return { badge: 'bg-gray-100', text: 'text-gray-600' };
    }
};

// --- MAIN COMPONENT ---
const OrderHistoryScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState(TABS[0]);

    const filteredOrders = useMemo(() => {
        if (activeTab === 'Tất cả') {
            return MOCK_ORDERS;
        }
        return MOCK_ORDERS.filter(order => order.status === activeTab);
    }, [activeTab]);

    const renderOrderItem = ({ item }) => {
        const statusClasses = getStatusClasses(item.status);
        return (
            <TouchableOpacity 
                className="bg-white rounded-xl p-4 mb-4 shadow-sm"
                onPress={() => Alert.alert(`Chi tiết đơn hàng #${item.id}`, 'Chức năng này sẽ được phát triển sau.')}
                accessibilityRole="button"
                accessibilityLabel={`Order number ${item.id}`}
                accessibilityHint="Double tap to view order details"
            >
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-base font-bold text-text">Đơn hàng #{item.id}</Text>
                    <Text className="text-sm text-textSecondary">{item.date}</Text>
                </View>
                <View className="py-3 border-y border-gray-100">
                    <Text className="text-[15px] text-textSecondary leading-snug">Số lượng: {item.itemCount} sản phẩm</Text>
                    <Text className="text-[15px] text-textSecondary leading-snug">Tổng tiền: <Text className="font-bold text-text">{formatCurrency(item.total)}</Text></Text>
                </View>
                <View className="flex-row justify-between items-center mt-3">
                    <View className={`px-2.5 py-1 rounded-md ${statusClasses.badge}`}>
                        <Text className={`text-sm font-bold ${statusClasses.text}`}>{item.status}</Text>
                    </View>
                    <Text className="text-[15px] text-primary font-semibold">Xem chi tiết</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View className="flex-1 justify-center items-center p-5 mt-[30%]">
            <Text className="text-8xl mb-5 opacity-50">📂</Text>
            <Text className="text-xl font-bold text-text">Không có đơn hàng</Text>
            <Text className="text-base text-textSecondary mt-2 text-center">Bạn chưa có đơn hàng nào trong mục này.</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Tabs */}
            <View className="flex-row bg-white px-2 pt-2">
                {TABS.map(tab => (
                    <TouchableOpacity 
                        key={tab} 
                        className={`flex-1 py-3 items-center border-b-2 ${activeTab === tab ? 'border-primary' : 'border-transparent'}`}
                        onPress={() => setActiveTab(tab)}
                        accessibilityRole="tab"
                        accessibilityLabel={tab}
                        accessibilityState={{ selected: activeTab === tab }}
                    >
                        <Text className={`text-[15px] ${activeTab === tab ? 'text-primary font-bold' : 'text-textSecondary'}`}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Order List */}
            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={renderEmptyState}
            />
        </SafeAreaView>
    );
};

export default OrderHistoryScreen;
