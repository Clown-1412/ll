import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
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
} from 'react-native';

// --- MOCK DATA (Copied for lookup) ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};


export default function ProductDetailScreen({ route }) {
  const { productId } = route.params;

  const { MOCK_PRODUCTS } = useMemo(() => {
    const MOCK_CATEGORIES = ['Áo thun', 'Quần jeans', 'Giày sneaker', 'Phụ kiện'];
    const MOCK_PRODUCTS = Array.from({ length: 50 }).map((_, i) => ({
      id: `product-${i}`,
      name: `Sản phẩm ${i + 1} với tên rất dài để kiểm tra nhiều dòng`,
      price: Math.floor(Math.random() * (2000000 - 50000 + 1)) + 50000,
      images: [
        `https://picsum.photos/seed/p${i}-1/400/400`,
        `https://picsum.photos/seed/p${i}-2/400/400`,
        `https://picsum.photos/seed/p${i}-3/400/400`,
      ],
      isFavorite: Math.random() < 0.2,
      category: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length],
      soldCount: Math.floor(Math.random() * 1500),
      rating: (Math.random() * 2 + 3).toFixed(1),
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }));
    return { MOCK_PRODUCTS };
  }, []);

  const product = useMemo(() => MOCK_PRODUCTS.find(p => p.id === productId), [productId, MOCK_PRODUCTS]);

  // --- STATES ---
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('#000');
  const [quantity, setQuantity] = useState('1');
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite || false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // --- ANIMATIONS ---
  const buttonScale = useRef(new Animated.Value(1)).current;
  const favScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => { Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start(); }, [buttonScale]);
  const handlePressOut = useCallback(() => { Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start(); }, [buttonScale]);

  const toggleFavorite = useCallback(() => {
    setIsFavorite(current => !current);
    Animated.sequence([
      Animated.timing(favScale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(favScale, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  }, [favScale]);

  // --- HANDLERS ---
  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Xem ngay sản phẩm tuyệt vời này: ${product.name}! https://shopai.com/p/${product.id}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  }, [product]);

  const handleAddToCart = useCallback(() => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setBottomSheetVisible(false);
      }, 1500);
    }, 1000);
  }, []);

  const handleSelectSize = useCallback((size) => setSelectedSize(size), []);
  const handleSelectColor = useCallback((color) => setSelectedColor(color), []);
  const handleQuantityChange = useCallback((amount) => setQuantity(q => String(Math.max(1, parseInt(q) + amount))), []);
  const openBottomSheet = useCallback(() => setBottomSheetVisible(true), []);
  const closeBottomSheet = useCallback(() => setBottomSheetVisible(false), []);
  const handleSeeAllReviews = useCallback(() => console.log('Navigate to all reviews'), []);


  // --- SUB-COMPONENTS (Refactored to use NativeWind) ---

  const ImageGallery = React.memo(({ images, onScroll, activeIndex }) => (
    <View className="h-80 relative">
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16}>
        {images.map((img, index) => (
          <Image key={index} source={{ uri: img }} className="w-screen h-full" resizeMode="cover" />
        ))}
      </ScrollView>
      <View className="absolute bottom-4 w-auto self-center flex-row justify-center py-1 px-2.5 bg-black/20 rounded-full">
        {images.map((_, index) => (
          <View key={index} className={`w-2 h-2 rounded-full mx-1 ${activeIndex === index ? 'bg-card w-3' : 'bg-white/50'}`} />
        ))}
      </View>
    </View>
  ));

  const ProductInformation = React.memo(({ product, isFavorite, favScale, onShare, onToggleFavorite }) => (
    <View className="p-m border-b border-border">
      <View className="flex-row justify-between items-start">
        <Text className="text-2xl font-bold text-text flex-1 mr-m">{product.name}</Text>
        <View className="flex-row">
          <TouchableOpacity onPress={onShare} className="p-s ml-s bg-background rounded-full"><Text className="text-lg">🔗</Text></TouchableOpacity>
          <TouchableOpacity onPress={onToggleFavorite} className="p-s ml-s bg-background rounded-full">
            <Animated.Text style={{ transform: [{ scale: favScale }] }} className="text-lg">{isFavorite ? '❤️' : '🤍'}</Animated.Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-2xl font-bold text-primary mt-s">{formatCurrency(product.price)}</Text>
      <View className="flex-row items-center mt-s">
        <Text className="text-base text-text">⭐ {product.rating}</Text>
        <Text className="text-base text-textSecondary ml-s">({product.soldCount} đánh giá)</Text>
      </View>
      <Text className="text-base text-textSecondary leading-snug mt-m">{product.description}</Text>
    </View>
  ));

  const SizeButton = React.memo(({ size, selected, onPress }) => (
    <TouchableOpacity onPress={() => onPress(size)} className={`border rounded-s py-s px-m mr-m bg-card ${selected ? 'border-primary bg-blue-50' : 'border-border'}`}>
      <Text className={`text-base ${selected ? 'text-primary font-bold' : 'text-text'}`}>{size}</Text>
    </TouchableOpacity>
  ));

  const ColorButton = React.memo(({ color, selected, onPress }) => (
    <TouchableOpacity onPress={() => onPress(color)} style={{ backgroundColor: color }} className={`w-9 h-9 rounded-full mr-m border ${selected ? 'border-2 border-primary scale-110' : 'border-border'}`} />
  ));

  const VariantSelection = React.memo(({ selectedSize, selectedColor, onSelectSize, onSelectColor }) => (
    <View className="p-m border-b border-border">
      <Text className="text-xl font-bold mb-m text-text">Kích thước</Text>
      <View className="flex-row flex-wrap">
        {['S', 'M', 'L', 'XL'].map(size => <SizeButton key={size} size={size} selected={selectedSize === size} onPress={onSelectSize} />)}
      </View>
      <Text className="text-xl font-bold mt-4 mb-m text-text">Màu sắc</Text>
      <View className="flex-row flex-wrap">
        {['#000', '#fff', '#0066cc', '#ff3b30'].map(color => <ColorButton key={color} color={color} selected={selectedColor === color} onPress={onSelectColor} />)}
      </View>
    </View>
  ));

  const ReviewsSection = React.memo(({ soldCount, onSeeAllReviews }) => (
    <View className="p-m">
      <Text className="text-xl font-bold text-text">Đánh giá mới nhất</Text>
      <View className="bg-card p-m rounded-s my-m">
        <View className="flex-row items-center mb-m">
          <Image source={{uri: 'https://via.placeholder.com/40'}} className="w-10 h-10 rounded-full mr-m" />
          <View>
            <Text className="text-base font-bold text-text">Trần Văn B</Text>
            <Text className="text-base text-text">⭐⭐⭐⭐⭐</Text>
          </View>
        </View>
        <Text className="text-base text-textSecondary">Áo mặc rất mát, form chuẩn. Sẽ ủng hộ shop tiếp!</Text>
      </View>
      <TouchableOpacity onPress={onSeeAllReviews}>
        <Text className="text-primary text-center font-bold mt-m">Xem tất cả {soldCount} đánh giá</Text>
      </TouchableOpacity>
    </View>
  ));


  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-xl text-textSecondary">Sản phẩm không tồn tại.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-card">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
        <ScrollView showsVerticalScrollIndicator={false}>
          <ImageGallery images={product.images} onScroll={(e) => setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width))} activeIndex={activeImageIndex} />
          <ProductInformation product={product} isFavorite={isFavorite} favScale={favScale} onShare={handleShare} onToggleFavorite={toggleFavorite} />
          <VariantSelection selectedSize={selectedSize} selectedColor={selectedColor} onSelectSize={handleSelectSize} onSelectColor={handleSelectColor} />
          <ReviewsSection soldCount={product.soldCount} onSeeAllReviews={handleSeeAllReviews} />
          <View className="h-24" />
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 left-0 right-0 bg-card flex-row p-m border-t border-border items-center pb-8 ios:pb-4">
        <View className="flex-row items-center border border-border rounded-s mr-m">
          <TouchableOpacity onPress={() => handleQuantityChange(-1)} className="px-m py-s"><Text className="text-lg font-bold text-text">-</Text></TouchableOpacity>
          <View><Text className="text-xs text-textSecondary text-center">Số lượng</Text><TextInput className="w-10 text-center text-base text-text" value={quantity} onChangeText={setQuantity} keyboardType="number-pad" /></View>
          <TouchableOpacity onPress={() => handleQuantityChange(1)} className="px-m py-s"><Text className="text-lg font-bold text-text">+</Text></TouchableOpacity>
        </View>
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={openBottomSheet} className="flex-1">
          <Animated.View style={{ transform: [{ scale: buttonScale }] }} className="bg-primary py-m rounded-s items-center"><Text className="text-base text-card font-bold">Thêm vào giỏ</Text></Animated.View>
        </Pressable>
      </View>

      <Modal visible={bottomSheetVisible} animationType="slide" transparent={true} onRequestClose={closeBottomSheet}>
        <TouchableWithoutFeedback onPress={closeBottomSheet}><View className="flex-1 bg-black/50" /></TouchableWithoutFeedback>
        <View className="bg-card p-m rounded-t-2xl absolute bottom-0 w-full pb-10 ios:pb-5">
          <View className="flex-row justify-between items-center mb-l">
            <Text className="text-xl font-bold text-text">Xác nhận giỏ hàng</Text>
            <TouchableOpacity onPress={closeBottomSheet}><Text className="text-xl text-text">✕</Text></TouchableOpacity>
          </View>
          <Text className="text-base text-text mb-2.5">Đã chọn: Kích thước {selectedSize}, Màu {selectedColor}</Text>
          <Text className="text-base text-text mb-5 font-bold">Số lượng: {quantity}</Text>
          <TouchableOpacity onPress={handleAddToCart} disabled={isAddingToCart || showSuccess} className={`py-m rounded-s items-center mt-m ${showSuccess ? 'bg-green-500' : 'bg-primary'}`}>
            {isAddingToCart ? <ActivityIndicator color="white" /> : showSuccess ? <Text className="text-base text-card font-bold">✓ Đã thêm thành công</Text> : <Text className="text-base text-card font-bold">Xác nhận Thêm ({formatCurrency(parseInt(quantity) * product.price)})</Text>}
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
