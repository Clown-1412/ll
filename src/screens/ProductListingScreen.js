import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ProductListItem from '../components/ProductListItem';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
} from 'react-native';

// Estimate item height for getItemLayout
const ITEM_HEIGHT = 320;

// --- MOCK DATA ---
const MOCK_CATEGORIES = ['Áo thun', 'Quần jeans', 'Giày sneaker', 'Phụ kiện'];
const MOCK_PRODUCTS = Array.from({ length: 50 }).map((_, i) => ({
  id: `product-${i}`,
  name: `Sản phẩm ${i + 1}`,
  price: Math.floor(Math.random() * (2000000 - 50000 + 1)) + 50000,
  imageUrl: `https://via.placeholder.com/300/E8E8E8/000000?text=Product+${i + 1}`,
  isFavorite: Math.random() < 0.2,
  inStock: Math.random() < 0.85,
  category: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length],
  dateAdded: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
  soldCount: Math.floor(Math.random() * 1500),
}));

const SORT_OPTIONS = {
  LATEST: 'Mới nhất',
  BEST_SELLER: 'Bán chạy',
  PRICE_ASC: 'Giá tăng dần',
  PRICE_DESC: 'Giá giảm dần',
};

// --- MAIN COMPONENT ---
const ProductListingScreen = ({ route, navigation }) => {
  const [products, setProducts] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    selectedCategories: [],
    inStockOnly: false,
  });
  const [activeSort, setActiveSort] = useState(SORT_OPTIONS.LATEST);
  
  useEffect(() => {
    const initialCategory = route.params?.category;
    if (initialCategory) {
      setFilters(prev => ({ ...prev, selectedCategories: [initialCategory] }));
    }
  }, [route.params?.category]);

  const processedProducts = useMemo(() => {
    let filtered = MOCK_PRODUCTS.filter(p => {
      const priceMin = parseFloat(filters.priceMin);
      const priceMax = parseFloat(filters.priceMax);

      if (filters.priceMin && p.price < priceMin) return false;
      if (filters.priceMax && p.price > priceMax) return false;
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(p.category)) return false;
      if (filters.inStockOnly && !p.inStock) return false;

      return true;
    });
    
    switch (activeSort) {
      case SORT_OPTIONS.PRICE_ASC: filtered.sort((a, b) => a.price - b.price); break;
      case SORT_OPTIONS.PRICE_DESC: filtered.sort((a, b) => b.price - a.price); break;
      case SORT_OPTIONS.BEST_SELLER: filtered.sort((a, b) => b.soldCount - a.soldCount); break;
      case SORT_OPTIONS.LATEST:
      default: filtered.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime()); break;
    }

    return filtered;
  }, [filters, activeSort]);

  useEffect(() => {
    setProducts(processedProducts.slice(0, 10));
    setPage(1);
  }, [processedProducts]);

  const handleApplyFilters = () => setFilterModalVisible(false);
  const handleSelectSort = (option) => {
    setActiveSort(option);
    setSortModalVisible(false);
  };

  const handleLoadMore = useCallback(() => {
    if (loadingMore || products.length >= processedProducts.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const newProducts = processedProducts.slice(0, nextPage * 10);
      setProducts(newProducts);
      setPage(nextPage);
      setLoadingMore(false);
    }, 1500);
  }, [page, loadingMore, products, processedProducts]);

  const toggleCategoryFilter = (category) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  };

  const renderProductItem = ({ item, index }) => (
    <ProductListItem
      item={item}
      index={index}
      navigation={navigation}
      screen="ProductListingScreen"
    />
  );

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * (index / 2),
    index,
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Toolbar */}
      <View className="flex-row justify-around py-3 bg-white border-b border-gray-200">
        <TouchableOpacity className="flex-row items-center" onPress={() => setFilterModalVisible(true)}>
          <Text>⚙️ Lọc</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center" onPress={() => setSortModalVisible(true)}>
          <Text>⇅ {activeSort}</Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore && <ActivityIndicator size="large" color="#d9534f" className="my-5" />}
        ListEmptyComponent={<View className="flex-1 justify-center items-center mt-24"><Text className="text-lg text-gray-600">😞 Không có sản phẩm nào</Text></View>}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
      />

      {/* Filter Modal */}
      <Modal animationType="slide" transparent={true} visible={filterModalVisible} onRequestClose={() => setFilterModalVisible(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-5 w-[90%]">
            <Text className="text-xl font-bold mb-5 text-center">Bộ lọc</Text>
            <Text className="text-base font-semibold mt-4 mb-2.5">Khoảng giá</Text>
            <View className="flex-row items-center">
              <TextInput placeholder="Tối thiểu" className="flex-1 border border-gray-300 rounded-lg px-3 h-11" keyboardType="numeric" value={filters.priceMin} onChangeText={(text) => setFilters({...filters, priceMin: text})} />
              <Text> - </Text>
              <TextInput placeholder="Tối đa" className="flex-1 border border-gray-300 rounded-lg px-3 h-11" keyboardType="numeric" value={filters.priceMax} onChangeText={(text) => setFilters({...filters, priceMax: text})} />
            </View>
            <Text className="text-base font-semibold mt-4 mb-2.5">Danh mục</Text>
            {MOCK_CATEGORIES.map(cat => (
              <TouchableOpacity key={cat} className="flex-row items-center py-2" onPress={() => toggleCategoryFilter(cat)}>
                <Text>{filters.selectedCategories.includes(cat) ? '✅' : '⬜'}</Text>
                <Text className="ml-3 text-base">{cat}</Text>
              </TouchableOpacity>
            ))}
            <View className="flex-row justify-between items-center mt-4">
                <Text className="text-base font-semibold">Chỉ hiện sản phẩm còn hàng</Text>
                <Switch value={filters.inStockOnly} onValueChange={(value) => setFilters({...filters, inStockOnly: value})} />
            </View>
            <TouchableOpacity className="bg-primary rounded-lg p-3.5 mt-6 items-center" onPress={handleApplyFilters}>
                <Text className="text-white text-base font-bold">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal animationType="fade" transparent={true} visible={sortModalVisible} onRequestClose={() => setSortModalVisible(false)}>
        <TouchableOpacity className="flex-1 bg-black/50 justify-center items-center" activeOpacity={1} onPressOut={() => setSortModalVisible(false)}>
          <View className="bg-white rounded-xl p-5 w-[80%]">
            <Text className="text-xl font-bold mb-2 text-center">Sắp xếp theo</Text>
            {Object.values(SORT_OPTIONS).map(opt => (
              <TouchableOpacity key={opt} className="py-4 border-b border-gray-200" onPress={() => handleSelectSort(opt)}>
                <Text className={`text-base text-center ${activeSort === opt ? 'text-primary font-bold' : ''}`}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductListingScreen;
