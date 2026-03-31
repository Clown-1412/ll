import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';

export default function ProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Nguyễn Văn A');
  const [email, setEmail] = useState('nguyenvana@email.com');
  const [phone, setPhone] = useState('0123456789');
  const [address, setAddress] = useState('Hồ Chí Minh, Việt Nam');
  const [errors, setErrors] = useState({});
  
  const [isNotiEnabled, setIsNotiEnabled] = useState(true);
  const [isPublicEmail, setIsPublicEmail] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const settingsList = [
    { id: '0', title: 'Chỉnh sửa Profile', icon: '✏️', action: () => setIsEditing(true) },
    { id: '1', title: 'Lịch sử đơn hàng', icon: '📦', action: () => navigation.navigate('OrderHistory') },
    { id: '2', title: 'Sản phẩm yêu thích', icon: '❤️', action: () => navigation.navigate('Favorites') },
    { id: '3', title: 'Cài đặt tài khoản', icon: '👤', action: () => navigation.navigate('Settings') },
    { id: '4', title: 'Cài đặt thông báo', icon: '🔔', action: () => {} },
    { id: '5', title: 'Cài đặt bảo mật', icon: '🔒', action: () => {} },
    { id: '6', title: 'Ngôn ngữ', icon: '🌐', action: () => {} },
    { id: '7', title: 'Chủ đề (Light/Dark)', icon: '🌗', action: () => {} },
    { id: '8', title: 'Giúp đỡ & Hỗ trợ', icon: '❓', action: () => {} },
    { id: '9', title: 'Về ứng dụng', icon: 'ℹ️', action: () => {} },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Họ tên không được để trống.';
    if (!email) newErrors.email = 'Email không được để trống.';
    if (!phone) newErrors.phone = 'Số điện thoại không được để trống.';
    if (!address) newErrors.address = 'Địa chỉ không được để trống.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Thành công', 'Thông tin của bạn đã được cập nhật.');
      setIsEditing(false);
    }, 1500);
  };

  const handleLogout = () => setModalVisible(true);

  const handleConfirmLogout = () => {
    setModalVisible(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setIsNotiEnabled(false);
    setIsPublicEmail(false);
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    Alert.alert('Đã đăng xuất', 'Bạn đã đăng xuất thành công.');
  };

  const renderSettingItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      className="flex-row items-center py-4 border-b border-gray-200"
      onPress={item.action}
    >
      <Text className="text-xl mr-4">{item.icon}</Text>
      <Text className="flex-1 text-base text-text">{item.title}</Text>
      <Text className="text-xl text-gray-400">›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          
          <View className="items-center mb-5">
            <Image source={require('../img/avatar.png')} className="w-24 h-24 rounded-full mb-4" />
            <Text className="text-2xl font-bold text-text">{name}</Text>
            <Text className="text-base text-gray-600 mt-1">{email}</Text>
            {!isEditing && <Text className="text-sm text-gray-500 mt-1 italic">Lập trình viên React Native</Text>}
          </View>

          {isEditing ? (
            <View className="bg-white rounded-xl p-4 mb-5 shadow-md">
              <Text className="text-lg font-bold mb-4 text-text">Chỉnh sửa thông tin</Text>
              
              <Text className="text-base text-text mb-1 font-semibold">Họ và tên</Text>
              <TextInput className={`border rounded-lg p-3 mb-1 text-base ${errors.name ? 'border-red-500' : 'border-gray-300'}`} value={name} onChangeText={setName} placeholder="Nhập họ và tên" />
              {errors.name && <Text className="text-red-500 text-sm mb-2.5">{errors.name}</Text>}
              
              <Text className="text-base text-text mb-1 font-semibold">Email</Text>
              <TextInput className={`border rounded-lg p-3 mb-1 text-base ${errors.email ? 'border-red-500' : 'border-gray-300'}`} value={email} onChangeText={setEmail} placeholder="Nhập email" keyboardType="email-address" />
              {errors.email && <Text className="text-red-500 text-sm mb-2.5">{errors.email}</Text>}

              <Text className="text-base text-text mb-1 font-semibold">Số điện thoại</Text>
              <TextInput className={`border rounded-lg p-3 mb-1 text-base ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} value={phone} onChangeText={setPhone} placeholder="Nhập số điện thoại" keyboardType="phone-pad" />
              {errors.phone && <Text className="text-red-500 text-sm mb-2.5">{errors.phone}</Text>}
              
              <Text className="text-base text-text mb-1 font-semibold">Địa chỉ</Text>
              <TextInput className={`border rounded-lg p-3 mb-1 text-base ${errors.address ? 'border-red-500' : 'border-gray-300'}`} value={address} onChangeText={setAddress} placeholder="Nhập địa chỉ" />
              {errors.address && <Text className="text-red-500 text-sm mb-2.5">{errors.address}</Text>}

              <View className="flex-row justify-between items-center py-2.5 border-b border-gray-200">
                <Text className="text-base text-text">Nhận thông báo</Text>
                <Switch value={isNotiEnabled} onValueChange={setIsNotiEnabled} />
              </View>
              <View className="flex-row justify-between items-center py-2.5">
                <Text className="text-base text-text">Hiển thị email công khai</Text>
                <Switch value={isPublicEmail} onValueChange={setIsPublicEmail} />
              </View>

              <View className="flex-row justify-between mt-5">
                <TouchableOpacity className="flex-1 p-4 rounded-lg items-center mx-1 bg-primary" onPress={handleSave}>
                  <Text className="text-white text-base font-bold">Lưu thay đổi</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 p-4 rounded-lg items-center mx-1 bg-gray-100 border border-gray-300" onPress={() => setIsEditing(false)}>
                  <Text className="text-gray-600 text-base font-bold">Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View className="bg-white rounded-xl p-4 mb-5 shadow-md">
                <Text className="text-lg font-bold mb-2 text-text">Cài đặt</Text>
                {settingsList.map(renderSettingItem)}
              </View>

              <TouchableOpacity className="bg-white p-4 rounded-xl items-center mb-8 border border-red-500" onPress={handleLogout}>
                <Text className="text-red-500 text-base font-bold">Đăng xuất</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[80%] rounded-xl p-5 items-center">
            <Text className="text-xl font-bold mb-2.5">Xác nhận</Text>
            <Text className="text-base text-center text-gray-600 mb-5">Bạn có chắc chắn muốn đăng xuất không?</Text>
            <View className="flex-row justify-between w-full">
              <TouchableOpacity className="flex-1 p-3 rounded-lg items-center mx-1 bg-gray-200" onPress={() => setModalVisible(false)}>
                <Text className="text-base font-bold text-text">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 p-3 rounded-lg items-center mx-1 bg-red-500" onPress={handleConfirmLogout}>
                <Text className="text-base font-bold text-white">Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isLoading && (
        <View className="absolute inset-0 bg-white/80 justify-center items-center">
          <ActivityIndicator size="large" color="#d9534f" />
          <Text className="mt-2.5 text-base text-primary font-bold">Đang lưu thay đổi...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}