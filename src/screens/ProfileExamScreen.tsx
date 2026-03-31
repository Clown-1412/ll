import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Image, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, ScrollView, Platform,
  Switch, ActivityIndicator, Modal, Alert, StatusBar
} from 'react-native';

const ProfileExamScreen = () => {
  // 1. State cho Form
  const [name, setName] = useState('Nguyễn Văn A');
  const [email, setEmail] = useState('nguyenvana@example.com');
  const [phone, setPhone] = useState('0987654321');
  const [address, setAddress] = useState('Hồ Chí Minh');
  
  // State cho Switch, Loading và Modal
  const [isNotified, setIsNotified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State lưu lỗi validation
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', address: '' });

  // 2. Hàm Validation và Xử lý Lưu
  const handleSave = () => {
    let isValid = true;
    let newErrors = { name: '', email: '', phone: '', address: '' };

    // Validate Tên & Địa chỉ (Không được để trống)
    if (!name.trim()) { newErrors.name = 'Tên không được để trống'; isValid = false; }
    if (!address.trim()) { newErrors.address = 'Địa chỉ không được để trống'; isValid = false; }

    // Validate Email (Có @ và dấu .)
    if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Email không đúng định dạng';
      isValid = false;
    }

    // Validate SĐT (Chỉ số, dài 9-11 ký tự)
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone)) {
      newErrors.phone = 'SĐT phải là số và từ 9-11 ký tự';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // Giả lập API call 1.5 giây
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Hiển thị Alert khi lưu thành công
        Alert.alert('Thành công', 'Thông tin của bạn đã được lưu thành công!');
      }, 1500);
    }
  };

  const handleCancel = () => {
    // Reset form hoặc quay lại
    Alert.alert('Đã hủy', 'Các thay đổi chưa được lưu.');
  };

  const handleLogout = () => {
    setIsModalVisible(false);
    Alert.alert('Đăng xuất', 'Bạn đã đăng xuất thành công.');
  };

  return (
    // Yêu cầu 1 & 8: SafeAreaView + StatusBar
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* KeyboardAvoidingView và ScrollView */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Yêu cầu 2: Profile Header */}
          <View style={styles.header}>
            <Image 
              source={{ uri: 'https://images.icon-icons.com/3708/PNG/512/girl_female_woman_person_people_avatar_icon_230018.png' }} 
              style={styles.avatar} 
            />
            <Text style={styles.headerName}>{name || 'Tên người dùng'}</Text>
            <Text style={styles.headerEmail}>{email || 'email@example.com'}</Text>
            <Text style={styles.headerBio}>Reacct Native!!!</Text>
          </View>

          {/* Yêu cầu 3: Form Input & Hiển thị lỗi Text đỏ */}
          <View style={styles.form}>
            <Text style={styles.label}>Họ và tên *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

            <Text style={styles.label}>Email *</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <Text style={styles.label}>Số điện thoại *</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="numeric" />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

            <Text style={styles.label}>Địa chỉ *</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} />
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

            {/* Yêu cầu 4: Switch */}
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Nhận thông báo ứng dụng</Text>
              <Switch value={isNotified} onValueChange={setIsNotified} />
            </View>

            {/* Buttons: Lưu và Hủy */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={handleCancel} disabled={isLoading}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>

              {/* Yêu cầu 5: ActivityIndicator */}
              <TouchableOpacity style={[styles.button, styles.saveBtn, isLoading && styles.disabledBtn]} onPress={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Lưu</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Nút bật Modal Đăng xuất */}
            <TouchableOpacity style={styles.logoutBtn} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.logoutBtnText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Yêu cầu 6: Modal xác nhận Đăng xuất */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận</Text>
            <Text style={styles.modalText}>Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveBtn, {backgroundColor: 'red'}]} onPress={handleLogout}>
                <Text style={styles.saveBtnText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10, backgroundColor: '#ddd' },
  headerName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  headerEmail: { fontSize: 16, color: '#666', marginTop: 5 },
  headerBio: { fontSize: 14, color: '#888', fontStyle: 'italic', marginTop: 5 },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  errorText: { color: 'red', fontSize: 12, marginTop: 5 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelBtn: { backgroundColor: '#ddd' },
  saveBtn: { backgroundColor: '#007AFF' },
  disabledBtn: { backgroundColor: '#88C0FF' },
  cancelBtnText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutBtn: { marginTop: 20, padding: 15, alignItems: 'center' },
  logoutBtnText: { color: 'red', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#555' },
  modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
});

export default ProfileExamScreen;