import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import ProductListItem from '../components/ProductListItem';
import { styled } from "nativewind";

const StyledTouchableOpacity = styled(TouchableOpacity);

// According to the styles, the item width is (screenWidth / 2 - 12).
// With an aspect ratio of 1, the image height is the same.
// Total height is roughly: ImageHeight + Padding + NameHeight + PriceHeight + LocationHeight + Margins
// (screenWidth / 2 - 12) + 8 + 36 + 16 + 12 + 4 + 4 = (screenWidth / 2) + 68
// On a typical device (width ~400), this is ~268. We'll use a fixed value.
// NOTE: This is an estimation. For pixel-perfect layout, a more precise calculation or a fixed height from the design is needed.
const ITEM_HEIGHT = 280;

// --- MOCK DATA ---
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

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

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
        hours: hours < 10 ? `0${hours}` : String(hours),
        minutes: minutes < 10 ? `0${minutes}` : String(minutes),
        seconds: seconds < 10 ? `0${seconds}` : String(seconds),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <View className="flex-row items-center ml-3">
      <Text className="bg-text text-white font-bold text-sm px-1 py-0.5 rounded">{timeLeft.hours}</Text>
      <Text className="text-text font-bold mx-0.5">:</Text>
      <Text className="bg-text text-white font-bold text-sm px-1 py-0.5 rounded">{timeLeft.minutes}</Text>
      <Text className="text-text font-bold mx-0.5">:</Text>
      <Text className="bg-text text-white font-bold text-sm px-1 py-0.5 rounded">{timeLeft.seconds}</Text>
    </View>
  );
};

const SectionHeader = ({ title, onViewMore }) => (
  <View className="flex-row justify-between items-center px-4 py-3">
    <Text className="text-lg font-bold text-text">{title}</Text>
    {onViewMore && (
      <StyledTouchableOpacity
        onPress={onViewMore}
        accessibilityRole="button"
        accessibilityLabel={`View more ${title}`}
        accessibilityHint={`Double tap to see all ${title}`}
      >
        <Text className="text-sm text-primary">Xem thêm &gt;</Text>
      </StyledTouchableOpacity>
    )}
  </View>
);

const renderHeroBanner = ({ item }) => (
    <Image
      source={{ uri: item.imageUrl }}
      className="w-screen h-full"
      accessibilityRole="image"
      accessibilityLabel="Promotional banner"
    />
  );

