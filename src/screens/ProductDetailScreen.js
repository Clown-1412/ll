import React, { useState, useRef, useMemo, useCallback } from 'react';
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
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();
  const styles = getStyles(theme);
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);


  // --- ANIMATIONS ---
  const buttonScale = useRef(new Animated.Value(1)).current;
  const favScale = useRef(new Animated.Value(1)).current;

  // Hiệu ứng thu phóng nút khi nhấn (Pressable)
  const handlePressIn = useCallback(() => { Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start(); }, [buttonScale]);
  const handlePressOut = useCallback(() => { Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start(); }, [buttonScale]);

  // Hiệu ứng tim Yêu thích
  const toggleFavorite = useCallback(() => {
    setIsFavorite(current => !current);
    Animated.sequence([
      Animated.timing(favScale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(favScale, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  }, [favScale]);

  // Hàm chia sẻ
  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Xem ngay sản phẩm tuyệt vời này: ${product.name}! https://shopai.com/p/${product.id}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  }, [product]);

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = useCallback(() => {
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
  }, []);

  const handleSelectSize = useCallback((size) => {
    setSelectedSize(size);
  }, []);

  const handleSelectColor = useCallback((color) => {
    setSelectedColor(color);
  }, []);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity(q => String(Math.max(1, parseInt(q) + amount)));
  }, []);
  
  const openBottomSheet = useCallback(() => setBottomSheetVisible(true), []);
  const closeBottomSheet = useCallback(() => setBottomSheetVisible(false), []);
  
  const handleSeeAllReviews = useCallback(() => {
    // Navigate to reviews screen
    console.log('Navigate to all reviews');
  }, []);

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{...theme.typography.h3, color: theme.colors.textSecondary}}>Sản phẩm không tồn tại.</Text>
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
          <ImageGallery 
            images={product.images} 
            onScroll={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setActiveImageIndex(newIndex);
            }}
            activeIndex={activeImageIndex}
          />
          <ProductInformation
            product={product}
            isFavorite={isFavorite}
            favScale={favScale}
            onShare={handleShare}
            onToggleFavorite={toggleFavorite}
          />
          <VariantSelection
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSelectSize={handleSelectSize}
            onSelectColor={handleSelectColor}
          />
          <ReviewsSection soldCount={product.soldCount} onSeeAllReviews={handleSeeAllReviews} />
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FIXED BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            onPress={() => handleQuantityChange(-1)}
            style={styles.qtyBtn}
            accessibilityRole="button"
            accessibilityLabel="Decrease quantity"
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <View>
             <Text style={styles.inputLabel}>Số lượng</Text>
              <TextInput 
              style={styles.qtyInput} 
              value={quantity} 
              onChangeText={setQuantity} 
              keyboardType="number-pad"
              accessibilityLabel="Quantity input"
            />
          </View>
          <TouchableOpacity
            onPress={() => handleQuantityChange(1)}
            style={styles.qtyBtn}
            accessibilityRole="button"
            accessibilityLabel="Increase quantity"
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <Pressable 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={openBottomSheet}
          style={{ flex: 1 }}
          accessibilityRole="button"
          accessibilityLabel="Add to cart"
          accessibilityHint="Double tap to open options to add to cart"
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
        onRequestClose={closeBottomSheet}
        accessibilityViewIsModal={true}
      >
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        
        <View style={styles.bottomSheet} accessibilityLiveRegion="polite">
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Xác nhận giỏ hàng</Text>
            <TouchableOpacity onPress={closeBottomSheet} accessibilityRole="button" accessibilityLabel="Close">
              <Text style={{ fontSize: 20, color: theme.colors.text }}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={{...theme.typography.body, color: theme.colors.text, marginBottom: 10}}>Đã chọn: Kích thước {selectedSize}, Màu {selectedColor}</Text>
          <Text style={{...theme.typography.body, color: theme.colors.text, marginBottom: 20, fontWeight: 'bold'}}>Số lượng: {quantity}</Text>
          
          <TouchableOpacity 
            style={[styles.confirmAddBtn, showSuccess && styles.successBtn]} 
            onPress={handleAddToCart}
            disabled={isAddingToCart || showSuccess}
            accessibilityRole="button"
            accessibilityLabel="Confirm and add to cart"
          >
            {isAddingToCart ? (
              <ActivityIndicator color={theme.colors.card} />
            ) : showSuccess ? (
              <Text style={styles.confirmAddText}>✓ Đã thêm thành công</Text>
            ) : (
              <Text style={styles.confirmAddText}>Xác nhận Thêm ({useMemo(() => formatCurrency(parseInt(quantity) * product.price), [quantity, product.price])})</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const ImageGallery = React.memo(({ images, onScroll, activeIndex }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.galleryContainer}>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={styles.productImage}
            resizeMode="cover"
            accessibilityRole="image"
            accessibilityLabel={`Product image ${index + 1} of ${images.length}`}
          />
        ))}
      </ScrollView>
      <View 
        style={styles.indicatorContainer}
        accessibilityLabel={`Image ${activeIndex + 1} of ${images.length}`}
        accessible={true}
      >
        {images.map((_, index) => (
          <View 
            key={index}
            style={[styles.indicator, activeIndex === index && styles.indicatorActive]} 
          />
        ))}
      </View>
    </View>
  );
});

