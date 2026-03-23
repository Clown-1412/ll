import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
  Modal,
  Share,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// --- MOCK DATA (Copied for lookup) ---
const MOCK_CATEGORIES = ['Áo thun', 'Quần jeans', 'Giày sneaker', 'Phụ kiện'];
const MOCK_PRODUCTS = Array.from({ length: 50 }).map((_, i) => ({
  id: `product-${i}`,
  name: `Sản phẩm ${i + 1}`,
  price: Math.floor(Math.random() * (2000000 - 50000 + 1)) + 50000,
  imageUrl: `https://via.placeholder.com/400/E8E8E8/000000?text=Product+${i + 1}`,
  images: [
    `https://via.placeholder.com/400/E8E8E8/000000?text=Image+1`,
    `https://via.placeholder.com/400/CDCDCD/000000?text=Image+2`,
    `https://via.placeholder.com/400/D3D3D3/000000?text=Image+3`,
  ],
  isFavorite: Math.random() < 0.2,
  inStock: Math.random() < 0.85,
  category: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length],
  dateAdded: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
  soldCount: Math.floor(Math.random() * 1500),
  rating: (Math.random() * 2 + 3).toFixed(1),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
}));

// --- HELPER ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};


export default function ProductDetailScreen({ route }) {
  const { productId } = route.params;
  const product = useMemo(() => MOCK_PRODUCTS.find(p => p.id === productId), [productId]);

  // --- STATES ---
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('#000');
  const [quantity, setQuantity] = useState('1');
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite || false);
  
  // Trạng thái cho Bottom Sheet và Add to Cart
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- ANIMATIONS ---
  const buttonScale = useRef(new Animated.Value(1)).current;
  const favScale = useRef(new Animated.Value(1)).current;

  // Hiệu ứng thu phóng nút khi nhấn (Pressable)
  const handlePressIn = () => { Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start(); };
  const handlePressOut = () => { Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start(); };

  // Hiệu ứng tim Yêu thích
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Animated.sequence([
      Animated.timing(favScale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(favScale, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  // Hàm chia sẻ
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Xem ngay sản phẩm tuyệt vời này: ${product.name}! https://shopai.com/p/${product.id}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    // Giả lập gọi API
    setTimeout(() => {
      setIsAddingToCart(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setBottomSheetVisible(false); // Đóng bottom sheet sau khi thêm thành công
      }, 1500);
    }, 1000);
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: '#666'}}>Sản phẩm không tồn tại.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* 1. Image Gallery */}
          <View style={styles.galleryContainer}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {product.images.map((img, index) => (
                <Image 
                  key={index}
                  source={{ uri: img }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <View style={styles.indicatorContainer}>
              {/* This should be dynamic based on scroll position */}
              <View style={[styles.indicator, styles.indicatorActive]} />
              <View style={styles.indicator} />
              <View style={styles.indicator} />
            </View>
          </View>

          {/* 2. Product Information */}
          <View style={styles.infoSection}>
            <View style={styles.titleRow}>
              <Text style={styles.productTitle}>{product.name}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={handleShare} style={styles.iconBtn} accessibilityLabel="Chia sẻ sản phẩm">
                  <Text style={styles.iconText}>🔗</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFavorite} style={styles.iconBtn} accessibilityLabel="Thêm vào yêu thích">
                  <Animated.Text style={[styles.iconText, { transform: [{ scale: favScale }] }]}>
                    {isFavorite ? '❤️' : '🤍'}
                  </Animated.Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
            
            <View style={styles.ratingRow}>
              <Text style={styles.stars}>⭐ {product.rating}</Text>
              <Text style={styles.reviewCount}>({product.soldCount} đánh giá)</Text>
            </View>

            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* 3. Variant Selection */}
          <View style={styles.variantSection}>
            <Text style={styles.sectionTitle}>Kích thước</Text>
            <View style={styles.row}>
              {['S', 'M', 'L', 'XL'].map(size => (
                <TouchableOpacity 
                  key={size}
                  style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Màu sắc</Text>
            <View style={styles.row}>
              {['#000', '#fff', '#0066cc', '#ff3b30'].map(color => (
                <TouchableOpacity 
                  key={color}
                  style={[ styles.colorSwatch, { backgroundColor: color }, selectedColor === color && styles.colorSwatchActive ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          {/* 5. Reviews Section */}
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>Đánh giá mới nhất</Text>
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{uri: 'https://via.placeholder.com/40'}} style={styles.reviewerAvatar} />
                <View>
                  <Text style={styles.reviewerName}>Trần Văn B</Text>
                  <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>Áo mặc rất mát, form chuẩn. Sẽ ủng hộ shop tiếp!</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.loadMoreText}>Xem tất cả {product.soldCount} đánh giá</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FIXED BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => setQuantity(String(Math.max(1, parseInt(quantity) - 1)))} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <TextInput 
            style={styles.qtyInput} 
            value={quantity} 
            onChangeText={setQuantity} 
            keyboardType="number-pad" 
          />
          <TouchableOpacity onPress={() => setQuantity(String(parseInt(quantity) + 1))} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <Pressable 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => setBottomSheetVisible(true)}
          style={{ flex: 1 }}
        >
          <Animated.View style={[styles.addToCartBtn, { transform: [{ scale: buttonScale }] }]}>
            <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
          </Animated.View>
        </Pressable>
      </View>

      {/* Bottom Sheet (Modal) */}
      <Modal
        visible={bottomSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setBottomSheetVisible(false)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Xác nhận giỏ hàng</Text>
            <TouchableOpacity onPress={() => setBottomSheetVisible(false)}>
              <Text style={{ fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={{marginBottom: 10}}>Đã chọn: Kích thước {selectedSize}, Màu {selectedColor}</Text>
          <Text style={{marginBottom: 20, fontWeight: 'bold'}}>Số lượng: {quantity}</Text>

          <TouchableOpacity 
            style={[styles.confirmAddBtn, showSuccess && styles.successBtn]} 
            onPress={handleAddToCart}
            disabled={isAddingToCart || showSuccess}
          >
            {isAddingToCart ? (
              <ActivityIndicator color="#fff" />
            ) : showSuccess ? (
              <Text style={styles.confirmAddText}>✓ Đã thêm thành công</Text>
            ) : (
              <Text style={styles.confirmAddText}>Xác nhận Thêm ({formatCurrency(parseInt(quantity) * product.price)})</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  galleryContainer: { height: 300, position: 'relative' },
  productImage: { width: 400, height: 300 }, // Cần tính toán theo Dimensions.get('window').width thực tế
  indicatorContainer: { position: 'absolute', bottom: 15, width: '100%', flexDirection: 'row', justifyContent: 'center' },
  indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 4 },
  indicatorActive: { backgroundColor: '#fff', width: 12 },
  
  infoSection: { padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 10 },
  actionRow: { flexDirection: 'row' },
  iconBtn: { padding: 8, marginLeft: 5, backgroundColor: '#f4f4f4', borderRadius: 20 },
  iconText: { fontSize: 18 },
  productPrice: { fontSize: 24, fontWeight: 'bold', color: '#ff3b30', marginTop: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  stars: { fontSize: 14 },
  reviewCount: { fontSize: 14, color: '#666', marginLeft: 5 },
  description: { fontSize: 15, color: '#555', lineHeight: 22, marginTop: 15 },
  
  variantSection: { padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  sizeBtn: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginRight: 10, backgroundColor: '#fff' },
  sizeBtnActive: { borderColor: '#0066cc', backgroundColor: '#e6f0fa' },
  sizeText: { fontSize: 16, color: '#333' },
  sizeTextActive: { color: '#0066cc', fontWeight: 'bold' },
  colorSwatch: { width: 36, height: 36, borderRadius: 18, marginRight: 10, borderWidth: 1, borderColor: '#ddd' },
  colorSwatchActive: { borderWidth: 2, borderColor: '#0066cc', transform: [{ scale: 1.1 }] },
  
  reviewSection: { padding: 20 },
  reviewCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  reviewerName: { fontSize: 15, fontWeight: 'bold' },
  reviewText: { fontSize: 14, color: '#444' },
  loadMoreText: { color: '#0066cc', textAlign: 'center', fontWeight: 'bold', marginTop: 10 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#eee', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 30 : 15 },
  quantityControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginRight: 15 },
  qtyBtn: { paddingHorizontal: 15, paddingVertical: 10 },
  qtyBtnText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  qtyInput: { width: 40, textAlign: 'center', fontSize: 16 },
  
  addToCartBtn: { backgroundColor: '#0066cc', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheet: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, width: '100%', paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  bottomSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  bottomSheetTitle: { fontSize: 18, fontWeight: 'bold' },
  confirmAddBtn: { backgroundColor: '#0066cc', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  successBtn: { backgroundColor: '#28a745' },
  confirmAddText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});