const HomeScreenHeader = React.memo(({ navigation }) => {
  const bannerRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (bannerRef.current) {
        const nextIndex = (currentBannerIndex + 1) % MOCK_DATA.heroBanners.length;
        bannerRef.current.scrollToIndex({ animated: true, index: nextIndex });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [currentBannerIndex]);

  const onScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    setCurrentBannerIndex(newIndex);
};

  const renderCategoryItem = ({ item }) => (
    <StyledTouchableOpacity
      className="flex-1 items-center p-2"
      onPress={() => navigation.navigate('ProductListing', { category: item.name })}
      accessibilityRole="button"
      accessibilityLabel={item.name}
      accessibilityHint={`Double tap to see products in the ${item.name} category`}
    >
      <Text className="text-3xl">{item.icon}</Text>
      <Text className="text-xs text-center mt-1 text-text" numberOfLines={2}>{item.name}</Text>
    </StyledTouchableOpacity>
  );

  const renderFlashSaleItem = ({ item }) => (
    <StyledTouchableOpacity
      className="w-32 mx-1 border border-gray-200 rounded-lg overflow-hidden"
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, on sale for ${formatCurrency(item.salePrice)}`}
      accessibilityHint="Double tap to view this flash sale item"
    >
      <Image source={{ uri: item.imageUrl }} className="w-full h-32" />
      <View className="p-2">
          <Text className="text-base font-bold text-red-500">{formatCurrency(item.salePrice)}</Text>
          <Text className="text-xs text-gray-400 line-through">{formatCurrency(item.originalPrice)}</Text>
      </View>
      <View className="h-4.5 bg-red-100 m-2 rounded-full justify-center overflow-hidden">
          <View className="absolute inset-0 bg-red-500" style={{width: `${item.sold}%`}} />
          <Text className="text-xs text-white font-bold text-center absolute self-center">Đã bán {item.sold}</Text>
      </View>
    </StyledTouchableOpacity>
  );

  const renderHorizontalProductItem = ({ item }) => (
      <StyledTouchableOpacity
        className="w-36 mx-1 bg-white rounded-lg overflow-hidden border border-gray-200"
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        accessibilityRole="button"
        accessibilityLabel={`${item.name} for ${formatCurrency(item.price)}`}
        accessibilityHint="Double tap to view this product"
      >
          <Image source={{ uri: item.imageUrl }} className="w-full h-36" />
          <Text className="text-sm text-text mx-2 mt-2 h-9" numberOfLines={2}>{item.name}</Text>
          <Text className="text-base font-bold text-primary m-2">{formatCurrency(item.price)}</Text>
      </StyledTouchableOpacity>
  );
  
  return (
    <View>
      <View className="h-52">
        <FlatList
          ref={bannerRef}
          data={MOCK_DATA.heroBanners}
          renderItem={renderHeroBanner}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
        <View
          className="absolute bottom-2.5 flex-row self-center bg-black/20 px-2 py-1 rounded-full"
          accessible={true}
          accessibilityLabel={`Banner ${currentBannerIndex + 1} of ${MOCK_DATA.heroBanners.length}`}
        >
          {MOCK_DATA.heroBanners.map((_, index) => (
            <View key={index} className={`w-2 h-2 rounded-full mx-1 ${index === currentBannerIndex ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </View>
      </View>

      <View className="bg-white mt-2">
        <FlatList
          data={MOCK_DATA.categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={4}
          scrollEnabled={false}
          columnWrapperStyle={{justifyContent: 'space-around'}}
        />
      </View>

      <View className="bg-white mt-2">
        <View className="flex-row items-center px-4 pt-3 pb-2">
          <Text className="text-lg font-bold text-red-500">⚡ GIẢM GIÁ SỐC ⚡</Text>
          <CountdownTimer endDate={MOCK_DATA.flashSale.endDate} />
        </View>
        <FlatList
          data={MOCK_DATA.flashSale.items}
          renderItem={renderFlashSaleItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 12, paddingVertical: 10}}
        />
      </View>
      
      <View className="bg-white mt-2">
        <SectionHeader title="Sản Phẩm Nổi Bật" onViewMore={() => {}} />
        <FlatList
          data={MOCK_DATA.featuredProducts}
          renderItem={renderHorizontalProductItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 12, paddingVertical: 10}}
        />
      </View>
      
      <View className="bg-white mt-2">
        <SectionHeader title="Hàng Mới Về" onViewMore={() => {}} />
        <FlatList
          data={MOCK_DATA.newArrivals}
          renderItem={renderHorizontalProductItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 12, paddingVertical: 10}}
        />
      </View>

      <SectionHeader title="Bán Chạy Nhất" />
    </View>
  );
});

const HomeScreen = ({ navigation }) => {
  const [bestSellers, setBestSellers] = useState(MOCK_DATA.initialBestSellers);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setBestSellers([...MOCK_DATA.initialBestSellers].reverse());
      setRefreshing(false);
    }, 1500);
  }, []);

  const loadMoreBestSellers = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
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

  const renderBestSellerItem = ({ item, index }) => (
    <ProductListItem
      item={item}
      index={index}
      navigation={navigation}
      screen="HomeScreen"
    />
  );

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * Math.floor(index / 2),
    index,
  });

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-5 items-center" accessible={true} accessibilityLabel="Loading more products">
        <ActivityIndicator size="large" color="#d9534f" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-2.5 bg-white">
        <StyledTouchableOpacity 
          className="flex-1 flex-row items-center bg-background rounded-full px-4 py-2.5 mr-2.5"
          onPress={() => navigation.navigate('Search')}
          accessibilityRole="search"
          accessibilityLabel="Search for products"
          accessibilityHint="Double tap to open the search screen"
        >
          <Text className="mr-2">🔍</Text>
          <Text className="text-gray-500">Tìm kiếm sản phẩm...</Text>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity 
          className="p-1.5"
          onPress={() => navigation.navigate('Cart')}
          accessibilityRole="button"
          accessibilityLabel="View your cart"
        >
          <Text className="text-2xl">🛒</Text>
        </StyledTouchableOpacity>
      </View>
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
            colors={['#d9534f']}
            tintColor={'#d9534f'}
          />
        }
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ paddingHorizontal: 8 }}
        // Performance Optimizations
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
