import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  SafeAreaView,
  Keyboard,
  ScrollView,
} from 'react-native';

// --- MOCK DATA ---
const MOCK_DATA = {
  historyData: [
    { id: 'h1', keyword: 'iphone 14 pro max' },
    { id: 'h2', keyword: 'tai nghe bluetooth' },
    { id: 'h3', keyword: 'sạc dự phòng' },
  ],
  trendingData: [
    { id: 't1', keyword: 'Balo nam' },
    { id: 't2', keyword: 'Áo thun' },
    { id: 't3', keyword: 'Giày sneaker' },
    { id: 't4', keyword: 'Son môi' },
    { id: 't5', keyword: 'Đồng hồ' },
    { id: 't6', keyword: 'Váy' },
  ],
  productsData: Array.from({ length: 50 }).map((_, i) => ({
    id: `p${i}`,
    name: `Sản phẩm ${i + 1} Lorem Ipsum Dolor Sit Amet`,
    price: (Math.random() * 2000000 + 100000).toFixed(0),
    imageUrl: `https://via.placeholder.com/300/CCCCCC/FFFFFF?text=Product+${i + 1}`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    sold: Math.floor(Math.random() * 1500),
  })),
};

const COLORS = {
  primary: '#0066cc',
  background: '#f5f5f5',
  white: '#ffffff',
  text: '#333333',
  lightGray: '#cccccc',
  darkGray: '#888888',
  blue: '#3498db',
};

// --- SEARCH SCREEN COMPONENT ---
const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState(MOCK_DATA.historyData);
  
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isGrid, setIsGrid] = useState(true);

  // Hàm xử lý khi người dùng nhấn tìm kiếm
  const handleSearchSubmit = (query) => {
    const finalQuery = query.trim();
    if (!finalQuery) return;
    
    Keyboard.dismiss();
    setHasSearched(true);
    setIsSearching(true);
    
    // Cập nhật lịch sử tìm kiếm
    if (!searchHistory.some(item => item.keyword === finalQuery)) {
      const newHistoryItem = { id: `h${Date.now()}`, keyword: finalQuery };
      setSearchHistory([newHistoryItem, ...searchHistory].slice(0, 10)); // Giới hạn 10 mục
    }

    // Giả lập API call với độ trễ 1.5 giây
    setTimeout(() => {
      // Logic tìm kiếm đặc biệt để test
      if (finalQuery.toLowerCase() === 'trống' || finalQuery.toLowerCase() === 'xyz') {
        setSearchResults([]);
      } else {
        const results = MOCK_DATA.productsData.filter(product => 
          product.name.toLowerCase().includes(finalQuery.toLowerCase())
        );
        setSearchResults(results);
      }
      setIsSearching(false);
    }, 1500);
  };
  
  const handleSelectKeyword = (keyword) => {
    setSearchQuery(keyword);
    handleSearchSubmit(keyword);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setSearchResults([]);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleVoiceSearch = () => {
    Alert.alert("Tìm kiếm giọng nói", "Đang nghe...");
  };
  
  // Component Search Bar
  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <View style={styles.textInputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Bạn tìm gì hôm nay?"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearchSubmit(searchQuery)}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Text style={styles.clearIcon}>❌</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={handleVoiceSearch} style={styles.micButton}>
        <Text style={styles.micIcon}>🎤</Text>
      </TouchableOpacity>
    </View>
  );

  // Component màn hình Gợi ý (trước khi tìm kiếm)
  const renderSuggestions = () => (
    <ScrollView style={styles.suggestionsContainer}>
      {/* Lịch sử tìm kiếm */}
      {searchHistory.length > 0 && (
        <View style={styles.suggestionSection}>
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionTitle}>Lịch sử tìm kiếm</Text>
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearHistoryText}>Xoá tất cả</Text>
            </TouchableOpacity>
          </View>
          {searchHistory.map(item => (
            <TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => handleSelectKeyword(item.keyword)}>
              <Text style={styles.historyKeyword}>{item.keyword}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* Từ khóa thịnh hành */}
      <View style={styles.suggestionSection}>
        <Text style={styles.suggestionTitle}>Tìm kiếm thịnh hành</Text>
        <View style={styles.trendingContainer}>
          {MOCK_DATA.trendingData.map(item => (
            <TouchableOpacity key={item.id} style={styles.trendingChip} onPress={() => handleSelectKeyword(item.keyword)}>
              <Text style={styles.trendingKeyword}>{item.keyword}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  // Component render item sản phẩm
  const renderProductItem = ({ item }) => {
    const onPress = () => navigation.navigate('ProductDetail', { productId: item.id });
    if (isGrid) {
      return (
        <TouchableOpacity style={styles.productGridItem} onPress={onPress}>
          <Image source={{ uri: item.imageUrl }} style={styles.productGridImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.productPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Text>
            <Text style={styles.productSold}>Đã bán {item.sold}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.productListItem} onPress={onPress}>
        <Image source={{ uri: item.imageUrl }} style={styles.productListImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Text>
          <Text style={styles.productRating}>⭐ {item.rating} | Đã bán {item.sold}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Component màn hình Kết quả tìm kiếm
  const renderResults = () => {
    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>😞</Text>
          <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
          <Text style={styles.emptySubText}>Hãy thử sử dụng từ khoá khác nhé.</Text>
        </View>
      );
    }
    
    return (
      <>
        {/* Toolbar Lọc/Sắp xếp */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarButton}><Text>⚙️ Lọc</Text></TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}><Text>⇅ Sắp xếp</Text></TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => setIsGrid(!isGrid)}>
            <Text>{isGrid ? '🔲' : '📋'} {isGrid ? 'Lưới' : 'Danh sách'}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          key={isGrid ? 'G' : 'L'} // Quan trọng: Thay đổi key để force re-render
          data={searchResults}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={isGrid ? 2 : 1}
          contentContainerStyle={styles.resultsList}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderSearchBar()}
      <View style={styles.content}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
          </View>
        ) : hasSearched ? (
          renderResults()
        ) : (
          renderSuggestions()
        )}
      </View>
    </SafeAreaView>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
  },
  // Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginLeft: 8,
  },
  searchIcon: { fontSize: 18 },
  clearButton: { padding: 4 },
  clearIcon: { fontSize: 14 },
  micButton: {
    marginLeft: 12,
    padding: 8,
  },
  micIcon: { fontSize: 24 },
  // Suggestions
  suggestionsContainer: {
    flex: 1,
  },
  suggestionSection: {
    padding: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  clearHistoryText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  historyKeyword: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trendingChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  trendingKeyword: {
    fontSize: 14,
    color: COLORS.text,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 8,
    textAlign: 'center',
  },
  // Results
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsList: {
    paddingHorizontal: 8,
  },
  // Product Grid Item
  productGridItem: {
    flex: 0.5,
    margin: 4,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    overflow: 'hidden',
  },
  productGridImage: {
    width: '100%',
    aspectRatio: 1,
  },
  // Product List Item
  productListItem: {
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    overflow: 'hidden',
  },
  productListImage: {
    width: 120,
    height: 120,
  },
  // Product Info (Shared)
  productInfo: {
    padding: 8,
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  productSold: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  productRating: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
});

export default SearchScreen;
