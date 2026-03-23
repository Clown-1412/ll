import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
  Platform,
} from 'react-native';

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

const COLORS = {
  primary: '#007bff',
  background: '#f8f9fa',
  white: '#ffffff',
  text: '#343a40',
  lightGray: '#ced4da',
  darkGray: '#6c757d',
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
  
  // This effect runs once to apply the initial category filter from navigation
  useEffect(() => {
    const initialCategory = route.params?.category;
    if (initialCategory) {
      setFilters(prev => ({ ...prev, selectedCategories: [initialCategory] }));
    }
  }, [route.params?.category]);

  // Áp dụng bộ lọc và sắp xếp
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
      case SORT_OPTIONS.PRICE_ASC:
        filtered.sort((a, b) => a.price - b.price);
        break;
      case SORT_OPTIONS.PRICE_DESC:
        filtered.sort((a, b) => b.price - a.price);
        break;
      case SORT_OPTIONS.BEST_SELLER:
         filtered.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case SORT_OPTIONS.LATEST:
      default:
        filtered.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
        break;
    }

    return filtered;
  }, [filters, activeSort]);

  // This effect syncs the visible products with the full processed list
  useEffect(() => {
    setProducts(processedProducts.slice(0, 10));
    setPage(1);
  }, [processedProducts]);

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
    // Products will be updated by the useEffect listening to processedProducts
  };
  
  const handleSelectSort = (option) => {
    setActiveSort(option);
    setSortModalVisible(false);
    // Products will be updated by the useEffect listening to processedProducts
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
    setFilters(prev => {
      const newCategories = prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category];
      return { ...prev, selectedCategories: newCategories };
    });
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Text>
        <View style={styles.cardActions}>
            <TouchableOpacity>{item.isFavorite ? '❤️' : '🤍'}</TouchableOpacity>
            <TouchableOpacity style={styles.addToCartBtn}><Text style={styles.addToCartIcon}>🛒</Text></TouchableOpacity>
        </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarButton} onPress={() => setFilterModalVisible(true)}>
          <Text>⚙️ Lọc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton} onPress={() => setSortModalVisible(true)}>
          <Text>⇅ {activeSort}</Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>😞 Không có sản phẩm nào</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bộ lọc</Text>
            {/* Price Range */}
            <Text style={styles.filterLabel}>Khoảng giá</Text>
            <View style={styles.priceInputContainer}>
              <TextInput placeholder="Tối thiểu" style={styles.priceInput} keyboardType="numeric" value={filters.priceMin} onChangeText={(text) => setFilters({...filters, priceMin: text})} />
              <Text> - </Text>
              <TextInput placeholder="Tối đa" style={styles.priceInput} keyboardType="numeric" value={filters.priceMax} onChangeText={(text) => setFilters({...filters, priceMax: text})} />
            </View>
            {/* Categories */}
            <Text style={styles.filterLabel}>Danh mục</Text>
            {MOCK_CATEGORIES.map(cat => (
              <TouchableOpacity key={cat} style={styles.checkboxContainer} onPress={() => toggleCategoryFilter(cat)}>
                <Text>{filters.selectedCategories.includes(cat) ? '✅' : '⬜'}</Text>
                <Text style={styles.checkboxLabel}>{cat}</Text>
              </TouchableOpacity>
            ))}
            {/* In Stock */}
            <View style={styles.switchContainer}>
                <Text style={styles.filterLabel}>Chỉ hiện sản phẩm còn hàng</Text>
                <Switch value={filters.inStockOnly} onValueChange={(value) => setFilters({...filters, inStockOnly: value})} />
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPressOut={() => setSortModalVisible(false)}>
          <View style={[styles.modalContent, styles.sortModal]}>
            <Text style={styles.modalTitle}>Sắp xếp theo</Text>
            {Object.values(SORT_OPTIONS).map(opt => (
              <TouchableOpacity key={opt} style={styles.sortOption} onPress={() => handleSelectSort(opt)}>
                <Text style={[styles.sortOptionText, activeSort === opt && styles.sortOptionTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridContainer: {
    padding: 8,
  },
  cardContainer: {
    flex: 0.5,
    margin: 8,
    backgroundColor: COLORS.white,
    borderRadius: 8,
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
  cardImage: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardName: {
    fontSize: 14,
    marginHorizontal: 8,
    marginTop: 8,
    color: COLORS.text,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginHorizontal: 8,
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 8,
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    padding: 6,
    borderRadius: 15,
  },
  addToCartIcon: {
      fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.darkGray,
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 15,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 14,
    marginTop: 25,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortModal: {
      width: '80%',
  },
  sortOption: {
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
  },
  sortOptionText: {
      fontSize: 16,
      textAlign: 'center',
  },
  sortOptionTextActive: {
      color: COLORS.primary,
      fontWeight: 'bold',
  },
});

export default ProductListingScreen;
