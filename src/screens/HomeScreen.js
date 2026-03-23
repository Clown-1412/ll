import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// --- MOCK DATA ---
// Dữ liệu giả cho các section, sử dụng placeholder images
const MOCK_DATA = {
  heroBanners: [
    { id: '1', imageUrl: `https://picsum.photos/seed/${Math.random()}/700/400` },
    { id: '2', imageUrl: `https://picsum.photos/seed/${Math.random()}/700/400` },
    { id: '3', imageUrl: `https://picsum.photos/seed/${Math.random()}/700/400` },
  ],
  categories: [
    { id: '1', name: 'Thời trang', icon: '👕' },
    { id: '2', name: 'Điện tử', icon: '💻' },
    { id: '3', name: 'Sách', icon: '📚' },
    { id: '4', name: 'Gia dụng', icon: '🏠' },
    { id: '5', name: 'Sức khỏe', icon: '❤️' },
    { id: '6', name: 'Thể thao', icon: '⚽' },
    { id: '7', name: 'Mẹ & Bé', icon: '👶' },
    { id: '8', name: 'Làm đẹp', icon: '💅' },
  ],
  flashSale: {
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // Kết thúc sau 2 giờ
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `fs-${i}`,
      name: `Sản phẩm Flash Sale ${i + 1}`,
      imageUrl: `https://picsum.photos/seed/fs${i}/300/300`,
      originalPrice: (Math.random() * 500000 + 100000).toFixed(0),
      salePrice: (Math.random() * 90000 + 10000).toFixed(0),
      sold: Math.floor(Math.random() * 100),
    })),
  },
  featuredProducts: Array.from({ length: 10 }).map((_, i) => ({
    id: `feat-${i}`,
    name: `Sản phẩm nổi bật ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/feat${i}/300/300`,
    price: (Math.random() * 1000000 + 50000).toFixed(0),
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 500),
  })),
  newArrivals: Array.from({ length: 10 }).map((_, i) => ({
    id: `new-${i}`,
    name: `Sản phẩm mới ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/new${i}/300/300`,
    price: (Math.random() * 1200000 + 100000).toFixed(0),
  })),
  initialBestSellers: Array.from({ length: 12 }).map((_, i) => ({
    id: `bs-${i}`,
    name: `Sản phẩm bán chạy ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/bs${i}/300/300`,
    price: (Math.random() * 800000 + 80000).toFixed(0),
    location: 'Hà Nội',
  })),
};

// --- HELPER FUNCTIONS & COMPONENTS ---

// Format tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Component đếm ngược thời gian
const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        hours: hours < 10 ? `0${hours}` : hours,
        minutes: minutes < 10 ? `0${minutes}` : minutes,
        seconds: seconds < 10 ? `0${seconds}` : seconds,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <View style={styles.countdownContainer}>
      <Text style={styles.countdownBox}>{timeLeft.hours}</Text>
      <Text style={styles.countdownSeparator}>:</Text>
      <Text style={styles.countdownBox}>{timeLeft.minutes}</Text>
      <Text style={styles.countdownSeparator}>:</Text>
      <Text style={styles.countdownBox}>{timeLeft.seconds}</Text>
    </View>
  );
};

// Component tiêu đề cho mỗi section
const SectionHeader = ({ title, onViewMore }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onViewMore && (
      <TouchableOpacity onPress={onViewMore}>
        <Text style={styles.viewMoreText}>Xem thêm &gt;</Text>
      </TouchableOpacity>
    )}
  </View>
);

// --- RENDER COMPONENTS CHO CÁC DANH SÁCH ---

const renderHeroBanner = ({ item }) => (
  <Image source={{ uri: item.imageUrl }} style={styles.heroBannerImage} />
);