const ProductInformation = React.memo(({ product, isFavorite, favScale, onShare, onToggleFavorite }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.infoSection}>
      <View style={styles.titleRow}>
        <Text style={styles.productTitle}>{product.name}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={onShare}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Share product"
            accessibilityHint="Double tap to share this product with others"
          >
            <Text style={styles.iconText}>🔗</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onToggleFavorite}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityState={{ selected: isFavorite }}
            accessibilityHint="Double tap to toggle this product in your favorites list"
          >
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
  );
});

const SizeButton = React.memo(({ size, selected, onPress }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const handlePress = useCallback(() => {
        onPress(size);
    }, [onPress, size]);

    return (
        <TouchableOpacity
            style={[styles.sizeBtn, selected && styles.sizeBtnActive]}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={`Size ${size}`}
            accessibilityState={{ selected }}
            accessibilityHint={`Double tap to select size ${size}`}
        >
            <Text style={[styles.sizeText, selected && styles.sizeTextActive]}>{size}</Text>
        </TouchableOpacity>
    );
});

const ColorButton = React.memo(({ color, selected, onPress }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const handlePress = useCallback(() => {
        onPress(color);
    }, [onPress, color]);

    return (
        <TouchableOpacity
            style={[styles.colorSwatch, { backgroundColor: color }, selected && styles.colorSwatchActive]}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={`Color ${color}`}
            accessibilityState={{ selected }}
            accessibilityHint={`Double tap to select color ${color}`}
        />
    );
});

const VariantSelection = React.memo(({ selectedSize, selectedColor, onSelectSize, onSelectColor }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.variantSection}>
      <Text style={styles.sectionTitle}>Kích thước</Text>
      <View style={styles.row}>
        {['S', 'M', 'L', 'XL'].map(size => (
          <SizeButton
            key={size}
            size={size}
            selected={selectedSize === size}
            onPress={onSelectSize}
          />
        ))}
      </View>
      <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Màu sắc</Text>
      <View style={styles.row}>
        {['#000', '#fff', '#0066cc', '#ff3b30'].map(color => (
          <ColorButton
            key={color}
            color={color}
            selected={selectedColor === color}
            onPress={onSelectColor}
          />
        ))}
      </View>
    </View>
  );
});

const ReviewsSection = React.memo(({ soldCount, onSeeAllReviews }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.reviewSection}>
      <Text style={styles.sectionTitle}>Đánh giá mới nhất</Text>
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Image
            source={{uri: 'https://via.placeholder.com/40'}}
            style={styles.reviewerAvatar}
            accessibilityRole="image"
            accessibilityLabel="Reviewer's avatar"
          />
          <View>
            <Text style={styles.reviewerName}>Trần Văn B</Text>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
          </View>
        </View>
        <Text style={styles.reviewText}>Áo mặc rất mát, form chuẩn. Sẽ ủng hộ shop tiếp!</Text>
      </View>
      <TouchableOpacity
        onPress={onSeeAllReviews}
        accessibilityRole="button"
        accessibilityLabel={`See all ${soldCount} reviews`}
        accessibilityHint="Double tap to view all product reviews"
      >
        <Text style={styles.loadMoreText}>Xem tất cả {soldCount} đánh giá</Text>
      </TouchableOpacity>
    </View>
  );
});

