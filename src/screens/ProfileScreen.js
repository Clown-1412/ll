import React, { useState } from 'react';
import {
  StyleSheet,
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
  StatusBar,
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
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Thành công', 'Thông tin của bạn đã được cập nhật.');
      setIsEditing(false);
    }, 1500);
  };

  const handleLogout = () => {
    setModalVisible(true);
  };

  const handleConfirmLogout = () => {
    setModalVisible(false);
    // reset profile data to default/empty state for logout
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setIsNotiEnabled(false);
    setIsPublicEmail(false);

    // reset navigation stack to main entry point so user is effectively logged out
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });

    Alert.alert('Đã đăng xuất', 'Bạn đã đăng xuất thành công.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Image 
              source={require('../img/avatar.png')}
              style={styles.avatar}
              accessibilityRole="image"
              accessibilityLabel="User avatar"
            />
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.emailText}>{email}</Text>
            {!isEditing && <Text style={styles.bioText}>Lập trình viên React Native</Text>}
          </View>

          {isEditing ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chỉnh sửa thông tin</Text>
              
              <Text style={styles.inputLabel}>Họ và tên</Text>
              <TextInput 
                style={[styles.input, errors.name && styles.inputError]} 
                value={name} 
                onChangeText={setName} 
                placeholder="Nhập họ và tên" 
                accessibilityLabel="Name input"
                accessibilityHint="Input for your full name"
              />
              {errors.name && <Text style={styles.errorText} accessibilityLiveRegion="assertive">{errors.name}</Text>}
              
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput 
                style={[styles.input, errors.email && styles.inputError]} 
                value={email} 
                onChangeText={setEmail} 
                placeholder="Nhập email" 
                keyboardType="email-address" 
                accessibilityLabel="Email input"
                accessibilityHint="Input for your email address"
              />
              {errors.email && <Text style={styles.errorText} accessibilityLiveRegion="assertive">{errors.email}</Text>}

              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput 
                style={[styles.input, errors.phone && styles.inputError]} 
                value={phone} 
                onChangeText={setPhone} 
                placeholder="Nhập số điện thoại" 
                keyboardType="phone-pad" 
                accessibilityLabel="Phone number input"
                accessibilityHint="Input for your phone number"
              />
              {errors.phone && <Text style={styles.errorText} accessibilityLiveRegion="assertive">{errors.phone}</Text>}
              
              <Text style={styles.inputLabel}>Địa chỉ</Text>
              <TextInput 
                style={[styles.input, errors.address && styles.inputError]} 
                value={address} 
                onChangeText={setAddress} 
                placeholder="Nhập địa chỉ" 
                accessibilityLabel="Address input"
                accessibilityHint="Input for your address"
              />
              {errors.address && <Text style={styles.errorText} accessibilityLiveRegion="assertive">{errors.address}</Text>}

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Nhận thông báo</Text>
                <Switch
                  value={isNotiEnabled}
                  onValueChange={setIsNotiEnabled}
                  accessibilityLabel="Enable notifications toggle"
                  accessibilityState={{ checked: isNotiEnabled }}
                  accessibilityHint={isNotiEnabled ? "Double tap to disable notifications" : "Double tap to enable notifications"}
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Hiển thị email công khai</Text>
                <Switch
                  value={isPublicEmail}
                  onValueChange={setIsPublicEmail}
                  accessibilityLabel="Show email publicly toggle"
                  accessibilityState={{ checked: isPublicEmail }}
                  accessibilityHint={isPublicEmail ? "Double tap to hide your email" : "Double tap to show your email publicly"}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.saveBtn]}
                  onPress={handleSave}
                  accessibilityRole="button"
                  accessibilityLabel="Save changes"
                  accessibilityHint="Double tap to save your profile changes"
                >
                  <Text style={styles.btnTextSave}>Lưu thay đổi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelBtn]}
                  onPress={() => setIsEditing(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel editing"
                  accessibilityHint="Double tap to discard your changes and go back"
                >
                  <Text style={styles.btnTextCancel}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cài đặt</Text>
                {settingsList.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.settingItem}
                    onPress={item.action}
                    accessibilityRole="button"
                    accessibilityLabel={item.title}
                    accessibilityHint={`Double tap to go to ${item.title}`}
                  >
                    <Text style={styles.settingIcon}>{item.icon}</Text>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.mainLogoutBtn}
                onPress={handleLogout}
                accessibilityRole="button"
                accessibilityLabel="Logout"
                accessibilityHint="Double tap to logout from your account"
              >
                <Text style={styles.mainLogoutText}>Đăng xuất</Text>
              </TouchableOpacity>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận</Text>
            <Text style={styles.modalText}>Bạn có chắc chắn muốn đăng xuất không?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel logout"
              >
                <Text style={styles.modalBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={handleConfirmLogout}
                accessibilityRole="button"
                accessibilityLabel="Confirm logout"
              >
                <Text style={[styles.modalBtnText, {color: '#ffffff'}]}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isLoading && (
        <View 
          style={styles.loadingOverlay}
          accessibilityViewIsModal={true}
          accessibilityLiveRegion="polite"
        >
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Đang lưu thay đổi...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f4f4' },
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  nameText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  emailText: { fontSize: 16, color: '#666', marginTop: 5 },
  bioText: { fontSize: 14, color: '#888', marginTop: 5, fontStyle: 'italic' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  inputLabel: { fontSize: 16, color: '#333', marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 5, fontSize: 16 },
  inputError: { borderColor: '#ff3b30' },
  errorText: { color: '#ff3b30', fontSize: 14, marginBottom: 10, },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  switchLabel: { fontSize: 16, color: '#333' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  button: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  saveBtn: { backgroundColor: '#0066cc' },
  cancelBtn: { backgroundColor: '#f4f4f4', borderWidth: 1, borderColor: '#ddd' },
  btnTextSave: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnTextCancel: { color: '#666', fontSize: 16, fontWeight: 'bold' },
  
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  settingIcon: { fontSize: 20, marginRight: 15 },
  settingTitle: { flex: 1, fontSize: 16, color: '#333' },
  settingArrow: { fontSize: 20, color: '#ccc' },
  
  mainLogoutBtn: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  mainLogoutText: { color: '#ff3b30', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '80%', borderRadius: 12, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#eee' },
  modalBtnConfirm: { backgroundColor: '#ff3b30' },
  modalBtnText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#0066cc', fontWeight: 'bold' }
});