// --- HEADER CỦA FLATLIST CHÍNH ---
// Component này chứa tất cả các phần tử phía trên danh sách Best Sellers
const HomeScreenHeader = React.memo(({ navigation }) => {
  const bannerRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Tự động cuộn Hero Banner
  useEffect(() => {
    const interval = setInterval(() => {
      if (bannerRef.current) {
        const nextIndex = (currentBannerIndex + 1) % MOCK_DATA.heroBanners.length;
        bannerRef.current.scrollToIndex({ animated: true, index: nextIndex });
        setCurrentBannerIndex(nextIndex);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [currentBannerIndex]);

  const onMomentumScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    if(newIndex !== currentBannerIndex) {
        setCurrentBannerIndex(newIndex);
    }
  };
  
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => navigation.navigate('ProductListing', { category: item.name })}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );
  
  const renderFlashSaleItem = ({ item }) => (
    <TouchableOpacity style={styles.flashSaleItem} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
      <Image source={{ uri: item.imageUrl }} style={styles.flashSaleImage} />
      <View style={styles.flashSalePriceContainer}>
          <Text style={styles.flashSalePrice}>{formatCurrency(item.salePrice)}</Text>
          <Text style={styles.flashSaleOriginalPrice}>{formatCurrency(item.originalPrice)}</Text>
      </View>
      <View style={styles.soldBar}>
          <View style={[styles.soldBarProgress, {width: `${item.sold}%`}]} />
          <Text style={styles.soldText}>Đã bán {item.sold}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalProductItem = ({ item }) => (
      <TouchableOpacity style={styles.horizontalProductItem} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
          <Image source={{ uri: item.imageUrl }} style={styles.horizontalProductImage} />
          <Text style={styles.horizontalProductName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.horizontalProductPrice}>{formatCurrency(item.price)}</Text>
      </TouchableOpacity>
  );

  return (
    <View style={styles.headerContainer}>
      {/* 1. Hero Banner */}
      <View style={styles.heroBannerContainer}>
        <FlatList
          ref={bannerRef}
          data={MOCK_DATA.heroBanners}
          renderItem={renderHeroBanner}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          getItemLayout={(data, index) => (
            { length: screenWidth, offset: screenWidth * index, index }
          )}
        />
        <View style={styles.pagination}>
          {MOCK_DATA.heroBanners.map((_, index) => (
            <View key={index} style={[styles.dot, index === currentBannerIndex && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* 2. Categories Grid */}
      <View style={styles.sectionContainer}>
        <FlatList
          data={MOCK_DATA.categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={4}
          scrollEnabled={false}
          columnWrapperStyle={styles.categoryRow}
        />
      </View>

      {/* 3. Flash Sale */}
      <View style={styles.sectionContainer}>
        <View style={styles.flashSaleHeader}>
            <Text style={styles.flashSaleTitle}>⚡ GIẢM GIÁ SỐC ⚡</Text>
            <CountdownTimer endDate={MOCK_DATA.flashSale.endDate} />
        </View>
        <FlatList
          data={MOCK_DATA.flashSale.items}
          renderItem={renderFlashSaleItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
        />
      </View>
      
      {/* 4. Featured Products */}
      <View style={styles.sectionContainer}>
        <SectionHeader title="Sản Phẩm Nổi Bật" onViewMore={() => {}} />
        <FlatList
          data={MOCK_DATA.featuredProducts}
          renderItem={renderHorizontalProductItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
        />
      </View>
      
      {/* 5. New Arrivals */}
      <View style={styles.sectionContainer}>
        <SectionHeader title="Hàng Mới Về" onViewMore={() => {}} />
        <FlatList
          data={MOCK_DATA.newArrivals}
          renderItem={renderHorizontalProductItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
        />
      </View>

      {/* 6. Best Sellers - Header */}
      <SectionHeader title="Bán Chạy Nhất" />
    </View>
  );
});


// --- COMPONENT MÀN HÌNH CHÍNH ---
const HomeScreen = ({ navigation }) => {
  const [bestSellers, setBestSellers] = useState(MOCK_DATA.initialBestSellers);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Hàm làm mới dữ liệu
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Giả lập gọi API
    setTimeout(() => {
      // Đảo ngược danh sách để thấy sự thay đổi
      setBestSellers([...MOCK_DATA.initialBestSellers].reverse());
      setRefreshing(false);
    }, 1500);
  }, []);

  // Hàm tải thêm dữ liệu (cuộn vô hạn)
  const loadMoreBestSellers = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    // Giả lập gọi API
    setTimeout(() => {
      const moreData = Array.from({ length: 6 }).map((_, i) => ({
        id: `bs-more-${Date.now()}-${i}`,
        name: `Sản phẩm mới tải ${i + 1}`,
        imageUrl: `https://picsum.photos/seed/bs-more-${Date.now() + i}/300/300`,
        price: (Math.random() * 700000 + 50000).toFixed(0),
        location: 'TP. Hồ Chí Minh',
      }));
      setBestSellers(prev => [...prev, ...moreData]);
      setLoadingMore(false);
    }, 2000);
  }, [loadingMore]);
  
  // Render item cho FlatList chính (Best Sellers)
  const renderBestSellerItem = ({ item, index }) => (
    <TouchableOpacity style={[styles.bestSellerItem, index % 2 === 0 ? styles.bestSellerItemLeft : styles.bestSellerItemRight]} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
      <Image source={{ uri: item.imageUrl }} style={styles.bestSellerImage} />
      <View style={styles.bestSellerInfo}>
        <Text style={styles.bestSellerName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.bestSellerPrice}>{formatCurrency(item.price)}</Text>
        <Text style={styles.bestSellerLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render footer cho FlatList chính (hiển thị loading)
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bestSellers}
        renderItem={renderBestSellerItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={<HomeScreenHeader navigation={navigation} />}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreBestSellers}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0066cc']}
            tintColor={'#0066cc'}
          />
        }
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.bestSellerRow}
      />
    </SafeAreaView>
  );
};

// --- STYLESHEET ---
const COLORS = {
    primary: '#0066cc',
    secondary: '#ff7f00',
    background: '#f5f5f5',
    white: '#ffffff',
    text: '#333333',
    lightGray: '#cccccc',
    darkGray: '#888888',
    red: '#ff4d4f',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.background,
  },
  // --- Section ---
  sectionContainer: {
    backgroundColor: COLORS.white,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewMoreText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  horizontalListContent: {
    paddingHorizontal: 12,
  },
  // --- Hero Banner ---
  heroBannerContainer: {
    width: screenWidth,
    height: screenWidth * 0.5,
  },
  heroBannerImage: {
    width: screenWidth,
    height: screenWidth * 0.5,
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.white,
  },
  // --- Categories ---
  categoryRow: {
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  categoryItem: {
    width: screenWidth / 4 - 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryIcon: {
    fontSize: 30,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    color: COLORS.text,
  },
  // --- Flash Sale ---
  flashSaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  flashSaleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.red,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  countdownBox: {
    backgroundColor: COLORS.text,
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  countdownSeparator: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  flashSaleItem: {
    width: 120,
    marginHorizontal: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 8,
    overflow: 'hidden'
  },
  flashSaleImage: {
    width: '100%',
    height: 120,
  },
  flashSalePriceContainer: {
    padding: 8,
  },
  flashSalePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.red,
  },
  flashSaleOriginalPrice: {
    fontSize: 12,
    color: COLORS.lightGray,
    textDecorationLine: 'line-through',
  },
  soldBar: {
    height: 18,
    backgroundColor: '#ffcdd2',
    margin: 8,
    borderRadius: 9,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  soldBarProgress: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.red,
  },
  soldText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1
  },
  // --- Horizontal Products (Featured, New Arrivals) ---
  horizontalProductItem: {
    width: 140,
    marginHorizontal: 4,
    marginBottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: '#e8e8e8',
    borderWidth: 1,
  },
  horizontalProductImage: {
    width: '100%',
    height: 140,
  },
  horizontalProductName: {
    fontSize: 14,
    color: COLORS.text,
    marginHorizontal: 8,
    marginTop: 8,
    height: 36, // Ensure 2 lines
  },
  horizontalProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    margin: 8,
  },
  // --- Best Sellers (Grid) ---
  bestSellerRow: {
    paddingHorizontal: 8,
  },
  bestSellerItem: {
    flex: 0.5,
    backgroundColor: COLORS.white,
    marginVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  bestSellerItemLeft: {
    marginRight: 4,
  },
  bestSellerItemRight: {
    marginLeft: 4,
  },
  bestSellerImage: {
    width: '100%',
    aspectRatio: 1, // Make image square
  },
  bestSellerInfo: {
    padding: 8,
  },
  bestSellerName: {
    fontSize: 14,
    color: COLORS.text,
    minHeight: 36, // Reserve space for 2 lines
  },
  bestSellerPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  bestSellerLocation: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  // --- Loading More ---
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
