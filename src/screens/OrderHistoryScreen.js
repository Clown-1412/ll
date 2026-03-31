import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
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

const COLORS = {
  primary: '#007bff',
  background: '#f8f9fa',
  white: '#ffffff',
  text: '#343a40',
  secondaryText: '#6c757d',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
};

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getStatusStyle = (status) => {
    switch (status) {
        case ORDER_STATUS.DELIVERED:
            return { color: COLORS.success, backgroundColor: '#e9f7ef' };
        case ORDER_STATUS.PROCESSING:
            return { color: COLORS.warning, backgroundColor: '#fff8e1' };
        case ORDER_STATUS.CANCELLED:
            return { color: COLORS.danger, backgroundColor: '#fbe9e7' };
        default:
            return { color: COLORS.secondaryText, backgroundColor: '#f0f0f0' };
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
        const statusStyle = getStatusStyle(item.status);
        return (
            <TouchableOpacity 
                style={styles.card} 
                onPress={() => Alert.alert(`Chi tiết đơn hàng #${item.id}`, 'Chức năng này sẽ được phát triển sau.')}
                accessibilityRole="button"
                accessibilityLabel={`Order number ${item.id}`}
                accessibilityHint="Double tap to view order details"
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
                    <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.infoText}>Số lượng: {item.itemCount} sản phẩm</Text>
                    <Text style={styles.infoText}>Tổng tiền: <Text style={styles.totalValue}>{formatCurrency(item.total)}</Text></Text>
                </View>
                <View style={styles.cardFooter}>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
                    </View>
                    <Text style={styles.detailsText}>Xem chi tiết</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyTitle}>Không có đơn hàng</Text>
            <Text style={styles.emptySubtitle}>Bạn chưa có đơn hàng nào trong mục này.</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
                {TABS.map(tab => (
                    <TouchableOpacity 
                        key={tab} 
                        style={[styles.tab, activeTab === tab && styles.tabActive]} 
                        onPress={() => setActiveTab(tab)}
                        accessibilityRole="tab"
                        accessibilityLabel={tab}
                        accessibilityState={{ selected: activeTab === tab }}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Order List */}
            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontSize: 15,
        color: COLORS.secondaryText,
    },
    tabTextActive: {
        color: COLORS.primary,
        fontWeight: 'bold',
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
        marginTop: '30%',
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 20,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    emptySubtitle: {
        fontSize: 16,
        color: COLORS.secondaryText,
        marginTop: 8,
        textAlign: 'center',
    },
    // Order Card
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    orderDate: {
        fontSize: 14,
        color: COLORS.secondaryText,
    },
    cardBody: {
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
    },
    infoText: {
        fontSize: 15,
        color: COLORS.secondaryText,
        lineHeight: 22,
    },
    totalValue: {
        fontWeight: 'bold',
        color: COLORS.text,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    detailsText: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: '600',
    },
});

export default OrderHistoryScreen;
