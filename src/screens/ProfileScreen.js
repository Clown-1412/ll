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

export default function ProfileScreen() {
  // States quản lý dữ liệu và UI
  const [name, setName] = useState('Nguyễn Văn A');
  const [email, setEmail] = useState('nguyenvana@email.com');
  const [phone, setPhone] = useState('0123456789');
  const [address, setAddress] = useState('Hồ Chí Minh, Việt Nam');
  
  const [isNotiEnabled, setIsNotiEnabled] = useState(true);
  const [isPublicEmail, setIsPublicEmail] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Danh sách settings demo
  const settingsList = [
    { id: '1', title: 'Cài đặt tài khoản', icon: '👤' },
    { id: '2', title: 'Cài đặt thông báo', icon: '🔔' },
    { id: '3', title: 'Cài đặt bảo mật', icon: '🔒' },
  ];

  // Hàm xử lý lưu thông tin
  const handleSave = () => {
    setIsLoading(true);
    // Giả lập gọi API lưu dữ liệu
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Thành công', 'Thông tin của bạn đã được cập nhật.');
    }, 1500);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* 1. Profile Header */}
          <View style={styles.header}>
            <Image 
              source={require('../img/avatar.png')}
              style={styles.avatar} 
            />
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.emailText}>{email}</Text>
            <Text style={styles.bioText}>Lập trình viên React Native</Text>
          </View>

          {/* 2. Profile Information Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Tên" />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Số điện thoại" keyboardType="phone-pad" />
            <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Địa chỉ" />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Nhận thông báo</Text>
              <Switch value={isNotiEnabled} onValueChange={setIsNotiEnabled} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Hiển thị email công khai</Text>
              <Switch value={isPublicEmail} onValueChange={setIsPublicEmail} />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.btnTextSave}>Lưu thay đổi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.logoutBtn]} onPress={handleLogout}>
                <Text style={styles.btnTextLogout}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cài đặt</Text>
            {settingsList.map((item) => (
              <TouchableOpacity key={item.id} style={styles.settingItem}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* 4 & 6. Modal Xác nhận đăng xuất */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận</Text>
            <Text style={styles.modalText}>Bạn có chắc chắn muốn đăng xuất không?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnConfirm]} onPress={() => {
                setModalVisible(false);
                Alert.alert('Đã đăng xuất');
              }}>
                <Text style={[styles.modalBtnText, {color: '#fff'}]}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4. Activity Indicator Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Đang lưu thay đổi...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  bioText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveBtn: {
    backgroundColor: '#0066cc',
  },
  logoutBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  btnTextSave: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnTextLogout: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  settingArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#eee',
  },
  modalBtnConfirm: {
    backgroundColor: '#ff3b30',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0066cc',
    fontWeight: 'bold',
  }
});