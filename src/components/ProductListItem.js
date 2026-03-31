import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

const formatCurrency = (value) => {
    if (typeof value !== 'number') {
        value = Number(value);
    }
    if (isNaN(value)) {
        return 'N/A';
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const ProductListItem = ({ item, index, screen, navigation }) => {
  if (screen === 'HomeScreen') {
    return (
      <TouchableOpacity
        className={`flex-1 bg-white my-1 rounded-lg overflow-hidden border border-gray-200 ${
          index % 2 === 0 ? 'mr-1' : 'ml-1'
        }`}
        onPress={() =>
          navigation.navigate('ProductDetail', { productId: item.id })
        }
        accessibilityRole="button"
        accessibilityLabel={item.name}
        accessibilityHint={`Double tap to view details for ${item.name}`}
      >
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full aspect-square"
          accessibilityRole="image"
          accessibilityLabel={`Image of ${item.name}`}
        />
        <View className="p-2">
          <Text className="text-sm text-text min-h-[36px]" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="text-base font-bold text-primary mt-1">
            {formatCurrency(item.price)}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">{item.location}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (screen === 'ProductListingScreen') {
    return (
      <TouchableOpacity
        className="flex-1 m-2 bg-white rounded-lg shadow-md"
        onPress={() =>
          navigation.navigate('ProductDetail', { productId: item.id })
        }
        accessibilityRole="button"
        accessibilityLabel={item.name}
        accessibilityHint={`Double tap to view details for ${item.name}`}
      >
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full aspect-square rounded-t-lg"
          accessibilityRole="image"
          accessibilityLabel={`Image of ${item.name}`}
        />
        <Text className="text-sm mx-2 mt-2 text-text" numberOfLines={2}>
          {item.name}
        </Text>
        <Text className="text-base font-bold text-primary mx-2 mt-1">
          {formatCurrency(item.price)}
        </Text>
        <View className="flex-row justify-between items-center m-2">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ selected: item.isFavorite }}
            accessibilityLabel={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityHint={item.isFavorite ? `Double tap to remove ${item.name} from your favorites` : `Double tap to add ${item.name} to your favorites`}
          >
            <Text>{item.isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary p-1.5 rounded-full"
            accessibilityRole="button"
            accessibilityLabel="Add to cart"
            accessibilityHint={`Double tap to add ${item.name} to your cart`}
          >
            <Text className="text-sm text-white">🛒</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return null;
};

export default React.memo(ProductListItem);
