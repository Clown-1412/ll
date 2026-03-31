import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

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
        style={[
          styles.bestSellerItem,
          index % 2 === 0
            ? styles.bestSellerItemLeft
            : styles.bestSellerItemRight,
        ]}
        onPress={() =>
          navigation.navigate('ProductDetail', { productId: item.id })
        }
        accessibilityRole="button"
        accessibilityLabel={item.name}
        accessibilityHint={`Double tap to view details for ${item.name}`}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.bestSellerImage}
          accessibilityRole="image"
          accessibilityLabel={`Image of ${item.name}`}
        />
        <View style={styles.bestSellerInfo}>
          <Text style={styles.bestSellerName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.bestSellerPrice}>
            {formatCurrency(item.price)}
          </Text>
          <Text style={styles.bestSellerLocation}>{item.location}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (screen === 'ProductListingScreen') {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() =>
          navigation.navigate('ProductDetail', { productId: item.id })
        }
        accessibilityRole="button"
        accessibilityLabel={item.name}
        accessibilityHint={`Double tap to view details for ${item.name}`}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
          accessibilityRole="image"
          accessibilityLabel={`Image of ${item.name}`}
        />
        <Text style={styles.cardName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.cardPrice}>
          {formatCurrency(item.price)}
        </Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ selected: item.isFavorite }}
            accessibilityLabel={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityHint={item.isFavorite ? `Double tap to remove ${item.name} from your favorites` : `Double tap to add ${item.name} to your favorites`}
          >
            <Text>{item.isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addToCartBtn}
            accessibilityRole="button"
            accessibilityLabel="Add to cart"
            accessibilityHint={`Double tap to add ${item.name} to your cart`}
          >
            <Text style={styles.addToCartIcon}>🛒</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return null;
};

const COLORS = {
  primary: '#0066cc',
  secondary: '#ff7f00',
  background: '#f5f5f5',
  white: '#ffffff',
  text: '#333333',
  lightGray: '#cccccc',
  darkGray: '#888888',
  red: '#ff4d4f',
};

const styles = StyleSheet.create({
  // Styles from HomeScreen
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
    aspectRatio: 1,
  },
  bestSellerInfo: {
    padding: 8,
  },
  bestSellerName: {
    fontSize: 14,
    color: COLORS.text,
    minHeight: 36,
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
  // Styles from ProductListingScreen
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
});

export default React.memo(ProductListItem);
