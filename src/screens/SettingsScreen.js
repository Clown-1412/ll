import React, { useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';

// --- MOCK DATA for SectionList ---
const SETTINGS_DATA = [
  {
    title: 'Tài khoản',
    data: [
      { id: '1', label: 'Chỉnh sửa Hồ sơ', type: 'navigate', screen: 'Profile' },
      { id: '2', label: 'Địa chỉ', type: 'navigate', screen: 'ShippingAddresses' },
      { id: '3', label: 'Thay đổi Mật khẩu', type: 'action', action: () => Alert.alert('Chức năng đang phát triển') },
    ],
  },
  {
    title: 'Thông báo',
    data: [
      { id: '4', label: 'Thông báo đẩy', type: 'switch', key: 'pushNotifications' },
      { id: '5', label: 'Thông báo qua Email', type: 'switch', key: 'emailNotifications' },
      { id: '6', label: 'Thông báo khuyến mãi', type: 'switch', key: 'promoNotifications' },
    ],
  },
  {
    title: 'Giao diện',
    data: [
        { id: '7', label: 'Chế độ tối (Dark Mode)', type: 'switch', key: 'darkMode' },
    ]
  },
  {
    title: 'Về ứng dụng',
    data: [
      { id: '8', label: 'Điều khoản Dịch vụ', type: 'action', action: () => {} },
      { id: '9', label: 'Chính sách Bảo mật', type: 'action', action: () => {} },
      { id: '10', label: 'Phiên bản', type: 'info', value: '1.0.0' },
    ],
  },
];

// --- MAIN COMPONENT ---
const SettingsScreen = ({ navigation }) => {
    const [settings, setSettings] = useState({
        pushNotifications: true,
        emailNotifications: false,
        promoNotifications: true,
        darkMode: false,
    });

    const toggleSwitch = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

  const renderItem = ({ item }) => {
    const itemContent = (
        <>
            <Text className="text-base text-black">{item.label}</Text>
            {item.type === 'navigate' && <Text className="text-xl text-gray-300">›</Text>}
            {item.type === 'action' && <Text className="text-xl text-gray-300">›</Text>}
            {item.type === 'switch' && <Switch value={settings[item.key]} onValueChange={() => toggleSwitch(item.key)} />}
            {item.type === 'info' && <Text className="text-base text-gray-500">{item.value}</Text>}
        </>
    );
    
    const commonClasses = "bg-white flex-row items-center justify-between py-3 px-4";

    if (item.type === 'navigate' || item.type === 'action') {
        const action = item.screen ? () => navigation.navigate(item.screen) : item.action;
        return (
            <TouchableOpacity className={commonClasses} onPress={action}>
                {itemContent}
            </TouchableOpacity>
        );
    }
    
    return <View className={commonClasses}>{itemContent}</View>;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <SectionList
        sections={SETTINGS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="pl-4 pb-1.5 text-gray-500 text-xs font-semibold">{title.toUpperCase()}</Text>
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-300 ml-4" />}
        SectionSeparatorComponent={() => <View className="h-8" />}
        ListFooterComponent={<View className="h-8" />}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;
