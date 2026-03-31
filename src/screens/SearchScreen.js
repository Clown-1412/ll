import React, { useState, useEffect, useCallback } from 'react';
import {
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

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

// --- SEARCH SCREEN COMPONENT ---
const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState(MOCK_DATA.historyData);
  
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isGrid, setIsGrid] = useState(true);

  const handleSearchSubmit = (query) => {
    const finalQuery = query.trim();
    if (!finalQuery) return;
    
    Keyboard.dismiss();
    setHasSearched(true);
    setIsSearching(true);
    
    if (!searchHistory.some(item => item.keyword === finalQuery)) {
      setSearchHistory([ { id: `h${Date.now()}`, keyword: finalQuery }, ...searchHistory].slice(0, 10));
    }

    setTimeout(() => {
      if (finalQuery.toLowerCase() === 'trống' || finalQuery.toLowerCase() === 'xyz') {
        setSearchResults([]);
      } else {
        setSearchResults(MOCK_DATA.productsData.filter(p => p.name.toLowerCase().includes(finalQuery.toLowerCase())));
      }
      setIsSearching(false);
    }, 1500);
  };
  
  const handleSelectKeyword = (keyword) => {
    setSearchQuery(keyword);
    handleSearchSubmit(keyword);
  };

  const renderSearchBar = () => (
    <View className="flex-row items-center px-4 py-2 border-b border-gray-100">
      <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3">
        <Text className="text-lg">🔍</Text>
        <TextInput
          className="flex-1 h-10 text-base ml-2"
          placeholder="Bạn tìm gì hôm nay?"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearchSubmit(searchQuery)}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => { setSearchQuery(''); setHasSearched(false); }} className="p-1"><Text className="text-sm">❌</Text></TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={() => Alert.alert("Tìm kiếm giọng nói", "Đang nghe...")} className="ml-3 p-2"><Text className="text-2xl">🎤</Text></TouchableOpacity>
    </View>
  );

  const renderSuggestions = () => (
    <ScrollView className="flex-1">
      {searchHistory.length > 0 && (
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-text">Lịch sử tìm kiếm</Text>
            <TouchableOpacity onPress={() => setSearchHistory([])}><Text className="text-sm text-primary">Xoá tất cả</Text></TouchableOpacity>
          </View>
          {searchHistory.map(item => (
            <TouchableOpacity key={item.id} className="py-3 border-b border-gray-100" onPress={() => handleSelectKeyword(item.keyword)}>
              <Text className="text-base text-gray-600">{item.keyword}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View className="p-4">
        <Text className="text-base font-bold text-text mb-3">Tìm kiếm thịnh hành</Text>
        <View className="flex-row flex-wrap">
          {MOCK_DATA.trendingData.map(item => (
            <TouchableOpacity key={item.id} className="bg-gray-100 px-3 py-2 rounded-full mr-2.5 mb-2.5" onPress={() => handleSelectKeyword(item.keyword)}>
              <Text className="text-sm text-text">{item.keyword}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderProductItem = ({ item }) => {
    const onPress = () => navigation.navigate('ProductDetail', { productId: item.id });
    if (isGrid) {
      return (
        <TouchableOpacity className="flex-1 m-1 bg-white rounded-lg border border-gray-200 overflow-hidden" onPress={onPress}>
          <Image source={{ uri: item.imageUrl }} className="w-full aspect-square" />
          <View className="p-2">
            <Text className="text-sm text-text mb-1" numberOfLines={2}>{item.name}</Text>
            <Text className="text-base font-bold text-primary mb-1">{formatCurrency(item.price)}</Text>
            <Text className="text-xs text-gray-500">Đã bán {item.sold}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity className="flex-row m-2 bg-white rounded-lg border border-gray-200 overflow-hidden" onPress={onPress}>
        <Image source={{ uri: item.imageUrl }} className="w-32 h-32" />
        <View className="p-2 flex-1">
          <Text className="text-sm text-text mb-1" numberOfLines={2}>{item.name}</Text>
          <Text className="text-base font-bold text-primary mb-1">{formatCurrency(item.price)}</Text>
          <Text className="text-xs text-gray-500">⭐ {item.rating} | Đã bán {item.sold}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderResults = () => {
    if (searchResults.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-6xl mb-5">😞</Text>
          <Text className="text-lg font-bold text-text">Không tìm thấy kết quả</Text>
          <Text className="text-sm text-gray-500 mt-2 text-center">Hãy thử sử dụng từ khoá khác nhé.</Text>
        </View>
      );
    }
    
    return (
      <>
        <View className="flex-row justify-around py-3 bg-white border-b border-gray-100">
          <TouchableOpacity className="flex-row items-center"><Text>⚙️ Lọc</Text></TouchableOpacity>
          <TouchableOpacity className="flex-row items-center"><Text>⇅ Sắp xếp</Text></TouchableOpacity>
          <TouchableOpacity className="flex-row items-center" onPress={() => setIsGrid(!isGrid)}>
            <Text>{isGrid ? '🔲' : '📋'} {isGrid ? 'Lưới' : 'Danh sách'}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          key={isGrid ? 'G' : 'L'}
          data={searchResults}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={isGrid ? 2 : 1}
          contentContainerStyle={{paddingHorizontal: 8}}
        />
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {renderSearchBar()}
      <View className="flex-1">
        {isSearching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#d9534f" />
            <Text className="mt-2.5 text-base text-gray-500">Đang tìm kiếm...</Text>
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

export default SearchScreen;