const getStyles = (theme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.card },
  container: { flex: 1, backgroundColor: theme.colors.background },
  galleryContainer: { height: 300, position: 'relative' },
  productImage: { width: screenWidth, height: 300 },
  indicatorContainer: { position: 'absolute', bottom: 15, width: '100%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 5, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 10, alignSelf: 'center', width: 'auto', paddingHorizontal: 10 },
  indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 4 },
  indicatorActive: { backgroundColor: theme.colors.card, width: 12 },
  
  infoSection: { padding: theme.spacing.m, borderBottomWidth: 1, borderColor: theme.colors.border },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productTitle: { ...theme.typography.h2, color: theme.colors.text, flex: 1, marginRight: theme.spacing.m },
  actionRow: { flexDirection: 'row' },
  iconBtn: { padding: theme.spacing.s, marginLeft: theme.spacing.s, backgroundColor: theme.colors.background, borderRadius: 20 },
  iconText: { fontSize: 18 },
  productPrice: { ...theme.typography.h2, color: theme.colors.primary, marginTop: theme.spacing.s },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.s },
  stars: { ...theme.typography.body, color: theme.colors.text },
  reviewCount: { ...theme.typography.body, color: theme.colors.textSecondary, marginLeft: theme.spacing.s },
  description: { ...theme.typography.body, color: theme.colors.textSecondary, lineHeight: 22, marginTop: theme.spacing.m },
  
  variantSection: { padding: theme.spacing.m, borderBottomWidth: 1, borderColor: theme.colors.border },
  sectionTitle: { ...theme.typography.h3, marginBottom: theme.spacing.m, color: theme.colors.text },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  sizeBtn: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.spacing.s, paddingVertical: theme.spacing.s, paddingHorizontal: theme.spacing.m, marginRight: theme.spacing.m, backgroundColor: theme.colors.card },
  sizeBtnActive: { borderColor: theme.colors.primary, backgroundColor: '#e6f0fa' },
  sizeText: { ...theme.typography.body, color: theme.colors.text },
  sizeTextActive: { color: theme.colors.primary, fontWeight: 'bold' },
  colorSwatch: { width: 36, height: 36, borderRadius: 18, marginRight: theme.spacing.m, borderWidth: 1, borderColor: theme.colors.border },
  colorSwatchActive: { borderWidth: 2, borderColor: theme.colors.primary, transform: [{ scale: 1.1 }] },
  
  reviewSection: { padding: theme.spacing.m },
  reviewCard: { backgroundColor: theme.colors.card, padding: theme.spacing.m, borderRadius: theme.spacing.s, marginBottom: theme.spacing.m },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: theme.spacing.m },
  reviewerName: { ...theme.typography.body, fontWeight: 'bold', color: theme.colors.text },
  reviewText: { ...theme.typography.body, color: theme.colors.textSecondary },
  loadMoreText: { color: theme.colors.primary, textAlign: 'center', fontWeight: 'bold', marginTop: theme.spacing.m },
  inputLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.card, flexDirection: 'row', padding: theme.spacing.m, borderTopWidth: 1, borderColor: theme.colors.border, alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 30 : 15 },
  quantityControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.spacing.s, marginRight: theme.spacing.m },
  qtyBtn: { paddingHorizontal: theme.spacing.m, paddingVertical: theme.spacing.s },
  qtyBtnText: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
  qtyInput: { width: 40, textAlign: 'center', ...theme.typography.body, color: theme.colors.text },
  
  addToCartBtn: { backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.m, borderRadius: theme.spacing.s, alignItems: 'center' },
  addToCartText: { ...theme.typography.body, color: theme.colors.card, fontWeight: 'bold' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheet: { backgroundColor: theme.colors.card, padding: theme.spacing.m, borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, width: '100%', paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  bottomSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.l },
  bottomSheetTitle: { ...theme.typography.h3, color: theme.colors.text },
  confirmAddBtn: { backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.m, borderRadius: theme.spacing.s, alignItems: 'center', marginTop: theme.spacing.m },
  successBtn: { backgroundColor: '#28a745' },
  confirmAddText: { ...theme.typography.body, color: theme.colors.card, fontWeight: 'bold' }
});
