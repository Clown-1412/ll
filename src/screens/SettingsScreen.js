import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#007bff',
  background: '#f2f2f7',
  white: '#ffffff',
  text: '#000000',
  secondaryText: '#8e8e93',
  separator: '#c6c6c8',
};

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
    switch (item.type) {
      case 'navigate':
        return (
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => item.screen && navigation.navigate(item.screen)}
          >
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemAccessory}>›</Text>
          </TouchableOpacity>
        );
      case 'action':
        return (
          <TouchableOpacity style={styles.item} onPress={item.action}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemAccessory}>›</Text>
          </TouchableOpacity>
        );
      case 'switch':
        return (
          <View style={styles.item}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Switch
              value={settings[item.key]}
              onValueChange={() => toggleSwitch(item.key)}
            />
          </View>
        );
      case 'info':
        return (
            <View style={styles.item}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemInfoText}>{item.value}</Text>
            </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={SETTINGS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        SectionSeparatorComponent={() => <View style={{ height: 30 }} />}
        ListFooterComponent={<View style={{ height: 30 }} />}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionHeader: {
    paddingLeft: 16,
    paddingBottom: 6,
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: '600',
  },
  item: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemLabel: {
    fontSize: 17,
    color: COLORS.text,
  },
  itemAccessory: {
    fontSize: 20,
    color: COLORS.separator,
  },
  itemInfoText: {
    fontSize: 17,
    color: COLORS.secondaryText,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginLeft: 16,
  },
});

export default SettingsScreen;
